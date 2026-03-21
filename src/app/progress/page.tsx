import { Header } from '@/components/layout/Header'
import { BottomNav } from '@/components/layout/BottomNav'
import { NeoCard } from '@/components/ui/NeoCard'
import { ProgressBar } from '@/components/ui/ProgressBar'

const MASTERY_DATA = [
  { module: 'Traffic Signs', icon: 'signpost', mastery: 0, color: 'tertiary' as const },
  { module: 'Road Rules', icon: 'gavel', mastery: 0, color: 'tertiary' as const },
  { module: 'Hazard Perception', icon: 'warning', mastery: 0, color: 'tertiary' as const },
  { module: 'Mock Exams', icon: 'military_tech', mastery: 0, color: 'secondary' as const },
]

export default function ProgressPage() {
  return (
    <div className="min-h-dvh bg-background pb-20 sm:pb-0">
      <Header title="Progress" />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <h2 className="font-headline text-3xl font-bold text-primary mb-6">
          Your <span className="text-tertiary">Progress</span>
        </h2>

        {/* Overall Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <NeoCard level={2} shadow="default" className="text-center !p-4">
            <p className="font-headline text-3xl font-bold text-primary">0%</p>
            <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider mt-1">
              Total Progress
            </p>
          </NeoCard>
          <NeoCard level={2} shadow="default" className="text-center !p-4">
            <p className="font-headline text-3xl font-bold text-tertiary">0%</p>
            <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider mt-1">
              Avg Score
            </p>
          </NeoCard>
          <NeoCard level={2} shadow="default" className="text-center !p-4">
            <p className="font-headline text-3xl font-bold text-success">0</p>
            <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider mt-1">
              Quizzes Passed
            </p>
          </NeoCard>
          <NeoCard level={2} shadow="default" className="text-center !p-4">
            <p className="font-headline text-3xl font-bold text-secondary">0</p>
            <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider mt-1">
              Day Streak
            </p>
          </NeoCard>
        </div>

        {/* Mastery Cards */}
        <div className="mb-6">
          <h3 className="font-headline text-lg font-bold text-primary uppercase tracking-wider mb-4">
            Module Mastery
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {MASTERY_DATA.map((item) => (
              <NeoCard key={item.module} level={1} shadow="none">
                <div className="flex items-center gap-3 mb-3">
                  <span className="material-symbols-outlined text-secondary" style={{ fontSize: 24 }}>
                    {item.icon}
                  </span>
                  <span className="font-headline text-sm font-bold text-primary">{item.module}</span>
                  <span className="ml-auto font-headline text-sm font-bold text-tertiary">
                    {item.mastery}%
                  </span>
                </div>
                <ProgressBar value={item.mastery} max={100} color={item.color} size="sm" />
              </NeoCard>
            ))}
          </div>
        </div>

        {/* Activity Feed Placeholder */}
        <div>
          <h3 className="font-headline text-lg font-bold text-primary uppercase tracking-wider mb-4">
            Recent Activity
          </h3>
          <NeoCard level={1} shadow="none" className="text-center !py-12">
            <span className="material-symbols-outlined text-outline" style={{ fontSize: 48 }}>
              history
            </span>
            <p className="mt-3 text-on-surface-variant">
              No activity yet. Start a quiz to see your history!
            </p>
          </NeoCard>
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
