'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { QuestionCard } from '@/components/quiz/QuestionCard'
import { NeoButton } from '@/components/ui/NeoButton'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useQuiz } from '@/hooks/useQuiz'
import { useProgress } from '@/context/ProgressContext'
import { useDictionary, useLocale } from '@/i18n/DictionaryContext'
import { localePath } from '@/i18n/utils'
import { buildWrongCountMap, buildSeenSet, selectWeightedQuestions } from '@/lib/questions/selectWeightedQuestions'
import { loadTranslatedQuestions } from '@/lib/questions/loadTranslatedQuestions'
import { MODULE_POOLS } from '@/lib/questions/modulePools'
import { playCorrect, playWrong } from '@/lib/sounds'

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()
  const dict = useDictionary()
  const locale = useLocale()
  const vehicleType = params.vehicleType as string
  const moduleSlug = params.moduleSlug as string
  const { getModuleHistory } = useProgress()
  const {
    state,
    currentQuestion,
    startQuiz,
    selectAnswer,
    checkAnswer,
    nextQuestion,
    skipQuestion,
  } = useQuiz()

  useEffect(() => {
    async function loadQuiz() {
      const pool = MODULE_POOLS[moduleSlug]
      if (!pool) return
      // Filter by vehicle type
      const filtered = pool.filter(
        (q) => q.vehicle_types.includes(vehicleType) || q.vehicle_types.includes('B')
      )
      // Weighted selection: prioritize previously-wrong and unseen questions
      const sessions = getModuleHistory(moduleSlug).filter(s => s.vehicleType === vehicleType)
      const wrongCounts = buildWrongCountMap(sessions)
      const seenIds = buildSeenSet(sessions)
      const shuffled = selectWeightedQuestions(filtered, wrongCounts, seenIds, 30)
      // Translate questions for current locale
      const translated = await loadTranslatedQuestions(moduleSlug, locale, shuffled)
      // Shuffle answer order within each question
      const withShuffledAnswers = translated.map((q) => {
        const answers = [...q.answers]
        for (let i = answers.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [answers[i], answers[j]] = [answers[j], answers[i]]
        }
        return { ...q, answers: answers.map((a, i) => ({ ...a, display_order: i + 1 })) }
      })
      startQuiz(withShuffledAnswers)
    }
    loadQuiz()
  }, [moduleSlug, vehicleType, locale, startQuiz])

  // Play correct/wrong sounds
  const prevIsAnsweredRef = useRef(false)
  useEffect(() => {
    if (state.isAnswered && !prevIsAnsweredRef.current) {
      const currentQ = state.questions[state.currentIndex]
      if (currentQ) {
        const answer = state.answers[currentQ.id]
        if (answer) {
          answer.isCorrect ? playCorrect() : playWrong()
        }
      }
    }
    prevIsAnsweredRef.current = state.isAnswered
  }, [state.isAnswered, state.currentIndex, state.questions, state.answers])

  if (state.status === 'loading' || !currentQuestion) {
    return (
      <div className="min-h-dvh bg-background flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-secondary animate-pulse" style={{ fontSize: 48 }}>
            quiz
          </span>
          <p className="mt-4 font-headline text-lg text-on-surface-variant">
            {dict.quiz.loadingQuestions}
          </p>
        </div>
      </div>
    )
  }

  // Navigate to results when quiz completes (in useEffect to avoid render side-effects)
  useEffect(() => {
    if (state.status !== 'completed') return
    localStorage.setItem('road-ready-last-session', JSON.stringify(state.sessionAnswers))
    router.push(
      localePath(locale, `/quiz/${vehicleType}/${moduleSlug}/results?score=${state.score}&total=${state.questions.length}`)
    )
  }, [state.status, state.sessionAnswers, state.score, state.questions.length, router, locale, vehicleType, moduleSlug])

  if (state.status === 'completed') return null

  const moduleTitle = (dict.modules as Record<string, { title: string }>)[moduleSlug]?.title ?? moduleSlug
  const progress = ((state.currentIndex + 1) / state.questions.length) * 100

  return (
    <div className="min-h-dvh bg-background">
      <Header showBack backHref={`/quiz/${vehicleType}`} title={moduleTitle} />

      {/* Progress Bar */}
      <div className="sticky top-16 z-40 bg-surface border-b-2 border-surface-container-lowest px-4 py-3">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-label text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              {dict.quiz.questionOf.replace('{current}', String(state.currentIndex + 1)).replace('{total}', String(state.questions.length))}
            </span>
            <div className="flex-1" />
            <span className="font-label text-xs font-bold text-tertiary">
              {dict.quiz.complete.replace('{percent}', String(Math.round(progress)))}
            </span>
          </div>
          <ProgressBar value={progress} max={100} color="tertiary" size="sm" />
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        <QuestionCard
          question={currentQuestion}
          questionNumber={state.currentIndex + 1}
          totalQuestions={state.questions.length}
          selectedAnswerId={state.selectedAnswerId}
          isAnswered={state.isAnswered}
          onSelectAnswer={selectAnswer}
        />

        {/* Action Buttons */}
        <div className="flex gap-3">
          {!state.isAnswered ? (
            <>
              <NeoButton
                variant="ghost"
                size="md"
                icon="skip_next"
                onClick={skipQuestion}
              >
                {dict.common.skip}
              </NeoButton>
              <NeoButton
                variant="primary"
                size="md"
                icon="check"
                onClick={checkAnswer}
                disabled={!state.selectedAnswerId}
                fullWidth
              >
                {dict.quiz.checkAnswer}
              </NeoButton>
            </>
          ) : (
            <NeoButton
              variant="secondary"
              size="md"
              icon="arrow_forward"
              onClick={nextQuestion}
              fullWidth
            >
              {state.currentIndex + 1 >= state.questions.length ? dict.quiz.seeResults : dict.quiz.nextQuestion}
            </NeoButton>
          )}
        </div>

        {/* Score tracker */}
        <div className="mt-6 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-success" style={{ fontSize: 18 }}>
              check_circle
            </span>
            <span className="font-label text-sm font-bold text-success">{state.score}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-error" style={{ fontSize: 18 }}>
              cancel
            </span>
            <span className="font-label text-sm font-bold text-error">
              {Object.values(state.answers).filter((a) => !a.isCorrect).length}
            </span>
          </div>
        </div>
      </main>
    </div>
  )
}
