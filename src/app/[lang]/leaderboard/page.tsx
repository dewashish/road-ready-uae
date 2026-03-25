'use client'

import { Header } from '@/components/layout/Header'
import { BottomNav } from '@/components/layout/BottomNav'
import { NeoCard } from '@/components/ui/NeoCard'
import { useDictionary } from '@/i18n/DictionaryContext'

export default function LeaderboardPage() {
  const dict = useDictionary()

  return (
    <div className="min-h-dvh bg-background pb-20 sm:pb-0">
      <Header title={dict.leaderboard.title + dict.leaderboard.titleHighlight} />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <h2 className="font-headline text-3xl font-bold text-primary mb-6">
          {dict.leaderboard.title}<span className="text-secondary">{dict.leaderboard.titleHighlight}</span>
        </h2>

        <NeoCard level={2} shadow="default" className="text-center !py-16">
          <span className="material-symbols-outlined text-secondary" style={{ fontSize: 64 }}>
            leaderboard
          </span>
          <h3 className="mt-4 font-headline text-xl font-bold text-primary">
            {dict.leaderboard.comingSoonTitle}
          </h3>
          <p className="mt-2 text-on-surface-variant max-w-sm mx-auto">
            {dict.leaderboard.comingSoonDesc}
          </p>
        </NeoCard>
      </main>
      <BottomNav />
    </div>
  )
}
