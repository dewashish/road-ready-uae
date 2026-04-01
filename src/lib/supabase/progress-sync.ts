/**
 * Cloud sync for vehicle-scoped module progress and weekly snapshots.
 * Complements history-sync.ts (which handles raw session records).
 *
 * Tables used:
 *   - rr_vehicle_module_progress  (per-user, per-vehicle, per-module)
 *   - rr_weekly_progress          (per-user, per-vehicle, per-week)
 *
 * All operations gracefully fail — localStorage is the fallback.
 */

import type { UserProgress, ModuleProgress } from '@/lib/progress'

function hasSupabaseConfig() {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

async function getSupabaseClient() {
  const { createClient } = await import('@/lib/supabase/client')
  return createClient()
}

// ── Push module progress after quiz completion ──────────────────────────

export async function pushModuleProgressToCloud(
  userId: string,
  vehicleType: string,
  moduleSlug: string,
  score: number,
  total: number,
  questionsSeen: number,
  xpEarned: number
): Promise<void> {
  if (!hasSupabaseConfig()) return
  try {
    const supabase = await getSupabaseClient()
    // Use the DB helper functions for atomic upsert
    await supabase.rpc('upsert_vehicle_module_progress', {
      p_user_id: userId,
      p_vehicle_type: vehicleType,
      p_module_slug: moduleSlug,
      p_score: score,
      p_total: total,
      p_questions_seen: questionsSeen,
    })
    await supabase.rpc('upsert_weekly_progress', {
      p_user_id: userId,
      p_vehicle_type: vehicleType,
      p_score: score,
      p_total: total,
      p_xp: xpEarned,
    })
  } catch {
    // Silently fail — localStorage is the fallback
  }
}

// ── Pull all vehicle module progress for a user ─────────────────────────

export interface CloudModuleProgress {
  vehicleType: string
  moduleSlug: string
  bestScore: number
  bestPercent: number
  attempts: number
  questionsSeen: number
  totalQuestions: number
  totalCorrect: number
  lastAttempted: string | null
  firstCompleted: string | null
}

export async function pullModuleProgressFromCloud(
  userId: string
): Promise<CloudModuleProgress[]> {
  if (!hasSupabaseConfig()) return []
  try {
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
      .from('rr_vehicle_module_progress')
      .select('*')
      .eq('user_id', userId)

    if (error || !data) return []

    return data.map((row) => ({
      vehicleType: row.vehicle_type,
      moduleSlug: row.module_slug,
      bestScore: row.best_score,
      bestPercent: row.best_percent,
      attempts: row.attempts,
      questionsSeen: row.questions_seen,
      totalQuestions: row.total_questions,
      totalCorrect: row.total_correct,
      lastAttempted: row.last_attempted,
      firstCompleted: row.first_completed,
    }))
  } catch {
    return []
  }
}

// ── Pull weekly progress for sidebar chart ──────────────────────────────

export interface CloudWeeklyProgress {
  vehicleType: string
  weekStart: string
  sessionsCount: number
  avgScore: number
  bestScore: number
  totalXp: number
  questionsAnswered: number
  questionsCorrect: number
}

export async function pullWeeklyProgressFromCloud(
  userId: string,
  vehicleType: string,
  weeks: number = 8
): Promise<CloudWeeklyProgress[]> {
  if (!hasSupabaseConfig()) return []
  try {
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
      .from('rr_weekly_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('vehicle_type', vehicleType)
      .order('week_start', { ascending: false })
      .limit(weeks)

    if (error || !data) return []

    return data.map((row) => ({
      vehicleType: row.vehicle_type,
      weekStart: row.week_start,
      sessionsCount: row.sessions_count,
      avgScore: row.avg_score,
      bestScore: row.best_score,
      totalXp: row.total_xp,
      questionsAnswered: row.questions_answered,
      questionsCorrect: row.questions_correct,
    }))
  } catch {
    return []
  }
}

// ── Bulk push local progress to cloud (on login) ───────────────────────

export async function pushAllModuleProgressToCloud(
  userId: string,
  localProgress: UserProgress,
  questionsSeen?: Record<string, number>
): Promise<void> {
  if (!hasSupabaseConfig()) return
  try {
    const supabase = await getSupabaseClient()

    const rows = Object.entries(localProgress.modules)
      .filter(([key]) => key.includes(':'))
      .map(([key, mod]) => {
        const [vehicleType, moduleSlug] = key.split(':')
        return {
          user_id: userId,
          vehicle_type: vehicleType,
          module_slug: moduleSlug,
          best_score: (mod as ModuleProgress).bestScore,
          best_percent: (mod as ModuleProgress).bestPercent,
          attempts: (mod as ModuleProgress).completionCount,
          questions_seen: questionsSeen?.[key] ?? 0,
          total_questions: (mod as ModuleProgress).totalQuestionsAnswered,
          total_correct: (mod as ModuleProgress).totalCorrect,
          last_attempted: (mod as ModuleProgress).lastCompletedAt,
          first_completed: (mod as ModuleProgress).lastCompletedAt,
        }
      })

    if (rows.length === 0) return

    await supabase
      .from('rr_vehicle_module_progress')
      .upsert(rows, { onConflict: 'user_id,vehicle_type,module_slug' })
  } catch {
    // Silently fail
  }
}

// ── Merge cloud module progress into local UserProgress ─────────────────

export function mergeCloudProgressIntoLocal(
  local: UserProgress,
  cloud: CloudModuleProgress[]
): UserProgress {
  const merged = { ...local, modules: { ...local.modules } }

  for (const cp of cloud) {
    const key = `${cp.vehicleType}:${cp.moduleSlug}`
    const existing = merged.modules[key]

    if (!existing) {
      merged.modules[key] = {
        completionCount: cp.attempts,
        bestScore: cp.bestScore,
        bestPercent: cp.bestPercent,
        lastCompletedAt: cp.lastAttempted,
        totalQuestionsAnswered: cp.totalQuestions,
        totalCorrect: cp.totalCorrect,
      }
    } else {
      // Take the best of local vs cloud
      merged.modules[key] = {
        completionCount: Math.max(existing.completionCount, cp.attempts),
        bestScore: Math.max(existing.bestScore, cp.bestScore),
        bestPercent: Math.max(existing.bestPercent, cp.bestPercent),
        lastCompletedAt:
          existing.lastCompletedAt && cp.lastAttempted
            ? new Date(existing.lastCompletedAt) > new Date(cp.lastAttempted)
              ? existing.lastCompletedAt
              : cp.lastAttempted
            : existing.lastCompletedAt || cp.lastAttempted,
        totalQuestionsAnswered: Math.max(existing.totalQuestionsAnswered, cp.totalQuestions),
        totalCorrect: Math.max(existing.totalCorrect, cp.totalCorrect),
      }
    }
  }

  return merged
}
