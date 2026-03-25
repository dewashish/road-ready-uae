'use client'

import { useState, useRef, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useLocale } from '@/i18n/DictionaryContext'
import { locales, localeNames, type Locale } from '@/i18n/config'

export function LanguageSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  function switchLocale(newLocale: Locale) {
    // Replace current locale prefix with new one
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/'
    const newPath = `/${newLocale}${pathWithoutLocale}`

    // Set cookie for middleware persistence
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000;SameSite=Lax`

    setOpen(false)
    router.push(newPath)
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="neo-push flex items-center gap-1.5 bg-surface-container px-2.5 py-1.5 border-2 border-surface-container-lowest transition-colors hover:border-secondary"
      >
        <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 16 }}>
          translate
        </span>
        <span className="font-label text-[10px] font-bold text-on-surface-variant uppercase tracking-wider hidden sm:inline">
          {localeNames[locale]}
        </span>
        <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 14 }}>
          {open ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {open && (
        <div className="absolute end-0 top-full mt-2 w-48 bg-surface border-2 border-surface-container-lowest neo-shadow-lg z-50">
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => switchLocale(loc)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-start transition-colors ${
                loc === locale
                  ? 'bg-secondary/10 text-secondary'
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <span className="font-body text-sm font-semibold">{localeNames[loc]}</span>
              {loc === locale && (
                <span className="material-symbols-outlined ms-auto text-secondary" style={{ fontSize: 16 }}>check</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
