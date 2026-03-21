'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { NeoCard } from '@/components/ui/NeoCard'
import { NeoButton } from '@/components/ui/NeoButton'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { recordModuleCompletion, getModuleProgress } from '@/lib/progress'

const MODULE_XP: Record<string, number> = {
  'road-signs': 100,
  'traffic-rules': 100,
  'hazard-perception': 120,
  'driving-conditions': 80,
  'critical-situations': 120,
  'driving-behavior': 80,
  'vehicle-maintenance': 60,
}

export default function ResultsPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const vehicleType = params.vehicleType as string
  const moduleSlug = params.moduleSlug as string

  const score = parseInt(searchParams.get('score') ?? '0', 10)
  const total = parseInt(searchParams.get('total') ?? '30', 10)
  const percent = Math.round((score / total) * 100)
  const passed = percent >= 71

  const baseXp = MODULE_XP[moduleSlug] ?? 80
  const xpEarned = Math.round((score / total) * baseXp)

  const [saved, setSaved] = useState(false)
  const [completionCount, setCompletionCount] = useState(0)

  useEffect(() => {
    if (!saved) {
      const updated = recordModuleCompletion(moduleSlug, score, total, xpEarned)
      setCompletionCount(updated.modules[moduleSlug]?.completionCount ?? 1)
      setSaved(true)
    }
  }, [saved, moduleSlug, score, total, xpEarned])

  return (
    <div className="min-h-dvh bg-background">
      <Header showBack backHref={`/quiz/${vehicleType}`} title="Results" />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* Score Display */}
        <NeoCard
          level={2}
          shadow={passed ? 'secondary' : 'default'}
          className="text-center mb-6"
        >
          <div className="mb-4">
            <span
              className={`material-symbols-outlined ${passed ? 'text-secondary' : 'text-error'}`}
              style={{ fontSize: 64 }}
            >
              {passed ? 'emoji_events' : 'sentiment_dissatisfied'}
            </span>
          </div>
          <Badge variant={passed ? 'success' : 'error'} className="mb-4">
            {passed ? 'PASSED' : 'FAILED'}
          </Badge>
          <h2 className="font-headline text-5xl font-bold text-primary mb-1">
            {score}<span className="text-2xl text-on-surface-variant">/{total}</span>
          </h2>
          <p className="font-headline text-lg text-tertiary font-bold mb-4">
            {percent}% Accuracy
          </p>
          <ProgressBar
            value={percent}
            max={100}
            color={passed ? 'success' : 'error'}
            size="lg"
          />
          <p className="mt-3 text-sm text-on-surface-variant">
            {passed
              ? 'Great job! You passed this module.'
              : 'You need 71% to pass. Keep practicing!'}
          </p>
        </NeoCard>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <NeoCard level={1} shadow="none" className="text-center !p-4">
            <span className="material-symbols-outlined text-secondary mb-1" style={{ fontSize: 24 }}>
              star
            </span>
            <p className="font-headline text-lg font-bold text-primary">+{xpEarned}</p>
            <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider">
              XP Earned
            </p>
          </NeoCard>
          <NeoCard level={1} shadow="none" className="text-center !p-4">
            <span className="material-symbols-outlined text-tertiary mb-1" style={{ fontSize: 24 }}>
              replay
            </span>
            <p className="font-headline text-lg font-bold text-primary">{completionCount}</p>
            <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider">
              Times Done
            </p>
          </NeoCard>
          <NeoCard level={1} shadow="none" className="text-center !p-4">
            <span className="material-symbols-outlined text-success mb-1" style={{ fontSize: 24 }}>
              verified
            </span>
            <p className="font-headline text-lg font-bold text-primary">
              {passed ? 'Yes' : 'No'}
            </p>
            <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider">
              Passed
            </p>
          </NeoCard>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link href={`/quiz/${vehicleType}/${moduleSlug}`}>
            <NeoButton
              variant={passed ? 'tertiary' : 'primary'}
              size="lg"
              icon="replay"
              fullWidth
            >
              {passed ? 'Practice Again' : 'Try Again'}
            </NeoButton>
          </Link>
          <Link href={`/quiz/${vehicleType}`}>
            <NeoButton variant="ghost" size="lg" icon="arrow_back" fullWidth className="mt-3">
              Back to Modules
            </NeoButton>
          </Link>
        </div>
      </main>
    </div>
  )
}
