'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import {
  getProgress,
  recordModuleCompletion,
  type UserProgress,
  type ModuleProgress,
} from '@/lib/progress'

interface QuizSessionRecord {
  id: string
  moduleSlug: string
  moduleTitle: string
  vehicleType: string
  score: number
  total: number
  percent: number
  passed: boolean
  xpEarned: number
  completedAt: string
  answers: QuizAnswerRecord[]
}

interface QuizAnswerRecord {
  questionId: string
  questionText: string
  selectedAnswerText: string
  correctAnswerText: string
  isCorrect: boolean
  explanation: string | null
}

interface ProgressContextType {
  progress: UserProgress
  refreshProgress: () => void
  recordCompletion: (moduleSlug: string, score: number, total: number, xpEarned: number) => void
  saveQuizSession: (session: QuizSessionRecord) => void
  getQuizHistory: () => QuizSessionRecord[]
  getModuleHistory: (moduleSlug: string) => QuizSessionRecord[]
}

const ProgressContext = createContext<ProgressContextType | null>(null)

const HISTORY_KEY = 'road-ready-uae-history'
const MAX_HISTORY = 50

function getStoredHistory(): QuizSessionRecord[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(HISTORY_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveStoredHistory(history: QuizSessionRecord[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)))
  } catch {}
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<UserProgress>(getProgress())

  useEffect(() => {
    setProgress(getProgress())
  }, [])

  const refreshProgress = useCallback(() => {
    setProgress(getProgress())
  }, [])

  const recordCompletion = useCallback(
    (moduleSlug: string, score: number, total: number, xpEarned: number) => {
      const updated = recordModuleCompletion(moduleSlug, score, total, xpEarned)
      setProgress(updated)
    },
    []
  )

  const saveQuizSession = useCallback((session: QuizSessionRecord) => {
    const history = getStoredHistory()
    history.unshift(session)
    saveStoredHistory(history)
  }, [])

  const getQuizHistory = useCallback((): QuizSessionRecord[] => {
    return getStoredHistory()
  }, [])

  const getModuleHistory = useCallback((moduleSlug: string): QuizSessionRecord[] => {
    return getStoredHistory().filter((s) => s.moduleSlug === moduleSlug)
  }, [])

  return (
    <ProgressContext.Provider
      value={{ progress, refreshProgress, recordCompletion, saveQuizSession, getQuizHistory, getModuleHistory }}
    >
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  const context = useContext(ProgressContext)
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider')
  }
  return context
}

export type { QuizSessionRecord, QuizAnswerRecord }
