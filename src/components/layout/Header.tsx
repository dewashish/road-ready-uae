import Link from 'next/link'

interface HeaderProps {
  showBack?: boolean
  backHref?: string
  title?: string
  xp?: number
  streak?: number
}

export function Header({ showBack, backHref = '/', title, xp, streak }: HeaderProps) {
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
            <span className="text-outline-variant">/</span>
            <span className="font-headline text-sm font-semibold text-on-surface-variant uppercase tracking-wider">
              {title}
            </span>
          </>
        )}
        <div className="ml-auto flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-surface-container px-3 py-1.5 border-2 border-surface-container-lowest">
            <span className="material-symbols-outlined text-secondary" style={{ fontSize: 18 }}>
              local_fire_department
            </span>
            <span className="font-label text-xs font-bold text-secondary">{streak ?? 0}</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-surface-container px-3 py-1.5 border-2 border-surface-container-lowest">
            <span className="material-symbols-outlined text-tertiary" style={{ fontSize: 18 }}>
              star
            </span>
            <span className="font-label text-xs font-bold text-tertiary">{xp ?? 0} XP</span>
          </div>
        </div>
      </div>
    </header>
  )
}
