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
import { MOCK_EXAMS, MOCK_EXAM_XP, MOCK_EXAM_PASS_PERCENT } from '@/lib/questions/mockExamConfig'
import { playPass, playFail } from '@/lib/sounds'
import { firePassConfetti } from '@/lib/confetti'

function formatTimeSpent(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}m ${s}s`
}

export default function MockExamResultsPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const vehicleType = params.vehicleType as string
  const examId = params.examId as string
  const { recordCompletion, saveQuizSession } = useProgress()

  const exam = MOCK_EXAMS.find((e) => e.id === examId)
  const score = parseInt(searchParams.get('score') ?? '0', 10)
  const total = parseInt(searchParams.get('total') ?? '45', 10)
  const timeSpent = parseInt(searchParams.get('time') ?? '0', 10)
  const percent = Math.round((score / total) * 100)
  const passed = percent >= MOCK_EXAM_PASS_PERCENT

  const xpEarned = Math.round((score / total) * MOCK_EXAM_XP)

  const [saved, setSaved] = useState(false)
  const [showWrongAnswers, setShowWrongAnswers] = useState(false)
  const [sessionAnswers, setSessionAnswers] = useState<QuizAnswerRecord[]>([])

  useEffect(() => {
    if (!saved) {
      // Record completion
      recordCompletion(`${vehicleType}:mock-exam-${examId}`, score, total, xpEarned)

      // Load session answers from localStorage
      try {
        const stored = localStorage.getItem('road-ready-last-session')
        const answers: QuizAnswerRecord[] = stored ? JSON.parse(stored) : []
        setSessionAnswers(answers)

        saveQuizSession({
          id: `mock-exam-${examId}-${Date.now()}`,
          moduleSlug: `mock-exam-${examId}`,
          moduleTitle: exam?.title ?? `Mock Test ${examId}`,
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
  }, [saved, examId, score, total, xpEarned, percent, passed, vehicleType, exam, recordCompletion, saveQuizSession])

  const wrongAnswers = sessionAnswers.filter((a) => !a.isCorrect)

  return (
    <div className="min-h-dvh bg-background">
      <Header showBack backHref={`/quiz/${vehicleType}/mock-exam`} title={`${exam?.title ?? 'Mock Test'} Results`} />
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
            {passed ? 'PASSED' : 'FAILED'}
          </Badge>
          <h2 className="font-headline text-5xl font-bold text-primary mb-1">
            {score}<span className="text-2xl text-on-surface-variant">/{total}</span>
          </h2>
          <p className="font-headline text-lg text-tertiary font-bold mb-4">{percent}% Accuracy</p>
          <ProgressBar value={percent} max={100} color={passed ? 'success' : 'error'} size="lg" />
          <p className="mt-3 text-sm text-on-surface-variant">
            {passed
              ? 'Excellent! You passed the mock exam!'
              : `You need ${MOCK_EXAM_PASS_PERCENT}% to pass. Keep practicing!`}
          </p>
        </NeoCard>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <NeoCard level={1} shadow="none" className="text-center !p-4">
            <span className="material-symbols-outlined text-secondary mb-1" style={{ fontSize: 24 }}>star</span>
            <p className="font-headline text-lg font-bold text-primary">+{xpEarned}</p>
            <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider">XP Earned</p>
          </NeoCard>
          <NeoCard level={1} shadow="none" className="text-center !p-4">
            <span className="material-symbols-outlined text-success mb-1" style={{ fontSize: 24 }}>check_circle</span>
            <p className="font-headline text-lg font-bold text-success">{score}</p>
            <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider">Correct</p>
          </NeoCard>
          <NeoCard level={1} shadow="none" className="text-center !p-4">
            <span className="material-symbols-outlined text-error mb-1" style={{ fontSize: 24 }}>cancel</span>
            <p className="font-headline text-lg font-bold text-error">{total - score}</p>
            <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider">Wrong</p>
          </NeoCard>
          <NeoCard level={1} shadow="none" className="text-center !p-4">
            <span className="material-symbols-outlined text-tertiary mb-1" style={{ fontSize: 24 }}>timer</span>
            <p className="font-headline text-lg font-bold text-tertiary">{formatTimeSpent(timeSpent)}</p>
            <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider">Time Spent</p>
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
              Review Wrong Answers ({wrongAnswers.length})
            </NeoButton>

            {showWrongAnswers && (
              <div className="mt-4 space-y-3">
                {wrongAnswers.map((answer, idx) => (
                  <NeoCard key={idx} level={1} shadow="none" className="border-l-4 border-l-error">
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
                      <p className="text-xs text-on-surface-variant bg-surface-container-lowest p-2 border-l-2 border-l-tertiary">
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
          <Link href={`/quiz/${vehicleType}/mock-exam/${examId}`}>
            <NeoButton variant={passed ? 'tertiary' : 'primary'} size="lg" icon="replay" fullWidth>
              {passed ? 'Practice Again' : 'Try Again'}
            </NeoButton>
          </Link>
          <Link href={`/quiz/${vehicleType}/mock-exam`}>
            <NeoButton variant="secondary" size="lg" icon="list" fullWidth className="mt-3">
              Try Another Test
            </NeoButton>
          </Link>
          <Link href={`/quiz/${vehicleType}`}>
            <NeoButton variant="ghost" size="lg" icon="arrow_back" fullWidth className="mt-3">
              Back to Modules
            </NeoButton>
          </Link>
        </div>
      </main>
    </div>
  )
}
