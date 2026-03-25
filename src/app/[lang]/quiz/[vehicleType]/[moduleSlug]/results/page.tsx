'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { NeoCard } from '@/components/ui/NeoCard'
import { NeoButton } from '@/components/ui/NeoButton'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useProgress } from '@/context/ProgressContext'
import type { QuizAnswerRecord } from '@/context/ProgressContext'
import { playPass, playFail } from '@/lib/sounds'
import { firePassConfetti } from '@/lib/confetti'
import { useDictionary, useLocale } from '@/i18n/DictionaryContext'
import { localePath } from '@/i18n/utils'

const MODULE_XP: Record<string, number> = {
  'road-signs': 100,
  'traffic-rules': 100,
  'hazard-perception': 120,
  'driving-conditions': 80,
  'critical-situations': 120,
  'driving-behavior': 80,
  'vehicle-maintenance': 60,
}

export default function ResultsPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const vehicleType = params.vehicleType as string
  const moduleSlug = params.moduleSlug as string
  const { recordCompletion, saveQuizSession } = useProgress()
  const dict = useDictionary()
  const locale = useLocale()

  const moduleTitle = (dict.modules as Record<string, { title: string; description: string }>)[moduleSlug]?.title ?? moduleSlug

  const score = parseInt(searchParams.get('score') ?? '0', 10)
  const total = parseInt(searchParams.get('total') ?? '30', 10)
  const percent = Math.round((score / total) * 100)
  const passed = percent >= 71

  const baseXp = MODULE_XP[moduleSlug] ?? 80
  const xpEarned = Math.round((score / total) * baseXp)

  const [saved, setSaved] = useState(false)
  const [showWrongAnswers, setShowWrongAnswers] = useState(false)
  const [sessionAnswers, setSessionAnswers] = useState<QuizAnswerRecord[]>([])

  useEffect(() => {
    if (!saved) {
      // Record completion scoped to vehicle type (e.g. "B:road-signs")
      recordCompletion(`${vehicleType}:${moduleSlug}`, score, total, xpEarned)

      // Load session answers from localStorage
      try {
        const stored = localStorage.getItem('road-ready-last-session')
        const answers: QuizAnswerRecord[] = stored ? JSON.parse(stored) : []
        setSessionAnswers(answers)

        // Save full session to history
        saveQuizSession({
          id: `${moduleSlug}-${Date.now()}`,
          moduleSlug,
          moduleTitle,
          vehicleType,
          score,
          total,
          percent,
          passed,
          xpEarned,
          completedAt: new Date().toISOString(),
          answers,
        })
      } catch {}

      // Play sound + confetti
      if (passed) {
        playPass()
        firePassConfetti()
      } else {
        playFail()
      }

      setSaved(true)
    }
  }, [saved, moduleSlug, moduleTitle, score, total, xpEarned, percent, passed, vehicleType, recordCompletion, saveQuizSession])

  const wrongAnswers = sessionAnswers.filter((a) => !a.isCorrect)

  return (
    <div className="min-h-dvh bg-background">
      <Header showBack backHref={localePath(locale, `/quiz/${vehicleType}`)} title={dict.results.title} />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* Score Display */}
        <NeoCard level={2} shadow={passed ? 'secondary' : 'default'} className="text-center mb-6">
          <div className="mb-4">
            <span
              className={`material-symbols-outlined ${passed ? 'text-secondary' : 'text-error'}`}
              style={{ fontSize: 64 }}
            >
              {passed ? 'emoji_events' : 'sentiment_dissatisfied'}
            </span>
          </div>
          <Badge variant={passed ? 'success' : 'error'} className="mb-4">
            {passed ? dict.common.passed : dict.common.failed}
          </Badge>
          <h2 className="font-headline text-5xl font-bold text-primary mb-1">
            {score}<span className="text-2xl text-on-surface-variant">/{total}</span>
          </h2>
          <p className="font-headline text-lg text-tertiary font-bold mb-4">{dict.results.accuracy.replace('{percent}', String(percent))}</p>
          <ProgressBar value={percent} max={100} color={passed ? 'success' : 'error'} size="lg" />
          <p className="mt-3 text-sm text-on-surface-variant">
            {passed ? dict.results.passMessage : dict.results.failMessage}
          </p>
        </NeoCard>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <NeoCard level={1} shadow="none" className="text-center !p-4">
            <span className="material-symbols-outlined text-secondary mb-1" style={{ fontSize: 24 }}>star</span>
            <p className="font-headline text-lg font-bold text-primary">+{xpEarned}</p>
            <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider">{dict.results.xpEarned}</p>
          </NeoCard>
          <NeoCard level={1} shadow="none" className="text-center !p-4">
            <span className="material-symbols-outlined text-success mb-1" style={{ fontSize: 24 }}>check_circle</span>
            <p className="font-headline text-lg font-bold text-success">{score}</p>
            <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider">{dict.common.correct}</p>
          </NeoCard>
          <NeoCard level={1} shadow="none" className="text-center !p-4">
            <span className="material-symbols-outlined text-error mb-1" style={{ fontSize: 24 }}>cancel</span>
            <p className="font-headline text-lg font-bold text-error">{total - score}</p>
            <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider">{dict.common.wrong}</p>
          </NeoCard>
        </div>

        {/* Review Wrong Answers */}
        {wrongAnswers.length > 0 && (
          <div className="mb-6">
            <NeoButton
              variant="tertiary"
              size="md"
              icon={showWrongAnswers ? 'expand_less' : 'expand_more'}
              fullWidth
              onClick={() => setShowWrongAnswers(!showWrongAnswers)}
            >
              {dict.results.reviewWrongAnswers.replace('{count}', String(wrongAnswers.length))}
            </NeoButton>

            {showWrongAnswers && (
              <div className="mt-4 space-y-3">
                {wrongAnswers.map((answer, idx) => (
                  <NeoCard key={idx} level={1} shadow="none" className="border-s-4 border-s-error">
                    <p className="font-headline text-sm font-bold text-primary mb-2">
                      {answer.questionText}
                    </p>
                    <div className="space-y-1 mb-3">
                      {answer.selectedAnswerText !== '(Skipped)' && (
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-error" style={{ fontSize: 16 }}>close</span>
                          <span className="text-sm text-error line-through">{answer.selectedAnswerText}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-success" style={{ fontSize: 16 }}>check</span>
                        <span className="text-sm text-success font-semibold">{answer.correctAnswerText}</span>
                      </div>
                    </div>
                    {answer.explanation && (
                      <p className="text-xs text-on-surface-variant bg-surface-container-lowest p-2 border-s-2 border-s-tertiary">
                        {answer.explanation}
                      </p>
                    )}
                  </NeoCard>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link href={localePath(locale, `/quiz/${vehicleType}/${moduleSlug}`)}>
            <NeoButton variant={passed ? 'tertiary' : 'primary'} size="lg" icon="replay" fullWidth>
              {passed ? dict.results.practiceAgain : dict.results.tryAgain}
            </NeoButton>
          </Link>
          <Link href={localePath(locale, `/quiz/${vehicleType}`)}>
            <NeoButton variant="ghost" size="lg" icon="arrow_back" fullWidth className="mt-3">
              {dict.results.backToModules}
            </NeoButton>
          </Link>
        </div>
      </main>
    </div>
  )
}
