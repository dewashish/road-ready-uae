'use client'

import { Header } from '@/components/layout/Header'
import { BottomNav } from '@/components/layout/BottomNav'
import { CategoryCard } from '@/components/home/CategoryCard'
import { NeoCard } from '@/components/ui/NeoCard'
import { VEHICLE_CATEGORIES } from '@/types/quiz'
import { useProgress } from '@/context/ProgressContext'

const ALL_MODULE_SLUGS = [
  'road-signs', 'traffic-rules', 'hazard-perception',
  'driving-conditions', 'critical-situations', 'driving-behavior', 'vehicle-maintenance',
]

export default function HomePage() {
  const { progress } = useProgress()
  const dailyDone = progress.dailyChallenge?.completed ?? 0
  const dailyTarget = progress.dailyChallenge?.target ?? 10

  // Count completed modules per vehicle type (keys are "B:road-signs", etc.)
  // Also checks legacy unscoped keys for backwards compatibility
  function getVehicleProgress(vehicleType: string) {
    const completed = ALL_MODULE_SLUGS.filter(
      (slug) => {
        const scoped = progress.modules[`${vehicleType}:${slug}`]?.completionCount ?? 0
        const legacy = progress.modules[slug]?.completionCount ?? 0
        return (vehicleType === 'B' ? (scoped > 0 || legacy > 0) : scoped > 0)
      }
    ).length
    return completed
  }

  return (
    <div className="min-h-dvh bg-background pb-20 sm:pb-0">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-10">
          <h2 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-primary mb-3">
            Theory <span className="text-secondary">Mastery</span>
          </h2>
          <p className="text-on-surface-variant text-base sm:text-lg max-w-xl">
            Master the UAE driving theory test with 570+ practice questions,
            smart learning paths, and mock exams.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-8">
          <NeoCard level={1} shadow="none" className="text-center !p-4">
            <span className="material-symbols-outlined text-secondary mb-1" style={{ fontSize: 24 }}>quiz</span>
            <p className="font-headline text-xl font-bold text-primary">570+</p>
            <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider">Questions</p>
          </NeoCard>
          <NeoCard level={1} shadow="none" className="text-center !p-4">
            <span className="material-symbols-outlined text-tertiary mb-1" style={{ fontSize: 24 }}>category</span>
            <p className="font-headline text-xl font-bold text-primary">7</p>
            <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider">Modules</p>
          </NeoCard>
          <NeoCard level={1} shadow="none" className="text-center !p-4">
            <span className="material-symbols-outlined text-success mb-1" style={{ fontSize: 24 }}>verified</span>
            <p className="font-headline text-xl font-bold text-primary">71%</p>
            <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider">Pass Mark</p>
          </NeoCard>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="font-headline text-xl font-bold text-primary uppercase tracking-wider">Choose Your Vehicle</h3>
            <div className="flex-1 h-0.5 bg-surface-container-highest" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {VEHICLE_CATEGORIES.map((category) => {
              const completed = getVehicleProgress(category.type)
              return (
                <CategoryCard
                  key={category.type}
                  category={category}
                  completedModules={completed}
                  status={completed >= 7 ? 'completed' : completed > 0 ? 'active' : 'new'}
                />
              )
            })}
          </div>
        </div>

        <NeoCard level={1} shadow="secondary" className="mt-8">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-secondary/20 border-2 border-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary" style={{ fontSize: 24 }}>local_fire_department</span>
            </div>
            <div className="flex-1">
              <h4 className="font-headline text-base font-bold text-secondary">Daily Challenge</h4>
              <p className="text-sm text-on-surface-variant">Answer {dailyTarget} questions today to maintain your streak</p>
            </div>
            <div className="font-headline text-2xl font-bold text-secondary">
              {Math.min(dailyDone, dailyTarget)}/{dailyTarget}
            </div>
          </div>
        </NeoCard>
      </main>
      <BottomNav />
    </div>
  )
}
