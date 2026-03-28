'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { Header } from '@/components/layout/Header'
import { NeoCard } from '@/components/ui/NeoCard'
import { NeoButton } from '@/components/ui/NeoButton'
import { useAuth } from '@/hooks/useAuth'
import { useDictionary, useLocale } from '@/i18n/DictionaryContext'
import { localePath } from '@/i18n/utils'

export default function AuthPage() {
  const router = useRouter()
  const { signIn, signUp } = useAuth()
  const dict = useDictionary()
  const locale = useLocale()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const passwordStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3
  const passwordsMatch = password === confirmPassword
  const strengthLabels = ['', 'Weak', 'Good', 'Strong']
  const strengthColors = ['', 'bg-error', 'bg-secondary', 'bg-success']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return

    if (mode === 'signup') {
      if (password.length < 6) {
        toast.error(dict.auth.passwordMinLength)
        return
      }
      if (password !== confirmPassword) {
        toast.error(dict.auth.passwordsDontMatch)
        return
      }
    }

    setIsSubmitting(true)
    try {
      if (mode === 'signin') {
        await signIn(email, password)
        toast.success(dict.auth.welcomeBackToast)
      } else {
        await signUp(email, password)
        toast.success(dict.auth.accountCreatedToast)
      }
      router.push(localePath(locale, '/'))
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
      <main id="main-content" className="max-w-md mx-auto px-4 sm:px-6 py-12">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-secondary border-2 border-surface-container-lowest neo-shadow-secondary mx-auto flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-on-secondary" style={{ fontSize: 32 }}>
              directions_car
            </span>
          </div>
          <h2 className="font-headline text-2xl font-bold text-primary">
            {mode === 'signin' ? dict.auth.welcomeBack : dict.auth.createAccount}
          </h2>
          <p className="text-sm text-on-surface-variant mt-1">
            {mode === 'signin'
              ? dict.auth.signInDesc
              : dict.auth.signUpDesc}
          </p>
        </div>

        {/* Form */}
        <NeoCard level={2} shadow="default">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="auth-email" className="block font-label text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                {dict.auth.email}
              </label>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, email: true }))}
                placeholder={dict.auth.emailPlaceholder}
                required
                aria-invalid={touched.email && !emailValid ? 'true' : undefined}
                className={`w-full bg-surface-container-lowest border-2 px-4 py-3 text-on-surface font-body placeholder:text-outline focus:border-secondary focus:outline-none transition-colors ${
                  touched.email && email && !emailValid ? 'border-error' : 'border-surface-container-lowest'
                }`}
              />
              {touched.email && email && !emailValid && (
                <p className="mt-1 text-xs text-error">{'Please enter a valid email address'}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="auth-password" className="block font-label text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                {dict.auth.password}
              </label>
              <div className="relative">
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'signup' ? dict.auth.passwordPlaceholderSignUp : dict.auth.passwordPlaceholderSignIn}
                  required
                  minLength={mode === 'signup' ? 6 : undefined}
                  className="w-full bg-surface-container-lowest border-2 border-surface-container-lowest px-4 py-3 pe-12 text-on-surface font-body placeholder:text-outline focus:border-secondary focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: 20 }}>
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
              {/* Password strength indicator (signup only) */}
              {mode === 'signup' && password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 transition-colors ${
                          passwordStrength >= level ? strengthColors[passwordStrength] : 'bg-surface-container-highest'
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`mt-1 text-[10px] font-label uppercase tracking-wider ${
                    passwordStrength === 1 ? 'text-error' : passwordStrength === 2 ? 'text-secondary' : 'text-success'
                  }`}>
                    {strengthLabels[passwordStrength]}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password (signup only) */}
            {mode === 'signup' && (
              <div>
                <label htmlFor="auth-confirm-password" className="block font-label text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                  {dict.auth.confirmPassword}
                </label>
                <input
                  id="auth-confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() => setTouched(t => ({ ...t, confirmPassword: true }))}
                  placeholder={dict.auth.confirmPasswordPlaceholder}
                  required
                  aria-invalid={touched.confirmPassword && !passwordsMatch ? 'true' : undefined}
                  className={`w-full bg-surface-container-lowest border-2 px-4 py-3 text-on-surface font-body placeholder:text-outline focus:border-secondary focus:outline-none transition-colors ${
                    touched.confirmPassword && confirmPassword && !passwordsMatch ? 'border-error' : 'border-surface-container-lowest'
                  }`}
                />
                {touched.confirmPassword && confirmPassword && !passwordsMatch && (
                  <p className="mt-1 text-xs text-error">{dict.auth.passwordsDontMatch}</p>
                )}
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
                ? dict.auth.pleaseWait
                : mode === 'signin'
                  ? dict.common.signIn
                  : dict.auth.createAccount}
            </NeoButton>
          </form>

          {/* Toggle mode */}
          <div className="mt-5 pt-5 border-t-2 border-surface-container-lowest text-center">
            <p className="text-sm text-on-surface-variant">
              {mode === 'signin' ? dict.auth.dontHaveAccount : dict.auth.alreadyHaveAccount}
              <button
                onClick={() => {
                  setMode(mode === 'signin' ? 'signup' : 'signin')
                  setConfirmPassword('')
                }}
                className="ml-2 font-headline font-bold text-secondary hover:underline"
              >
                {mode === 'signin' ? dict.common.signUp : dict.common.signIn}
              </button>
            </p>
          </div>
        </NeoCard>

        {/* Benefits */}
        <div className="mt-8 space-y-3">
          <p className="font-label text-xs text-on-surface-variant uppercase tracking-wider text-center mb-3">
            {dict.auth.whySignIn}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: 'cloud_sync', text: dict.auth.syncProgress },
              { icon: 'history', text: dict.auth.permanentHistory },
              { icon: 'local_fire_department', text: dict.auth.trackStreaks },
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
