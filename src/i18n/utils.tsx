'use client'

import Link from 'next/link'
import { type ComponentProps } from 'react'
import { useLocale } from './DictionaryContext'

export function localePath(locale: string, path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `/${locale}${cleanPath}`
}

export function LocaleLink(props: ComponentProps<typeof Link>) {
  const locale = useLocale()
  const href = typeof props.href === 'string'
    ? localePath(locale, props.href)
    : props.href
  return <Link {...props} href={href} />
}
