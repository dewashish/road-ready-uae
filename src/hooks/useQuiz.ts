'use client'

import { useReducer, useCallback } from 'react'
import type { Question } from '@/types/quiz'
import type { QuizAnswerRecord } from '@/context/ProgressContext'

export interface QuizState {
  questions: Question[]
  currentIndex: number
  selectedAnswerId: string | null
  isAnswered: boolean
  answers: Record<string, { selectedId: string; isCorrect: boolean }>
  score: number
  status: 'loading' | 'active' | 'reviewing' | 'completed'
  timeRemaining: number | null
  sessionAnswers: QuizAnswerRecord[]
}

export type QuizAction =
  | { type: 'SET_QUESTIONS'; questions: Question[] }
  | { type: 'START_MOCK_EXAM'; questions: Question[]; timeLimit: number }
  | { type: 'SELECT_ANSWER'; answerId: string }
  | { type: 'CHECK_ANSWER' }
  | { type: 'NEXT_QUESTION' }
  | { type: 'SKIP' }
  | { type: 'COMPLETE' }
  | { type: 'TICK_TIMER' }

const initialState: QuizState = {
  questions: [],
  currentIndex: 0,
  selectedAnswerId: null,
  isAnswered: false,
  answers: {},
  score: 0,
  status: 'loading',
  timeRemaining: null,
  sessionAnswers: [],
}

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'SET_QUESTIONS':
      return {
        ...state,
        questions: action.questions,
        status: 'active',
        currentIndex: 0,
        answers: {},
        score: 0,
        selectedAnswerId: null,
        isAnswered: false,
        sessionAnswers: [],
      }

    case 'START_MOCK_EXAM':
      return {
        ...initialState,
        questions: action.questions,
        status: 'active',
        timeRemaining: action.timeLimit,
      }

    case 'SELECT_ANSWER':
      if (state.isAnswered) return state
      return { ...state, selectedAnswerId: action.answerId }

    case 'CHECK_ANSWER': {
      if (!state.selectedAnswerId || state.isAnswered) return state
      const q = state.questions[state.currentIndex]
      const selected = q.answers.find((a) => a.id === state.selectedAnswerId)
      const correct = q.answers.find((a) => a.is_correct)
      const isCorrect = selected?.is_correct ?? false

      const answerRecord: QuizAnswerRecord = {
        questionId: q.id,
        questionText: q.question_text,
        selectedAnswerText: selected?.answer_text ?? '',
        correctAnswerText: correct?.answer_text ?? '',
        isCorrect,
        explanation: q.explanation,
      }

      return {
        ...state,
        isAnswered: true,
        status: 'reviewing',
        score: isCorrect ? state.score + 1 : state.score,
        answers: {
          ...state.answers,
          [q.id]: { selectedId: state.selectedAnswerId, isCorrect },
        },
        sessionAnswers: [...state.sessionAnswers, answerRecord],
      }
    }

    case 'NEXT_QUESTION': {
      const nextIndex = state.currentIndex + 1
      if (nextIndex >= state.questions.length) {
        return { ...state, status: 'completed' }
      }
      return {
        ...state,
        currentIndex: nextIndex,
        selectedAnswerId: null,
        isAnswered: false,
        status: 'active',
      }
    }

    case 'SKIP': {
      const q = state.questions[state.currentIndex]
      const correct = q.answers.find((a) => a.is_correct)
      const skipRecord: QuizAnswerRecord = {
        questionId: q.id,
        questionText: q.question_text,
        selectedAnswerText: '(Skipped)',
        correctAnswerText: correct?.answer_text ?? '',
        isCorrect: false,
        explanation: q.explanation,
      }

      const nextIndex = state.currentIndex + 1
      const newAnswers = {
        ...state.answers,
        [q.id]: { selectedId: '', isCorrect: false },
      }
      if (nextIndex >= state.questions.length) {
        return {
          ...state,
          answers: newAnswers,
          status: 'completed',
          sessionAnswers: [...state.sessionAnswers, skipRecord],
        }
      }
      return {
        ...state,
        currentIndex: nextIndex,
        selectedAnswerId: null,
        isAnswered: false,
        answers: newAnswers,
        sessionAnswers: [...state.sessionAnswers, skipRecord],
      }
    }

    case 'COMPLETE':
      return { ...state, status: 'completed' }

    case 'TICK_TIMER':
      if (state.timeRemaining === null) return state
      const next = state.timeRemaining - 1
      if (next <= 0) return { ...state, timeRemaining: 0, status: 'completed' }
      return { ...state, timeRemaining: next }

    default:
      return state
  }
}

export function useQuiz() {
  const [state, dispatch] = useReducer(quizReducer, initialState)

  const startQuiz = useCallback((questions: Question[]) => {
    dispatch({ type: 'SET_QUESTIONS', questions })
  }, [])

  const startMockExam = useCallback((questions: Question[], timeLimit: number) => {
    dispatch({ type: 'START_MOCK_EXAM', questions, timeLimit })
  }, [])

  const selectAnswer = useCallback((answerId: string) => {
    dispatch({ type: 'SELECT_ANSWER', answerId })
  }, [])

  const checkAnswer = useCallback(() => {
    dispatch({ type: 'CHECK_ANSWER' })
  }, [])

  const nextQuestion = useCallback(() => {
    dispatch({ type: 'NEXT_QUESTION' })
  }, [])

  const skipQuestion = useCallback(() => {
    dispatch({ type: 'SKIP' })
  }, [])

  const currentQuestion = state.questions[state.currentIndex] ?? null

  return {
    state,
    currentQuestion,
    startQuiz,
    startMockExam,
    selectAnswer,
    checkAnswer,
    nextQuestion,
    skipQuestion,
    dispatch,
  }
}
