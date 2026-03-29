'use client'

import { useReducer, useCallback, useMemo } from 'react'
import type { Question } from '@/types/quiz'
import type { QuizAnswerRecord } from '@/context/ProgressContext'

export type QuestionStatus = 'answered' | 'unanswered' | 'flagged'

export interface MockExamState {
  questions: Question[]
  currentIndex: number
  /** questionId → selected answerId (overwritable, not locked) */
  selections: Record<string, string>
  /** IDs of flagged-for-review questions */
  flaggedIds: string[]
  status: 'loading' | 'active' | 'completed'
  timeRemaining: number | null
}

export type MockExamAction =
  | { type: 'START_EXAM'; questions: Question[]; timeLimit: number }
  | { type: 'SELECT_ANSWER'; questionId: string; answerId: string }
  | { type: 'CLEAR_ANSWER'; questionId: string }
  | { type: 'NAVIGATE_TO'; index: number }
  | { type: 'NEXT' }
  | { type: 'PREV' }
  | { type: 'TOGGLE_FLAG'; questionId: string }
  | { type: 'TICK_TIMER' }
  | { type: 'SUBMIT' }

const initialState: MockExamState = {
  questions: [],
  currentIndex: 0,
  selections: {},
  flaggedIds: [],
  status: 'loading',
  timeRemaining: null,
}

function mockExamReducer(state: MockExamState, action: MockExamAction): MockExamState {
  switch (action.type) {
    case 'START_EXAM':
      return {
        ...initialState,
        questions: action.questions,
        status: 'active',
        timeRemaining: action.timeLimit,
      }

    case 'SELECT_ANSWER':
      return {
        ...state,
        selections: { ...state.selections, [action.questionId]: action.answerId },
      }

    case 'CLEAR_ANSWER': {
      const { [action.questionId]: _, ...rest } = state.selections
      return { ...state, selections: rest }
    }

    case 'NAVIGATE_TO': {
      const index = Math.max(0, Math.min(action.index, state.questions.length - 1))
      return { ...state, currentIndex: index }
    }

    case 'NEXT': {
      if (state.currentIndex >= state.questions.length - 1) return state
      return { ...state, currentIndex: state.currentIndex + 1 }
    }

    case 'PREV': {
      if (state.currentIndex <= 0) return state
      return { ...state, currentIndex: state.currentIndex - 1 }
    }

    case 'TOGGLE_FLAG': {
      const flagged = state.flaggedIds.includes(action.questionId)
        ? state.flaggedIds.filter((id) => id !== action.questionId)
        : [...state.flaggedIds, action.questionId]
      return { ...state, flaggedIds: flagged }
    }

    case 'TICK_TIMER': {
      if (state.timeRemaining === null) return state
      const next = state.timeRemaining - 1
      if (next <= 0) return { ...state, timeRemaining: 0, status: 'completed' }
      return { ...state, timeRemaining: next }
    }

    case 'SUBMIT':
      return { ...state, status: 'completed' }

    default:
      return state
  }
}

export function useMockExam() {
  const [state, dispatch] = useReducer(mockExamReducer, initialState)

  const startExam = useCallback((questions: Question[], timeLimit: number) => {
    dispatch({ type: 'START_EXAM', questions, timeLimit })
  }, [])

  const selectAnswer = useCallback((questionId: string, answerId: string) => {
    dispatch({ type: 'SELECT_ANSWER', questionId, answerId })
  }, [])

  const clearAnswer = useCallback((questionId: string) => {
    dispatch({ type: 'CLEAR_ANSWER', questionId })
  }, [])

  const navigateTo = useCallback((index: number) => {
    dispatch({ type: 'NAVIGATE_TO', index })
  }, [])

  const nextQuestion = useCallback(() => {
    dispatch({ type: 'NEXT' })
  }, [])

  const prevQuestion = useCallback(() => {
    dispatch({ type: 'PREV' })
  }, [])

  const toggleFlag = useCallback((questionId: string) => {
    dispatch({ type: 'TOGGLE_FLAG', questionId })
  }, [])

  const submitExam = useCallback(() => {
    dispatch({ type: 'SUBMIT' })
  }, [])

  const currentQuestion = state.questions[state.currentIndex] ?? null

  const answeredCount = useMemo(
    () => Object.keys(state.selections).length,
    [state.selections]
  )

  const unansweredCount = useMemo(
    () => state.questions.length - answeredCount,
    [state.questions.length, answeredCount]
  )

  const flaggedCount = useMemo(
    () => state.flaggedIds.length,
    [state.flaggedIds]
  )

  const questionStatuses = useMemo((): Array<{ index: number; questionId: string; status: QuestionStatus }> => {
    return state.questions.map((q, i) => {
      const hasAnswer = q.id in state.selections
      const isFlagged = state.flaggedIds.includes(q.id)
      let status: QuestionStatus = 'unanswered'
      if (isFlagged) status = 'flagged'
      else if (hasAnswer) status = 'answered'
      return { index: i, questionId: q.id, status }
    })
  }, [state.questions, state.selections, state.flaggedIds])

  /** Compute final results — call after status becomes 'completed' */
  const computeResults = useCallback((): { score: number; total: number; sessionAnswers: QuizAnswerRecord[] } => {
    let score = 0
    const sessionAnswers: QuizAnswerRecord[] = state.questions.map((q) => {
      const selectedId = state.selections[q.id]
      const correct = q.answers.find((a) => a.is_correct)
      if (!selectedId) {
        return {
          questionId: q.id,
          questionText: q.question_text,
          selectedAnswerText: '(Unanswered)',
          correctAnswerText: correct?.answer_text ?? '',
          isCorrect: false,
          explanation: q.explanation,
        }
      }
      const selected = q.answers.find((a) => a.id === selectedId)
      const isCorrect = selected?.is_correct ?? false
      if (isCorrect) score++
      return {
        questionId: q.id,
        questionText: q.question_text,
        selectedAnswerText: selected?.answer_text ?? '',
        correctAnswerText: correct?.answer_text ?? '',
        isCorrect,
        explanation: q.explanation,
      }
    })
    return { score, total: state.questions.length, sessionAnswers }
  }, [state.questions, state.selections])

  return {
    state,
    currentQuestion,
    answeredCount,
    unansweredCount,
    flaggedCount,
    questionStatuses,
    startExam,
    selectAnswer,
    clearAnswer,
    navigateTo,
    nextQuestion,
    prevQuestion,
    toggleFlag,
    submitExam,
    computeResults,
    dispatch,
  }
}
