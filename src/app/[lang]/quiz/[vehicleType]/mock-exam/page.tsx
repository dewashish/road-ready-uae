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
import { MOCK_EXAMS, MOCK_EXAM_PASS_PERCENT } from '@/lib/questions/mockExamConfig'
import { useDictionary, useLocale } from '@/i18n/DictionaryContext'
import { localePath } from '@/i18n/utils'

export default function MockExamSelectionPage() {
  const params = useParams()
  const vehicleType = params.vehicleType as string
  const category = VEHICLE_CATEGORIES.find((c) => c.type === vehicleType)
  const { progress } = useProgress()
  const dict = useDictionary()
  const locale = useLocale()

  const vehicleName = (dict as any).vehicles?.[vehicleType]?.name ?? category?.name ?? 'Vehicle'

  // Aggregate stats across all mock exams
  const allMockStats = MOCK_EXAMS.map((exam) => {
    const key = `${vehicleType}:mock-exam-${exam.id}`
    return progress.modules[key]
  })
  const totalAttempts = allMockStats.reduce((sum, m) => sum + (m?.completionCount ?? 0), 0)
  const overallBest = Math.max(0, ...allMockStats.map((m) => m?.bestPercent ?? 0))

  return (
    <div className="min-h-dvh bg-background pb-20 sm:pb-0">
      <Header showBack backHref={localePath(locale, `/quiz/${vehicleType}`)} title={dict.mockExam.title} />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-2">
          <div className="w-16 h-16 bg-secondary/10 border-2 border-secondary flex items-center justify-center">
            <span className="material-symbols-outlined text-secondary" style={{ fontSize: 32 }}>
              military_tech
            </span>
          </div>
          <div className="flex-1">
            <h2 className="font-headline text-2xl font-bold text-primary">{dict.mockExam.title}</h2>
            <p className="text-sm text-on-surface-variant">
              {dict.mockExam.simulateDesc} — {vehicleName}
            </p>
          </div>
        </div>

        {/* Overall stats */}
        {totalAttempts > 0 && (
          <div className="grid grid-cols-2 gap-3 mb-6 mt-4">
            <NeoCard level={1} shadow="none" className="text-center !p-3">
              <p className="font-headline text-2xl font-bold text-secondary">{overallBest}%</p>
              <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider">{dict.mockExam.bestScore}</p>
            </NeoCard>
            <NeoCard level={1} shadow="none" className="text-center !p-3">
              <p className="font-headline text-2xl font-bold text-tertiary">{totalAttempts}</p>
              <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider">{dict.mockExam.totalAttempts}</p>
            </NeoCard>
          </div>
        )}

        {/* Exam info banner */}
        <NeoCard level={1} shadow="none" className="!p-3 mb-6 mt-4">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-tertiary" style={{ fontSize: 20 }}>info</span>
            <p className="text-sm text-on-surface-variant">
              {dict.mockExam.examInfo
                .replace('{questions}', '45')
                .replace('{minutes}', '30')
                .replace('{percent}', String(MOCK_EXAM_PASS_PERCENT))}
            </p>
          </div>
        </NeoCard>

        {/* Mock Exam List */}
        <div className="space-y-4">
          {MOCK_EXAMS.map((exam, idx) => {
            const modProgress = progress.modules[`${vehicleType}:mock-exam-${exam.id}`]
            const completions = modProgress?.completionCount ?? 0
            const bestPercent = modProgress?.bestPercent ?? 0

            return (
              <Link key={exam.id} href={localePath(locale, `/quiz/${vehicleType}/mock-exam/${exam.id}`)}>
                <NeoCard
                  level={2}
                  shadow={completions > 0 && bestPercent >= MOCK_EXAM_PASS_PERCENT ? 'secondary' : 'default'}
                  className="neo-hover cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-14 h-14 bg-secondary/10 border-2 border-secondary flex items-center justify-center relative">
                      <span className="font-headline text-xl font-bold text-secondary">
                        {idx + 1}
                      </span>
                      {completions > 0 && bestPercent >= MOCK_EXAM_PASS_PERCENT && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-success border-2 border-surface-container-lowest flex items-center justify-center">
                          <span className="material-symbols-outlined text-surface" style={{ fontSize: 14 }}>
                            check
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-headline text-base font-bold text-primary">{exam.title}</h3>
                        {completions > 0 ? (
                          <Badge variant={bestPercent >= MOCK_EXAM_PASS_PERCENT ? 'success' : 'info'}>
                            {dict.quiz.timesDone.replace('{count}', String(completions))}
                          </Badge>
                        ) : (
                          <Badge variant="warning">{dict.common.new}</Badge>
                        )}
                      </div>
                      <p className="text-sm text-on-surface-variant mb-2">{exam.subtitle}</p>
                      <div className="flex items-center gap-3">
                        {completions > 0 ? (
                          <>
                            <ProgressBar value={bestPercent} max={100} color={bestPercent >= MOCK_EXAM_PASS_PERCENT ? 'success' : 'tertiary'} size="sm" className="flex-1" />
                            <span className="font-label text-[10px] text-success font-bold whitespace-nowrap">
                              {dict.quiz.bestScore.replace('{percent}', String(bestPercent))}
                            </span>
                          </>
                        ) : (
                          <>
                            <ProgressBar value={0} max={100} color="tertiary" size="sm" className="flex-1" />
                            <span className="font-label text-[10px] text-on-surface-variant whitespace-nowrap">
                              45 Qs · 30 min
                            </span>
                          </>
                        )}
                        <span className="font-label text-[10px] text-secondary whitespace-nowrap">
                          +200 XP
                        </span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-secondary icon-directional" style={{ fontSize: 20 }}>
                      chevron_right
                    </span>
                  </div>
                </NeoCard>
              </Link>
            )
          })}
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
