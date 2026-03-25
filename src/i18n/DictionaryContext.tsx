'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { Dictionary } from './dictionaries'
import type { Locale } from './config'

interface DictionaryContextValue {
  dict: Dictionary
  locale: Locale
}

const DictionaryContext = createContext<DictionaryContextValue | null>(null)

export function DictionaryProvider({
  children,
  dict,
  locale,
}: {
  children: ReactNode
  dict: Dictionary
  locale: Locale
}) {
  return (
    <DictionaryContext.Provider value={{ dict, locale }}>
      {children}
    </DictionaryContext.Provider>
  )
}

export function useDictionary(): Dictionary {
  const ctx = useContext(DictionaryContext)
  if (!ctx) throw new Error('useDictionary must be used within DictionaryProvider')
  return ctx.dict
}

export function useLocale(): Locale {
  const ctx = useContext(DictionaryContext)
  if (!ctx) throw new Error('useLocale must be used within DictionaryProvider')
  return ctx.locale
}
