'use client'

import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { NeoCard } from '@/components/ui/NeoCard'
import { NeoButton } from '@/components/ui/NeoButton'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'

export default function ResultsPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const vehicleType = params.vehicleType as string
  const moduleSlug = params.moduleSlug as string

  const score = parseInt(searchParams.get('score') ?? '0', 10)
  const total = parseInt(searchParams.get('total') ?? '30', 10)
  const percent = Math.round((score / total) * 100)
  const passed = percent >= 71

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
              : `You need 71% to pass. Keep practicing!`}
          </p>
        </NeoCard>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <NeoCard level={1} shadow="none" className="text-center !p-4">
            <span className="material-symbols-outlined text-tertiary mb-1" style={{ fontSize: 24 }}>
              timer
            </span>
            <p className="font-headline text-lg font-bold text-primary">--</p>
            <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider">
              Time
            </p>
          </NeoCard>
          <NeoCard level={1} shadow="none" className="text-center !p-4">
            <span className="material-symbols-outlined text-secondary mb-1" style={{ fontSize: 24 }}>
              local_fire_department
            </span>
            <p className="font-headline text-lg font-bold text-primary">{score}</p>
            <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider">
              Best Streak
            </p>
          </NeoCard>
          <NeoCard level={1} shadow="none" className="text-center !p-4">
            <span className="material-symbols-outlined text-success mb-1" style={{ fontSize: 24 }}>
              star
            </span>
            <p className="font-headline text-lg font-bold text-primary">+{score * 10}</p>
            <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider">
              XP Earned
            </p>
          </NeoCard>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {passed && (
            <Link href={`/quiz/${vehicleType}`}>
              <NeoButton variant="secondary" size="lg" icon="arrow_forward" fullWidth>
                Next Module
              </NeoButton>
            </Link>
          )}
          <Link href={`/quiz/${vehicleType}/${moduleSlug}`}>
            <NeoButton
              variant={passed ? 'ghost' : 'primary'}
              size="lg"
              icon="replay"
              fullWidth
              className="mt-3"
            >
              {passed ? 'Retake Quiz' : 'Try Again'}
            </NeoButton>
          </Link>
          <Link href={`/quiz/${vehicleType}`}>
            <NeoButton variant="ghost" size="lg" icon="home" fullWidth className="mt-3">
              Back to Modules
            </NeoButton>
          </Link>
        </div>
      </main>
    </div>
  )
}
