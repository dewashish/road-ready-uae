'use client'

import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react'
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
import {
  pushModuleProgressToCloud,
  pullModuleProgressFromCloud,
  pushAllModuleProgressToCloud,
  mergeCloudProgressIntoLocal,
} from '@/lib/supabase/progress-sync'

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
  const [localHistory, setLocalHistory] = useState<QuizSessionRecord[] | null>(null)
  const { user } = useAuth()
  const userRef = useRef(user)
  userRef.current = user

  useEffect(() => {
    setProgress(getProgress())
    setLocalHistory(getStoredHistory())
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
      const localProg = getProgress()

      // Compute questions seen per module from history
      const seenMap: Record<string, number> = {}
      for (const s of local) {
        const key = `${s.vehicleType}:${s.moduleSlug}`
        const uniqueQs = new Set(s.answers.map((a) => a.questionId))
        seenMap[key] = (seenMap[key] ?? 0) + uniqueQs.size
      }

      // Push local sessions + module progress to cloud (so nothing is lost)
      await Promise.all([
        pushAllSessionsToCloud(user!.id, local),
        pushAllModuleProgressToCloud(user!.id, localProg, seenMap),
      ])

      // Pull cloud data (includes what we just pushed + data from other devices)
      const [cloud, cloudProgress] = await Promise.all([
        pullSessionsFromCloud(user!.id),
        pullModuleProgressFromCloud(user!.id),
      ])

      if (cancelled) return

      const merged = mergeHistories(local, cloud)
      saveStoredHistory(merged)
      setLocalHistory(merged)
      setMergedHistory(merged)

      // Rebuild progress from merged history, then merge with cloud module progress
      let rebuilt = rebuildProgressFromHistory(merged)
      rebuilt = mergeCloudProgressIntoLocal(rebuilt, cloudProgress)
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
    const history = mergedHistory ?? localHistory ?? getStoredHistory()
    const updated = [session, ...history]
    saveStoredHistory(updated)
    setLocalHistory(updated)
    setMergedHistory(updated)

    // Push to cloud using ref to avoid stale user closure
    if (userRef.current) {
      pushSessionToCloud(userRef.current.id, session)
      // Also push module progress + weekly snapshot
      pushModuleProgressToCloud(
        userRef.current.id,
        session.vehicleType,
        session.moduleSlug,
        session.score,
        session.total,
        updated.filter(
          (s) => s.moduleSlug === session.moduleSlug && s.vehicleType === session.vehicleType
        ).length,
        session.xpEarned
      )
    }
  }, [mergedHistory, localHistory])

  const getQuizHistory = useCallback((): QuizSessionRecord[] => {
    if (mergedHistory !== null) return mergedHistory
    return localHistory ?? []
  }, [mergedHistory, localHistory])

  const getModuleHistory = useCallback((moduleSlug: string): QuizSessionRecord[] => {
    const history = mergedHistory ?? localHistory ?? []
    return history.filter((s) => s.moduleSlug === moduleSlug)
  }, [mergedHistory, localHistory])

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
