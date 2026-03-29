'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { QuestionCard } from '@/components/quiz/QuestionCard'
import { QuestionGrid } from '@/components/quiz/QuestionGrid'
import { MobileQuestionNav } from '@/components/quiz/MobileQuestionNav'
import { ExamSubmitDialog } from '@/components/quiz/ExamSubmitDialog'
import { NeoButton } from '@/components/ui/NeoButton'
import { NeoCard } from '@/components/ui/NeoCard'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useMockExam } from '@/hooks/useMockExam'
import { useProgress } from '@/context/ProgressContext'
import {
  MOCK_EXAMS,
  MOCK_EXAM_TIME_LIMIT,
  selectMockExamQuestions,
} from '@/lib/questions/mockExamConfig'
import { translateQuestionBatch } from '@/lib/questions/loadTranslatedQuestions'
import { playExamStart, playTimerWarning, playTimeUp } from '@/lib/sounds'
import { useDictionary, useLocale } from '@/i18n/DictionaryContext'
import { localePath } from '@/i18n/utils'

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
  const dict = useDictionary()
  const locale = useLocale()

  const {
    state,
    currentQuestion,
    answeredCount,
    unansweredCount,
    flaggedCount,
    questionStatuses,
    startExam,
    selectAnswer,
    navigateTo,
    nextQuestion,
    prevQuestion,
    toggleFlag,
    submitExam,
    computeResults,
    dispatch,
  } = useMockExam()

  const [showTimeUp, setShowTimeUp] = useState(false)
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const warningPlayedRef = useRef(false)

  const exam = MOCK_EXAMS.find((e) => e.id === examId)

  // Load questions and start exam
  useEffect(() => {
    if (!exam) return
    async function loadExam() {
      const history = getQuizHistory()
      const questions = selectMockExamQuestions(examId, vehicleType, history)
      const translated = await translateQuestionBatch(questions, locale)
      startExam(translated, MOCK_EXAM_TIME_LIMIT)
      playExamStart()
    }
    loadExam()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId, vehicleType, locale])

  // Timer tick
  useEffect(() => {
    if (state.status !== 'active') return
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

  // Handle time-up (auto-submit)
  useEffect(() => {
    if (state.timeRemaining === 0 && state.status === 'completed' && !showTimeUp) {
      playTimeUp()
      setShowTimeUp(true)
    }
  }, [state.timeRemaining, state.status, showTimeUp])

  // Navigate to results on completion
  useEffect(() => {
    if (state.status !== 'completed') return

    const { score, total, sessionAnswers } = computeResults()

    if (typeof window !== 'undefined') {
      localStorage.setItem('road-ready-last-session', JSON.stringify(sessionAnswers))
    }

    const timeSpent = MOCK_EXAM_TIME_LIMIT - (state.timeRemaining ?? 0)

    const delay = showTimeUp ? 2000 : 0
    const timer = setTimeout(() => {
      router.push(
        localePath(locale, `/quiz/${vehicleType}/mock-exam/${examId}/results?score=${score}&total=${total}&time=${timeSpent}`)
      )
    }, delay)

    return () => clearTimeout(timer)
  }, [state.status, state.timeRemaining, showTimeUp, vehicleType, examId, router, locale, computeResults])

  // Navigation guard
  useEffect(() => {
    if (state.status !== 'active') return
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault() }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [state.status])

  const handleSubmitConfirm = () => {
    setShowSubmitDialog(false)
    submitExam()
  }

  if (!exam) {
    return (
      <div className="min-h-dvh bg-background flex items-center justify-center">
        <p className="text-on-surface-variant">{dict.mockExam.invalidExamId}</p>
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
            {dict.mockExam.preparing.replace('{title}', exam.title)}
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
          <h2 className="font-headline text-3xl font-bold text-primary mt-4">{dict.mockExam.timesUp}</h2>
          <p className="text-on-surface-variant mt-2">{dict.mockExam.calculatingResults}</p>
        </NeoCard>
      </div>
    )
  }

  if (state.status === 'completed') {
    return null // Redirecting via useEffect
  }

  const progress = ((state.currentIndex + 1) / state.questions.length) * 100
  const timeRemaining = state.timeRemaining ?? 0
  const timerColor = getTimerColor(timeRemaining)
  const currentQId = currentQuestion.id
  const isFlagged = state.flaggedIds.includes(currentQId)
  const selectedAnswerId = state.selections[currentQId] ?? null

  return (
    <div className="min-h-dvh bg-background pb-20 lg:pb-0">
      <Header showBack backHref={`/quiz/${vehicleType}/mock-exam`} title={exam.title} />

      {/* Progress & Timer Bar */}
      <div className="sticky top-16 z-40 bg-surface border-b-2 border-surface-container-lowest">
        <div className="max-w-7xl mx-auto px-4 py-2.5">
          <div className="flex items-center gap-3 mb-1.5">
            <span className="font-label text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Q{state.currentIndex + 1}/{state.questions.length}
            </span>
            <div className="flex-1" />
            <div className={`flex items-center gap-1 ${timerColor} ${timeRemaining <= 120 ? 'animate-pulse' : ''}`}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>timer</span>
              <span className="font-label text-sm font-bold font-mono">
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>
          <ProgressBar value={progress} max={100} color="tertiary" size="sm" />
        </div>

        {/* Mobile: status strip */}
        <div className="lg:hidden">
          <MobileQuestionNav
            questionStatuses={questionStatuses}
            currentIndex={state.currentIndex}
            onNavigate={navigateTo}
            answeredCount={answeredCount}
            flaggedCount={flaggedCount}
            unansweredCount={unansweredCount}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:grid lg:grid-cols-[1fr_240px] lg:gap-6 items-start">
        {/* Left column: question + actions */}
        <div>
          <QuestionCard
            question={currentQuestion}
            questionNumber={state.currentIndex + 1}
            totalQuestions={state.questions.length}
            selectedAnswerId={selectedAnswerId}
            isAnswered={false}
            onSelectAnswer={(answerId) => selectAnswer(currentQId, answerId)}
            examMode
            isFlagged={isFlagged}
            onToggleFlag={() => toggleFlag(currentQId)}
          />

          {/* Navigation + Submit */}
          <div className="space-y-3">
            {/* Prev / Next */}
            <div className="flex gap-3">
              <NeoButton
                variant="ghost"
                size="md"
                icon="arrow_back"
                onClick={prevQuestion}
                disabled={state.currentIndex === 0}
                fullWidth
              >
                Previous
              </NeoButton>
              <NeoButton
                variant="tertiary"
                size="md"
                icon="arrow_forward"
                onClick={nextQuestion}
                disabled={state.currentIndex >= state.questions.length - 1}
                fullWidth
              >
                Next
              </NeoButton>
            </div>

            {/* Submit — subtle, not the primary action. Mobile only (desktop has it in sidebar) */}
            <div className="lg:hidden mt-4 flex justify-end">
              <button
                onClick={() => setShowSubmitDialog(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-on-surface-variant hover:text-secondary transition-colors font-label text-xs uppercase tracking-wider"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>send</span>
                Submit Exam
              </button>
            </div>
          </div>
        </div>

        {/* Right column: question grid (desktop only) */}
        <div className="hidden lg:block sticky top-40">
          <QuestionGrid
            questionStatuses={questionStatuses}
            currentIndex={state.currentIndex}
            onNavigate={navigateTo}
            answeredCount={answeredCount}
            flaggedCount={flaggedCount}
            unansweredCount={unansweredCount}
            onSubmit={() => setShowSubmitDialog(true)}
          />
        </div>
      </div>

      {/* Submit confirmation dialog */}
      <ExamSubmitDialog
        isOpen={showSubmitDialog}
        answeredCount={answeredCount}
        unansweredCount={unansweredCount}
        flaggedCount={flaggedCount}
        onConfirm={handleSubmitConfirm}
        onCancel={() => setShowSubmitDialog(false)}
      />
    </div>
  )
}
