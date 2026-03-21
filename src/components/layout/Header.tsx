'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'
import { useProgress } from '@/context/ProgressContext'
import { useAuth } from '@/hooks/useAuth'

const NAV_LINKS = [
  { href: '/', label: 'Home', icon: 'home' },
  { href: '/history', label: 'History', icon: 'history' },
  { href: '/progress', label: 'Progress', icon: 'bar_chart' },
]

interface HeaderProps {
  showBack?: boolean
  backHref?: string
  title?: string
}

export function Header({ showBack, backHref = '/', title }: HeaderProps) {
  const { progress } = useProgress()
  const { user, loading, signOut } = useAuth()
  const pathname = usePathname()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false)
      }
    }
    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUserMenu])

  return (
    <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-xl border-b-2 border-surface-container-lowest">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
        {showBack && (
          <Link
            href={backHref}
            className="neo-push flex items-center justify-center w-10 h-10 bg-surface-container-high border-2 border-surface-container-lowest neo-shadow"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
              arrow_back
            </span>
          </Link>
        )}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-secondary border-2 border-surface-container-lowest neo-shadow flex items-center justify-center">
            <span className="material-symbols-outlined text-on-secondary" style={{ fontSize: 18 }}>
              directions_car
            </span>
          </div>
          <h1 className="font-headline text-lg font-bold tracking-tight text-primary">
            ROAD READY <span className="text-secondary">UAE</span>
          </h1>
        </Link>
        {title && (
          <>
            <span className="text-outline-variant hidden sm:inline">/</span>
            <span className="font-headline text-sm font-semibold text-on-surface-variant uppercase tracking-wider hidden sm:inline">
              {title}
            </span>
          </>
        )}

        {/* Desktop Nav Links */}
        <nav className="hidden sm:flex items-center gap-1 ml-6">
          {NAV_LINKS.map((link) => {
            const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  'flex items-center gap-1.5 px-3 py-1.5 font-label text-xs font-bold uppercase tracking-wider transition-colors',
                  isActive
                    ? 'text-secondary bg-secondary/10 border-b-2 border-secondary'
                    : 'text-on-surface-variant hover:text-primary'
                )}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{link.icon}</span>
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-2 bg-surface-container px-3 py-1.5 border-2 border-surface-container-lowest">
            <span className="material-symbols-outlined text-secondary" style={{ fontSize: 18 }}>
              local_fire_department
            </span>
            <span className="font-label text-xs font-bold text-secondary">{progress.currentStreak}</span>
          </div>
          <div className="flex items-center gap-2 bg-surface-container px-3 py-1.5 border-2 border-surface-container-lowest">
            <span className="material-symbols-outlined text-tertiary" style={{ fontSize: 18 }}>
              star
            </span>
            <span className="font-label text-xs font-bold text-tertiary">{progress.totalXp} XP</span>
          </div>

          {/* Auth indicator */}
          {!loading && (
            user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="neo-push flex items-center gap-2 bg-secondary/10 border-2 border-secondary px-3 py-1.5 transition-colors hover:bg-secondary/20"
                >
                  <span className="material-symbols-outlined text-secondary" style={{ fontSize: 18 }}>
                    person
                  </span>
                  <span className="font-label text-xs font-bold text-secondary hidden sm:inline max-w-[120px] truncate">
                    {user.email?.split('@')[0]}
                  </span>
                  <span className="material-symbols-outlined text-secondary" style={{ fontSize: 16 }}>
                    {showUserMenu ? 'expand_less' : 'expand_more'}
                  </span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-surface border-2 border-surface-container-lowest neo-shadow-lg z-50">
                    <div className="px-4 py-3 border-b-2 border-surface-container-lowest">
                      <p className="font-label text-xs text-on-surface-variant uppercase tracking-wider">Signed in as</p>
                      <p className="font-body text-sm text-primary font-semibold truncate mt-0.5">{user.email}</p>
                    </div>
                    <button
                      onClick={async () => {
                        setShowUserMenu(false)
                        await signOut()
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-error/10 transition-colors"
                    >
                      <span className="material-symbols-outlined text-error" style={{ fontSize: 18 }}>logout</span>
                      <span className="font-label text-sm font-bold text-error">Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth"
                className="neo-push flex items-center gap-2 bg-surface-container px-3 py-1.5 border-2 border-surface-container-lowest transition-colors hover:border-secondary"
              >
                <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 18 }}>
                  login
                </span>
                <span className="font-label text-xs font-bold text-on-surface-variant hidden sm:inline">
                  Sign In
                </span>
              </Link>
            )
          )}
        </div>
      </div>
    </header>
  )
}
