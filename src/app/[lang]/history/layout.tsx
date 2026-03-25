import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Quiz History – Track Your Progress',
  description:
    'Review your UAE driving theory test quiz history. See past scores, track improvement, and identify areas to focus on.',
}

export default function HistoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
