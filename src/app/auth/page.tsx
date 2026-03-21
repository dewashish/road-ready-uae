'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { Header } from '@/components/layout/Header'
import { NeoCard } from '@/components/ui/NeoCard'
import { NeoButton } from '@/components/ui/NeoButton'
import { useAuth } from '@/hooks/useAuth'

export default function AuthPage() {
  const router = useRouter()
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return

    if (mode === 'signup') {
      if (password.length < 6) {
        toast.error('Password must be at least 6 characters')
        return
      }
      if (password !== confirmPassword) {
        toast.error('Passwords do not match')
        return
      }
    }

    setIsSubmitting(true)
    try {
      if (mode === 'signin') {
        await signIn(email, password)
        toast.success('Welcome back!')
      } else {
        await signUp(email, password)
        toast.success('Account created! Check your email to confirm.')
      }
      router.push('/')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-dvh bg-background">
      <Header />
      <main className="max-w-md mx-auto px-4 sm:px-6 py-12">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-secondary border-2 border-surface-container-lowest neo-shadow-secondary mx-auto flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-on-secondary" style={{ fontSize: 32 }}>
              directions_car
            </span>
          </div>
          <h2 className="font-headline text-2xl font-bold text-primary">
            {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-sm text-on-surface-variant mt-1">
            {mode === 'signin'
              ? 'Sign in to sync your progress across devices'
              : 'Sign up to save your quiz history and progress'}
          </p>
        </div>

        {/* Form */}
        <NeoCard level={2} shadow="default">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block font-label text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full bg-surface-container-lowest border-2 border-surface-container-lowest px-4 py-3 text-on-surface font-body placeholder:text-outline focus:border-secondary focus:outline-none transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block font-label text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'signup' ? 'Min 6 characters' : 'Enter password'}
                  required
                  minLength={mode === 'signup' ? 6 : undefined}
                  className="w-full bg-surface-container-lowest border-2 border-surface-container-lowest px-4 py-3 pr-12 text-on-surface font-body placeholder:text-outline focus:border-secondary focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Confirm Password (signup only) */}
            {mode === 'signup' && (
              <div>
                <label className="block font-label text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  required
                  className="w-full bg-surface-container-lowest border-2 border-surface-container-lowest px-4 py-3 text-on-surface font-body placeholder:text-outline focus:border-secondary focus:outline-none transition-colors"
                />
              </div>
            )}

            {/* Submit */}
            <NeoButton
              variant="secondary"
              size="lg"
              fullWidth
              disabled={isSubmitting}
              icon={isSubmitting ? 'hourglass_empty' : mode === 'signin' ? 'login' : 'person_add'}
            >
              {isSubmitting
                ? 'Please wait...'
                : mode === 'signin'
                  ? 'Sign In'
                  : 'Create Account'}
            </NeoButton>
          </form>

          {/* Toggle mode */}
          <div className="mt-5 pt-5 border-t-2 border-surface-container-lowest text-center">
            <p className="text-sm text-on-surface-variant">
              {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
              <button
                onClick={() => {
                  setMode(mode === 'signin' ? 'signup' : 'signin')
                  setConfirmPassword('')
                }}
                className="ml-2 font-headline font-bold text-secondary hover:underline"
              >
                {mode === 'signin' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </NeoCard>

        {/* Benefits */}
        <div className="mt-8 space-y-3">
          <p className="font-label text-xs text-on-surface-variant uppercase tracking-wider text-center mb-3">
            Why sign in?
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: 'cloud_sync', text: 'Sync progress across devices' },
              { icon: 'history', text: 'Permanent quiz history' },
              { icon: 'local_fire_department', text: 'Track streaks & XP' },
            ].map((item) => (
              <div
                key={item.icon}
                className="flex items-center gap-2 bg-surface-container p-3 border-2 border-surface-container-lowest"
              >
                <span className="material-symbols-outlined text-tertiary" style={{ fontSize: 20 }}>
                  {item.icon}
                </span>
                <span className="text-xs text-on-surface-variant">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
