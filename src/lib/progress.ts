'use client'

export interface ModuleProgress {
  completionCount: number
  bestScore: number
  bestPercent: number
  lastCompletedAt: string | null
  totalQuestionsAnswered: number
  totalCorrect: number
}

export interface UserProgress {
  totalXp: number
  currentStreak: number
  longestStreak: number
  lastActiveDate: string | null
  modules: Record<string, ModuleProgress>
  dailyChallenge: {
    date: string
    completed: number
    target: number
  }
}

const STORAGE_KEY = 'road-ready-uae-progress'

export const DEFAULT_PROGRESS: UserProgress = {
  totalXp: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: null,
  modules: {},
  dailyChallenge: {
    date: '',
    completed: 0,
    target: 10,
  },
}

const MODULE_SLUGS = [
  'road-signs', 'traffic-rules', 'hazard-perception',
  'driving-conditions', 'critical-situations', 'driving-behavior', 'vehicle-maintenance',
]

/** Migrate legacy unscoped module keys (e.g. "road-signs") to vehicle-scoped keys (e.g. "B:road-signs") */
function migrateToVehicleScoped(progress: UserProgress): UserProgress {
  let changed = false
  for (const slug of MODULE_SLUGS) {
    if (progress.modules[slug] && !progress.modules[`B:${slug}`]) {
      // Move legacy key to B: (Light Vehicle) since that was the only option before
      progress.modules[`B:${slug}`] = progress.modules[slug]
      delete progress.modules[slug]
      changed = true
    }
  }
  if (changed) {
    saveProgress(progress)
  }
  return progress
}

export function getProgress(): UserProgress {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return DEFAULT_PROGRESS
    const progress = JSON.parse(stored) as UserProgress
    return migrateToVehicleScoped(progress)
  } catch {
    return DEFAULT_PROGRESS
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch {
    // Storage full or unavailable
  }
}

export function getModuleProgress(moduleSlug: string): ModuleProgress {
  const progress = getProgress()
  return (
    progress.modules[moduleSlug] ?? {
      completionCount: 0,
      bestScore: 0,
      bestPercent: 0,
      lastCompletedAt: null,
      totalQuestionsAnswered: 0,
      totalCorrect: 0,
    }
  )
}

export function recordModuleCompletion(
  moduleSlug: string,
  score: number,
  total: number,
  xpEarned: number
): UserProgress {
  const progress = getProgress()
  const existing = progress.modules[moduleSlug] ?? {
    completionCount: 0,
    bestScore: 0,
    bestPercent: 0,
    lastCompletedAt: null,
    totalQuestionsAnswered: 0,
    totalCorrect: 0,
  }

  const percent = Math.round((score / total) * 100)

  progress.modules[moduleSlug] = {
    completionCount: existing.completionCount + 1,
    bestScore: Math.max(existing.bestScore, score),
    bestPercent: Math.max(existing.bestPercent, percent),
    lastCompletedAt: new Date().toISOString(),
    totalQuestionsAnswered: existing.totalQuestionsAnswered + total,
    totalCorrect: existing.totalCorrect + score,
  }

  // Update XP
  progress.totalXp += xpEarned

  // Update streak
  const today = new Date().toISOString().split('T')[0]
  if (progress.lastActiveDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
    if (progress.lastActiveDate === yesterday) {
      progress.currentStreak += 1
    } else if (progress.lastActiveDate !== today) {
      progress.currentStreak = 1
    }
    progress.longestStreak = Math.max(progress.longestStreak, progress.currentStreak)
    progress.lastActiveDate = today
  }

  // Update daily challenge
  if (progress.dailyChallenge.date !== today) {
    progress.dailyChallenge = { date: today, completed: 0, target: 10 }
  }
  progress.dailyChallenge.completed += total

  saveProgress(progress)
  return progress
}

export function getTotalStats(progress: UserProgress) {
  const modules = Object.values(progress.modules)
  const totalCompleted = modules.reduce((sum, m) => sum + m.completionCount, 0)
  const totalAnswered = modules.reduce((sum, m) => sum + m.totalQuestionsAnswered, 0)
  const totalCorrect = modules.reduce((sum, m) => sum + m.totalCorrect, 0)
  const avgPercent = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0

  return { totalCompleted, totalAnswered, totalCorrect, avgPercent }
}
