'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { BottomNav } from '@/components/layout/BottomNav'
import { NeoCard } from '@/components/ui/NeoCard'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useProgress } from '@/context/ProgressContext'
import { VEHICLE_CATEGORIES } from '@/types/quiz'
import { getModuleSeenStats } from '@/lib/questions/modulePools'
import { MOCK_EXAMS } from '@/lib/questions/mockExamConfig'
import { useDictionary, useLocale } from '@/i18n/DictionaryContext'
import { localePath } from '@/i18n/utils'

const MODULES = [
  { slug: 'road-signs', icon: 'signpost', questionCount: 30, xp: 100 },
  { slug: 'traffic-rules', icon: 'gavel', questionCount: 30, xp: 100 },
  { slug: 'hazard-perception', icon: 'warning', questionCount: 30, xp: 120 },
  { slug: 'driving-conditions', icon: 'cloud', questionCount: 20, xp: 80 },
  { slug: 'critical-situations', icon: 'emergency', questionCount: 20, xp: 120 },
  { slug: 'driving-behavior', icon: 'shield', questionCount: 20, xp: 80 },
  { slug: 'vehicle-maintenance', icon: 'build', questionCount: 15, xp: 60 },
]

export default function ModulePathPage() {
  const params = useParams()
  const vehicleType = params.vehicleType as string
  const category = VEHICLE_CATEGORIES.find((c) => c.type === vehicleType)
  const dict = useDictionary()
  const locale = useLocale()

  const vehicleDict = (dict as any).vehicles?.[vehicleType]
  const categoryName = vehicleDict?.name ?? category?.name ?? 'Vehicle'
  const categoryDescription = vehicleDict?.description ?? category?.description

  const { progress, getQuizHistory } = useProgress()
  const history = getQuizHistory()

  const allModulesCompleted = MODULES.every(
    (m) => (progress.modules[`${vehicleType}:${m.slug}`]?.completionCount ?? 0) > 0
  )

  const mockAttempts = MOCK_EXAMS.reduce((sum, e) => sum + (progress.modules[`${vehicleType}:mock-exam-${e.id}`]?.completionCount ?? 0), 0)
  const mockBest = Math.max(0, ...MOCK_EXAMS.map(e => progress.modules[`${vehicleType}:mock-exam-${e.id}`]?.bestPercent ?? 0))

  return (
    <div className="min-h-dvh bg-background pb-20 sm:pb-0">
      <Header showBack backHref="/" title={categoryName} />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Category Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-surface-container-lowest border-2 border-surface-container-lowest flex items-center justify-center">
            <span className="material-symbols-outlined text-secondary" style={{ fontSize: 32 }}>
              {category?.icon ?? 'directions_car'}
            </span>
          </div>
          <div>
            <h2 className="font-headline text-2xl font-bold text-primary">{categoryName}</h2>
            <p className="text-sm text-on-surface-variant">{categoryDescription}</p>
          </div>
          {progress && (
            <div className="ms-auto text-end">
              <p className="font-headline text-lg font-bold text-secondary">{progress.totalXp} XP</p>
              <p className="font-label text-xs text-on-surface-variant uppercase tracking-wider">
                {progress.currentStreak} {dict.common.dayStreak}
              </p>
            </div>
          )}
        </div>

        {/* Module List - ALL UNLOCKED */}
        <div className="space-y-4">
          {MODULES.map((mod, idx) => {
            const modProgress = progress.modules[`${vehicleType}:${mod.slug}`]
            const completions = modProgress?.completionCount ?? 0
            const bestPercent = modProgress?.bestPercent ?? 0
            const seenStats = getModuleSeenStats(mod.slug, vehicleType, history)
            const modDict = (dict as any).modules?.[mod.slug]
            const modTitle = modDict?.title ?? mod.slug
            const modDescription = modDict?.description ?? ''

            return (
              <div key={mod.slug} className="relative">
                {idx > 0 && (
                  <div className="absolute left-7 -top-4 w-0.5 h-4 bg-surface-container-highest" />
                )}
                <Link href={localePath(locale, `/quiz/${vehicleType}/${mod.slug}`)}>
                  <NeoCard level={2} shadow="default" className="group neo-hover cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-14 h-14 bg-surface-container-lowest border-2 border-surface-container-lowest flex items-center justify-center relative transition-colors group-hover:bg-secondary">
                        <span className="material-symbols-outlined text-secondary transition-colors group-hover:text-surface-container-lowest" style={{ fontSize: 28 }}>
                          {mod.icon}
                        </span>
                        {completions > 0 && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-success border-2 border-surface-container-lowest flex items-center justify-center">
                            <span className="material-symbols-outlined text-surface" style={{ fontSize: 14 }}>
                              check
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-headline text-base font-bold text-primary">{modTitle}</h3>
                          {completions > 0 ? (
                            <Badge variant="success">
                              {dict.quiz.timesDone.replace('{count}', String(completions))}
                            </Badge>
                          ) : (
                            <Badge variant="info">{dict.common.start}</Badge>
                          )}
                        </div>
                        <p className="text-sm text-on-surface-variant mb-2">{modDescription}</p>
                        <div className="flex items-center gap-3">
                          {completions > 0 ? (
                            <>
                              <ProgressBar value={bestPercent} max={100} color="success" size="sm" className="flex-1" />
                              <span className="font-label text-[10px] text-success font-bold whitespace-nowrap">
                                {dict.quiz.bestScore.replace('{percent}', String(bestPercent))}
                              </span>
                            </>
                          ) : (
                            <>
                              <ProgressBar value={0} max={mod.questionCount} color="tertiary" size="sm" className="flex-1" />
                              <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider whitespace-nowrap">
                                {dict.quiz.questionsCount.replace('{count}', String(mod.questionCount))}
                              </span>
                            </>
                          )}
                          <span className="font-label text-[10px] text-secondary whitespace-nowrap">
                            +{mod.xp} XP
                          </span>
                        </div>
                        {seenStats.total > 0 && (
                          <p className="font-label text-[10px] text-on-surface-variant mt-1">
                            {dict.quiz.questionsSeen
                              .replace('{seen}', String(seenStats.seen))
                              .replace('{total}', String(seenStats.total))
                              .replace('{percent}', String(seenStats.percent))}
                          </p>
                        )}
                      </div>
                      <span className="material-symbols-outlined text-on-surface-variant icon-directional" style={{ fontSize: 20 }}>
                        chevron_right
                      </span>
                    </div>
                  </NeoCard>
                </Link>
              </div>
            )
          })}

          {/* Mock Exam */}
          <div className="relative">
            <div className="absolute left-7 -top-4 w-0.5 h-4 bg-surface-container-highest" />
            {allModulesCompleted ? (
              <Link href={localePath(locale, `/quiz/${vehicleType}/mock-exam`)}>
                <NeoCard level={2} shadow="secondary" className="neo-hover cursor-pointer border-secondary/50">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-14 h-14 bg-secondary/10 border-2 border-secondary flex items-center justify-center">
                      <span className="material-symbols-outlined text-secondary" style={{ fontSize: 28 }}>
                        military_tech
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-headline text-base font-bold text-secondary">{dict.mockExam.title}</h3>
                        {mockAttempts > 0 ? (
                          <Badge variant={mockBest >= 71 ? 'success' : 'info'}>
                            {dict.quiz.timesDone.replace('{count}', String(mockAttempts))}
                          </Badge>
                        ) : (
                          <Badge variant="warning">{dict.mockExam.unlocked}</Badge>
                        )}
                      </div>
                      <p className="text-sm text-on-surface-variant">
                        {dict.mockExam.mockExamsInfo}
                      </p>
                      {mockAttempts > 0 && (
                        <div className="flex items-center gap-3 mt-2">
                          <ProgressBar value={mockBest} max={100} color={mockBest >= 71 ? 'success' : 'tertiary'} size="sm" className="flex-1" />
                          <span className="font-label text-[10px] text-success font-bold whitespace-nowrap">
                            {dict.quiz.bestScore.replace('{percent}', String(mockBest))}
                          </span>
                        </div>
                      )}
                    </div>
                    <span className="material-symbols-outlined text-secondary icon-directional" style={{ fontSize: 20 }}>
                      chevron_right
                    </span>
                  </div>
                </NeoCard>
              </Link>
            ) : (
              <NeoCard level={1} shadow="none" className="opacity-50">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-14 h-14 bg-secondary/10 border-2 border-secondary/30 flex items-center justify-center">
                    <span className="material-symbols-outlined text-secondary/50" style={{ fontSize: 28 }}>
                      military_tech
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-headline text-base font-bold text-primary/50">{dict.mockExam.title}</h3>
                      <Badge variant="locked">
                        <span className="material-symbols-outlined" style={{ fontSize: 12 }}>lock</span>
                        {dict.mockExam.completeAllModules}
                      </Badge>
                    </div>
                    <p className="text-sm text-outline">
                      {dict.mockExam.completeAllModulesDesc}
                    </p>
                  </div>
                </div>
              </NeoCard>
            )}
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
