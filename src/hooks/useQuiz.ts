'use client'

import { useReducer, useCallback } from 'react'
import type { QuizState, QuizAction, Question } from '@/types/quiz'

const initialState: QuizState = {
  questions: [],
  currentIndex: 0,
  selectedAnswerId: null,
  isAnswered: false,
  answers: {},
  score: 0,
  status: 'loading',
  timeRemaining: null,
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
      }

    case 'SELECT_ANSWER':
      if (state.isAnswered) return state
      return {
        ...state,
        selectedAnswerId: action.answerId,
      }

    case 'CHECK_ANSWER': {
      if (!state.selectedAnswerId || state.isAnswered) return state
      const currentQuestion = state.questions[state.currentIndex]
      const selectedAnswer = currentQuestion.answers.find(
        (a) => a.id === state.selectedAnswerId
      )
      const isCorrect = selectedAnswer?.is_correct ?? false
      return {
        ...state,
        isAnswered: true,
        status: 'reviewing',
        score: isCorrect ? state.score + 1 : state.score,
        answers: {
          ...state.answers,
          [currentQuestion.id]: {
            selectedId: state.selectedAnswerId,
            isCorrect,
          },
        },
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
      const currentQuestion = state.questions[state.currentIndex]
      const nextIndex = state.currentIndex + 1
      const newAnswers = {
        ...state.answers,
        [currentQuestion.id]: { selectedId: '', isCorrect: false },
      }
      if (nextIndex >= state.questions.length) {
        return { ...state, answers: newAnswers, status: 'completed' }
      }
      return {
        ...state,
        currentIndex: nextIndex,
        selectedAnswerId: null,
        isAnswered: false,
        answers: newAnswers,
        status: 'active',
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

  const startQuiz = useCallback((questions: Question[], timeLimitSecs?: number) => {
    dispatch({ type: 'SET_QUESTIONS', questions })
    // Timer would be set up separately if needed
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
    selectAnswer,
    checkAnswer,
    nextQuestion,
    skipQuestion,
    dispatch,
  }
}
