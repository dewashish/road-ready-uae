'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import {
  getProgress,
  saveProgress,
  recordModuleCompletion,
  rebuildProgressFromHistory,
  DEFAULT_PROGRESS,
  type UserProgress,
} from '@/lib/progress'
import { useAuth } from '@/hooks/useAuth'
import {
  pushSessionToCloud,
  pullSessionsFromCloud,
  mergeHistories,
  pushAllSessionsToCloud,
} from '@/lib/supabase/history-sync'

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
const MAX_HISTORY = 100

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
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS)
  const [mergedHistory, setMergedHistory] = useState<QuizSessionRecord[] | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    setProgress(getProgress())
  }, [])

  // When user logs in: pull cloud history, merge with local, save merged back
  useEffect(() => {
    if (!user) {
      setMergedHistory(null)
      return
    }

    let cancelled = false

    async function syncOnLogin() {
      const local = getStoredHistory()

      // Push local sessions to cloud first (so nothing is lost)
      await pushAllSessionsToCloud(user!.id, local)

      // Then pull cloud sessions (includes what we just pushed + sessions from other devices)
      const cloud = await pullSessionsFromCloud(user!.id)

      if (cancelled) return

      const merged = mergeHistories(local, cloud)
      saveStoredHistory(merged)
      setMergedHistory(merged)

      // Rebuild progress stats from the merged history so they're consistent across devices
      const rebuilt = rebuildProgressFromHistory(merged)
      saveProgress(rebuilt)
      setProgress(rebuilt)
    }

    syncOnLogin()

    return () => { cancelled = true }
  }, [user])

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
    setMergedHistory(history)

    // Also push to cloud if logged in
    if (user) {
      pushSessionToCloud(user.id, session)
    }
  }, [user])

  const getQuizHistory = useCallback((): QuizSessionRecord[] => {
    // If we have merged history (from cloud sync), use it
    if (mergedHistory !== null) return mergedHistory
    return getStoredHistory()
  }, [mergedHistory])

  const getModuleHistory = useCallback((moduleSlug: string): QuizSessionRecord[] => {
    const history = mergedHistory !== null ? mergedHistory : getStoredHistory()
    return history.filter((s) => s.moduleSlug === moduleSlug)
  }, [mergedHistory])

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
