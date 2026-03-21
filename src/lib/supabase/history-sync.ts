import type { QuizSessionRecord } from '@/context/ProgressContext'

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

/**
 * Push a single quiz session to Supabase (called on quiz completion).
 * Uses upsert so re-syncing the same session is idempotent.
 */
export async function pushSessionToCloud(
  userId: string,
  session: QuizSessionRecord
): Promise<void> {
  if (!hasSupabaseConfig()) return
  try {
    const supabase = await getSupabaseClient()
    await supabase
      .from('rr_session_history')
      .upsert(
        {
          id: session.id,
          user_id: userId,
          module_slug: session.moduleSlug,
          module_title: session.moduleTitle,
          vehicle_type: session.vehicleType,
          score: session.score,
          total: session.total,
          percent: session.percent,
          passed: session.passed,
          xp_earned: session.xpEarned,
          completed_at: session.completedAt,
          answers: session.answers,
        },
        { onConflict: 'user_id,id' }
      )
  } catch {
    // Silently fail — localStorage is the fallback
  }
}

/**
 * Pull all quiz sessions from Supabase for the current user.
 * Returns them in the same shape as localStorage records.
 */
export async function pullSessionsFromCloud(
  userId: string
): Promise<QuizSessionRecord[]> {
  if (!hasSupabaseConfig()) return []
  try {
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
      .from('rr_session_history')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .limit(100)

    if (error || !data) return []

    return data.map((row) => ({
      id: row.id,
      moduleSlug: row.module_slug,
      moduleTitle: row.module_title,
      vehicleType: row.vehicle_type,
      score: row.score,
      total: row.total,
      percent: row.percent,
      passed: row.passed,
      xpEarned: row.xp_earned,
      completedAt: row.completed_at,
      answers: row.answers as QuizSessionRecord['answers'],
    }))
  } catch {
    return []
  }
}

/**
 * Merge cloud sessions with local sessions.
 * Deduplicates by session ID, keeping the union of both.
 * Returns sorted newest-first.
 */
export function mergeHistories(
  local: QuizSessionRecord[],
  cloud: QuizSessionRecord[]
): QuizSessionRecord[] {
  const map = new Map<string, QuizSessionRecord>()
  // Cloud first so local overwrites if same ID
  for (const s of cloud) map.set(s.id, s)
  for (const s of local) map.set(s.id, s)
  return Array.from(map.values()).sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  )
}

/**
 * Push all local sessions to cloud (bulk sync on login).
 */
export async function pushAllSessionsToCloud(
  userId: string,
  sessions: QuizSessionRecord[]
): Promise<void> {
  if (!hasSupabaseConfig() || sessions.length === 0) return
  try {
    const supabase = await getSupabaseClient()
    const rows = sessions.map((session) => ({
      id: session.id,
      user_id: userId,
      module_slug: session.moduleSlug,
      module_title: session.moduleTitle,
      vehicle_type: session.vehicleType,
      score: session.score,
      total: session.total,
      percent: session.percent,
      passed: session.passed,
      xp_earned: session.xpEarned,
      completed_at: session.completedAt,
      answers: session.answers,
    }))
    await supabase
      .from('rr_session_history')
      .upsert(rows, { onConflict: 'user_id,id' })
  } catch {
    // Silently fail
  }
}
