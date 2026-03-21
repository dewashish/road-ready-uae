'use client'

import { Header } from '@/components/layout/Header'
import { BottomNav } from '@/components/layout/BottomNav'
import { NeoCard } from '@/components/ui/NeoCard'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useProgress } from '@/context/ProgressContext'
import { getTotalStats, type ModuleProgress } from '@/lib/progress'
import { getModuleSeenStats } from '@/lib/questions/modulePools'

const MODULE_INFO = [
  { slug: 'road-signs', title: 'Traffic Signs', icon: 'signpost' },
  { slug: 'traffic-rules', title: 'Road Rules', icon: 'gavel' },
  { slug: 'hazard-perception', title: 'Hazard Perception', icon: 'warning' },
  { slug: 'driving-conditions', title: 'Driving Conditions', icon: 'cloud' },
  { slug: 'critical-situations', title: 'Critical Situations', icon: 'emergency' },
  { slug: 'driving-behavior', title: 'Safe Driving', icon: 'shield' },
  { slug: 'vehicle-maintenance', title: 'Vehicle Knowledge', icon: 'build' },
]

const VEHICLE_TYPES = ['A', 'B', 'C', 'D', 'E']

/** Aggregate seen stats across all vehicle types for a module */
function getAggregatedSeenStats(
  slug: string,
  history: { moduleSlug: string; vehicleType: string; answers: { questionId: string }[] }[]
): { seen: number; total: number; percent: number } {
  let totalSeen = 0
  let totalPool = 0
  for (const vt of VEHICLE_TYPES) {
    const stats = getModuleSeenStats(slug, vt, history as Parameters<typeof getModuleSeenStats>[2])
    if (stats.total > 0) {
      totalSeen += stats.seen
      totalPool += stats.total
    }
  }
  if (totalPool === 0) return { seen: 0, total: 0, percent: 0 }
  return { seen: totalSeen, total: totalPool, percent: Math.round((totalSeen / totalPool) * 100) }
}

/** Aggregate a module's progress across all vehicle types (and legacy unscoped keys) */
function getAggregatedModuleProgress(
  modules: Record<string, ModuleProgress>,
  slug: string
): { bestPercent: number; completions: number } {
  let bestPercent = 0
  let completions = 0
  // Check legacy unscoped key (e.g. "road-signs")
  const legacy = modules[slug]
  if (legacy) {
    bestPercent = Math.max(bestPercent, legacy.bestPercent)
    completions += legacy.completionCount
  }
  // Check vehicle-scoped keys (e.g. "B:road-signs")
  for (const vt of VEHICLE_TYPES) {
    const scoped = modules[`${vt}:${slug}`]
    if (scoped) {
      bestPercent = Math.max(bestPercent, scoped.bestPercent)
      completions += scoped.completionCount
    }
  }
  return { bestPercent, completions }
}

export default function ProgressPage() {
  const { progress, getQuizHistory } = useProgress()
  const stats = getTotalStats(progress)
  const history = getQuizHistory()

  return (
    <div className="min-h-dvh bg-background pb-20 sm:pb-0">
      <Header title="Progress" />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <h2 className="font-headline text-3xl font-bold text-primary mb-6">
          Your <span className="text-tertiary">Progress</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <NeoCard level={2} shadow="default" className="text-center !p-4">
            <p className="font-headline text-3xl font-bold text-primary">{progress.totalXp}</p>
            <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider mt-1">Total XP</p>
          </NeoCard>
          <NeoCard level={2} shadow="default" className="text-center !p-4">
            <p className="font-headline text-3xl font-bold text-tertiary">{stats.avgPercent}%</p>
            <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider mt-1">Avg Score</p>
          </NeoCard>
          <NeoCard level={2} shadow="default" className="text-center !p-4">
            <p className="font-headline text-3xl font-bold text-success">{stats.totalCompleted}</p>
            <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider mt-1">Quizzes Done</p>
          </NeoCard>
          <NeoCard level={2} shadow="default" className="text-center !p-4">
            <p className="font-headline text-3xl font-bold text-secondary">{progress.currentStreak}</p>
            <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider mt-1">Day Streak</p>
          </NeoCard>
        </div>

        <h3 className="font-headline text-lg font-bold text-primary uppercase tracking-wider mb-4">Module Mastery</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {MODULE_INFO.map((mod) => {
            const { bestPercent, completions } = getAggregatedModuleProgress(progress.modules, mod.slug)
            const seenStats = getAggregatedSeenStats(mod.slug, history)
            return (
              <NeoCard key={mod.slug} level={1} shadow="none">
                <div className="flex items-center gap-3 mb-3">
                  <span className="material-symbols-outlined text-secondary" style={{ fontSize: 24 }}>{mod.icon}</span>
                  <span className="font-headline text-sm font-bold text-primary flex-1">{mod.title}</span>
                  {completions > 0 && (
                    <span className="font-label text-[10px] text-on-surface-variant bg-surface-container-highest px-2 py-0.5">
                      {completions}x
                    </span>
                  )}
                  <span className="font-headline text-sm font-bold text-tertiary">{bestPercent}%</span>
                </div>
                <ProgressBar value={bestPercent} max={100} color={bestPercent >= 71 ? 'success' : 'tertiary'} size="sm" />
                {seenStats.total > 0 && (
                  <p className="font-label text-[10px] text-on-surface-variant mt-2">
                    {seenStats.seen}/{seenStats.total} questions seen ({seenStats.percent}%)
                  </p>
                )}
              </NeoCard>
            )
          })}
        </div>

        {stats.totalCompleted === 0 && (
          <NeoCard level={1} shadow="none" className="text-center !py-12 mt-6">
            <span className="material-symbols-outlined text-outline" style={{ fontSize: 48 }}>history</span>
            <p className="mt-3 text-on-surface-variant">No activity yet. Start a quiz to see your progress!</p>
          </NeoCard>
        )}
      </main>
      <BottomNav />
    </div>
  )
}
