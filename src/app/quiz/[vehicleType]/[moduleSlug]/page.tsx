'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { QuestionCard } from '@/components/quiz/QuestionCard'
import { NeoButton } from '@/components/ui/NeoButton'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useQuiz } from '@/hooks/useQuiz'
import type { Question } from '@/types/quiz'

// Import all question data
import roadSignsData from '@/data/questions/road-signs.json'
import trafficRulesData from '@/data/questions/traffic-rules.json'
import hazardPerceptionData from '@/data/questions/hazard-perception.json'
import drivingConditionsData from '@/data/questions/driving-conditions.json'
import criticalSituationsData from '@/data/questions/critical-situations.json'
import drivingBehaviorData from '@/data/questions/driving-behavior.json'
import vehicleMaintenanceData from '@/data/questions/vehicle-maintenance.json'

const MODULE_DATA: Record<string, { questions: Question[]; title: string }> = {
  'road-signs': { questions: roadSignsData as Question[], title: 'Traffic Signs' },
  'traffic-rules': { questions: trafficRulesData as Question[], title: 'Road Rules' },
  'hazard-perception': { questions: hazardPerceptionData as Question[], title: 'Hazard Perception' },
  'driving-conditions': { questions: drivingConditionsData as Question[], title: 'Driving Conditions' },
  'critical-situations': { questions: criticalSituationsData as Question[], title: 'Critical Situations' },
  'driving-behavior': { questions: drivingBehaviorData as Question[], title: 'Safe Driving' },
  'vehicle-maintenance': { questions: vehicleMaintenanceData as Question[], title: 'Vehicle Knowledge' },
}

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()
  const vehicleType = params.vehicleType as string
  const moduleSlug = params.moduleSlug as string
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
    const moduleInfo = MODULE_DATA[moduleSlug]
    if (moduleInfo) {
      // Filter by vehicle type and shuffle
      const filtered = moduleInfo.questions.filter(
        (q) => q.vehicle_types.includes(vehicleType) || q.vehicle_types.includes('B')
      )
      const shuffled = [...filtered].sort(() => Math.random() - 0.5).slice(0, 30)
      // Shuffle answer order within each question
      const withShuffledAnswers = shuffled.map((q) => ({
        ...q,
        answers: [...q.answers]
          .sort(() => Math.random() - 0.5)
          .map((a, i) => ({ ...a, display_order: i + 1 })),
      }))
      startQuiz(withShuffledAnswers)
    }
  }, [moduleSlug, vehicleType, startQuiz])

  if (state.status === 'loading' || !currentQuestion) {
    return (
      <div className="min-h-dvh bg-background flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-secondary animate-pulse" style={{ fontSize: 48 }}>
            quiz
          </span>
          <p className="mt-4 font-headline text-lg text-on-surface-variant">
            Loading questions...
          </p>
        </div>
      </div>
    )
  }

  if (state.status === 'completed') {
    const scorePercent = Math.round((state.score / state.questions.length) * 100)
    const passed = scorePercent >= 71

    router.push(
      `/quiz/${vehicleType}/${moduleSlug}/results?score=${state.score}&total=${state.questions.length}`
    )
    return null
  }

  const moduleTitle = MODULE_DATA[moduleSlug]?.title ?? moduleSlug
  const progress = ((state.currentIndex + 1) / state.questions.length) * 100

  return (
    <div className="min-h-dvh bg-background">
      <Header showBack backHref={`/quiz/${vehicleType}`} title={moduleTitle} />

      {/* Progress Bar */}
      <div className="sticky top-16 z-40 bg-surface border-b-2 border-surface-container-lowest px-4 py-3">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-label text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Question {state.currentIndex + 1} of {state.questions.length}
            </span>
            <div className="flex-1" />
            <span className="font-label text-xs font-bold text-tertiary">
              {Math.round(progress)}% Complete
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
                Skip
              </NeoButton>
              <NeoButton
                variant="primary"
                size="md"
                icon="check"
                onClick={checkAnswer}
                disabled={!state.selectedAnswerId}
                fullWidth
              >
                Check Answer
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
              {state.currentIndex + 1 >= state.questions.length ? 'See Results' : 'Next Question'}
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
