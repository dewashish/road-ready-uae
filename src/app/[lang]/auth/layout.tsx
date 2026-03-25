import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In – Road Ready UAE',
  description:
    'Sign in or create an account to save your UAE driving theory test progress, sync across devices, and track your streaks.',

  robots: { index: false },
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
