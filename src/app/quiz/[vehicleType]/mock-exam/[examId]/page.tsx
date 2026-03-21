'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { QuestionCard } from '@/components/quiz/QuestionCard'
import { NeoButton } from '@/components/ui/NeoButton'
import { NeoCard } from '@/components/ui/NeoCard'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useQuiz } from '@/hooks/useQuiz'
import { useProgress } from '@/context/ProgressContext'
import {
  MOCK_EXAMS,
  MOCK_EXAM_TIME_LIMIT,
  selectMockExamQuestions,
} from '@/lib/questions/mockExamConfig'
import { playExamStart, playTimerWarning, playTimeUp, playCorrect, playWrong } from '@/lib/sounds'

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

function getTimerColor(seconds: number): string {
  if (seconds <= 120) return 'text-error'
  if (seconds <= 300) return 'text-secondary'
  return 'text-tertiary'
}

export default function MockExamPage() {
  const params = useParams()
  const router = useRouter()
  const vehicleType = params.vehicleType as string
  const examId = params.examId as string
  const { getQuizHistory } = useProgress()
  const {
    state,
    currentQuestion,
    startMockExam,
    selectAnswer,
    checkAnswer,
    nextQuestion,
    skipQuestion,
    dispatch,
  } = useQuiz()

  const [showTimeUp, setShowTimeUp] = useState(false)
  const warningPlayedRef = useRef(false)
  const prevIsAnsweredRef = useRef(false)

  const exam = MOCK_EXAMS.find((e) => e.id === examId)

  // Load questions and start exam
  useEffect(() => {
    if (!exam) return
    const history = getQuizHistory()
    const questions = selectMockExamQuestions(examId, vehicleType, history)
    startMockExam(questions, MOCK_EXAM_TIME_LIMIT)
    playExamStart()
  }, [examId, vehicleType, exam, startMockExam])

  // Timer tick
  useEffect(() => {
    if (state.status !== 'active' && state.status !== 'reviewing') return
    if (state.timeRemaining === null || state.timeRemaining <= 0) return
    const interval = setInterval(() => dispatch({ type: 'TICK_TIMER' }), 1000)
    return () => clearInterval(interval)
  }, [state.status, state.timeRemaining, dispatch])

  // Timer warning sound at 2 minutes
  useEffect(() => {
    if (state.timeRemaining !== null && state.timeRemaining <= 120 && !warningPlayedRef.current) {
      warningPlayedRef.current = true
      playTimerWarning()
    }
  }, [state.timeRemaining])

  // Play correct/wrong sounds when answer is checked
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

  // Handle time-up
  useEffect(() => {
    if (state.timeRemaining === 0 && state.status === 'completed' && !showTimeUp) {
      playTimeUp()
      setShowTimeUp(true)
    }
  }, [state.timeRemaining, state.status, showTimeUp])

  // Navigate to results on completion
  useEffect(() => {
    if (state.status !== 'completed') return

    // Build session answers including unanswered questions as skipped
    const sessionAnswers = [...state.sessionAnswers]
    const answeredIds = new Set(sessionAnswers.map((a) => a.questionId))

    for (const q of state.questions) {
      if (!answeredIds.has(q.id)) {
        const correct = q.answers.find((a) => a.is_correct)
        sessionAnswers.push({
          questionId: q.id,
          questionText: q.question_text,
          selectedAnswerText: '(Skipped)',
          correctAnswerText: correct?.answer_text ?? '',
          isCorrect: false,
          explanation: q.explanation,
        })
      }
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('road-ready-last-session', JSON.stringify(sessionAnswers))
    }

    const timeSpent = MOCK_EXAM_TIME_LIMIT - (state.timeRemaining ?? 0)

    // If time's up, show overlay briefly before navigating
    const delay = showTimeUp ? 2000 : 0
    const timer = setTimeout(() => {
      router.push(
        `/quiz/${vehicleType}/mock-exam/${examId}/results?score=${state.score}&total=${state.questions.length}&time=${timeSpent}`
      )
    }, delay)

    return () => clearTimeout(timer)
  }, [state.status, state.score, state.questions, state.sessionAnswers, state.timeRemaining, showTimeUp, vehicleType, examId, router])

  // Navigation guard
  useEffect(() => {
    if (state.status !== 'active' && state.status !== 'reviewing') return
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [state.status])

  if (!exam) {
    return (
      <div className="min-h-dvh bg-background flex items-center justify-center">
        <p className="text-on-surface-variant">Invalid exam ID</p>
      </div>
    )
  }

  if (state.status === 'loading' || !currentQuestion) {
    return (
      <div className="min-h-dvh bg-background flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-secondary animate-pulse" style={{ fontSize: 48 }}>
            military_tech
          </span>
          <p className="mt-4 font-headline text-lg text-on-surface-variant">
            Preparing {exam.title}...
          </p>
        </div>
      </div>
    )
  }

  // Time's up overlay
  if (showTimeUp && state.status === 'completed') {
    return (
      <div className="min-h-dvh bg-background flex items-center justify-center">
        <NeoCard level={2} shadow="secondary" className="text-center !p-8 animate-bounce">
          <span className="material-symbols-outlined text-error" style={{ fontSize: 64 }}>
            timer_off
          </span>
          <h2 className="font-headline text-3xl font-bold text-primary mt-4">Time&apos;s Up!</h2>
          <p className="text-on-surface-variant mt-2">Calculating your results...</p>
        </NeoCard>
      </div>
    )
  }

  if (state.status === 'completed') {
    return null // Will redirect via useEffect
  }

  const progress = ((state.currentIndex + 1) / state.questions.length) * 100
  const timeRemaining = state.timeRemaining ?? 0
  const timerColor = getTimerColor(timeRemaining)

  return (
    <div className="min-h-dvh bg-background">
      <Header showBack backHref={`/quiz/${vehicleType}/mock-exam`} title={exam.title} />

      {/* Progress & Timer Bar */}
      <div className="sticky top-16 z-40 bg-surface border-b-2 border-surface-container-lowest px-4 py-3">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-label text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Question {state.currentIndex + 1} of {state.questions.length}
            </span>
            <div className="flex-1" />
            <div className={`flex items-center gap-1 ${timerColor} ${timeRemaining <= 120 ? 'animate-pulse' : ''}`}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>timer</span>
              <span className="font-label text-xs font-bold font-mono">
                {formatTime(timeRemaining)}
              </span>
            </div>
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
