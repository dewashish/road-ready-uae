import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Your Progress – Stats & Streaks',
  description:
    'Track your UAE driving theory test preparation progress. View stats, streaks, XP earned, and module completion across all vehicle categories.',
}

export default function ProgressLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
