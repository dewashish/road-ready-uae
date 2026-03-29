'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'
import { useDictionary, useLocale } from '@/i18n/DictionaryContext'
import { localePath } from '@/i18n/utils'

export function BottomNav() {
  const pathname = usePathname()
  const dict = useDictionary()
  const locale = useLocale()

  const NAV_ITEMS = [
    { href: '/', icon: 'home', label: dict.common.home },
    { href: '/history', icon: 'history', label: dict.common.history },
    { href: '/progress', icon: 'bar_chart', label: dict.common.progress },
  ]

  return (
    <nav className="fixed bottom-0 start-0 end-0 z-50 sm:hidden bg-surface-container border-t-2 border-surface-container-lowest pb-safe" aria-label="Main navigation">
      <div className="flex items-center justify-around h-16">
        {NAV_ITEMS.map((item) => {
          const localizedHref = localePath(locale, item.href)
          const isActive = item.href === '/'
            ? pathname === localizedHref
            : pathname.startsWith(localizedHref)
          return (
            <Link
              key={item.href}
              href={localizedHref}
              className={clsx(
                'flex flex-col items-center gap-0.5 px-4 py-2 transition-colors',
                isActive ? 'text-secondary' : 'text-on-surface-variant'
              )}
            >
              <span
                className="material-symbols-outlined"
                aria-hidden="true"
                style={{
                  fontSize: 24,
                  fontVariationSettings: isActive ? '"FILL" 1' : '"FILL" 0',
                }}
              >
                {item.icon}
              </span>
              <span className="font-label text-[10px] font-bold uppercase tracking-wider">
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
