'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'
import { useProgress } from '@/context/ProgressContext'

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
  const pathname = usePathname()

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
        </div>
      </div>
    </header>
  )
}
