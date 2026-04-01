import 'server-only'
import type { Locale } from './config'

const dictionaries = {
  en: () => import('./dictionaries/en.json').then((m) => m.default),
  ar: () => import('./dictionaries/ar.json').then((m) => m.default),
  ur: () => import('./dictionaries/ur.json').then((m) => m.default),
  hi: () => import('./dictionaries/hi.json').then((m) => m.default),
  bn: () => import('./dictionaries/bn.json').then((m) => m.default),
  ml: () => import('./dictionaries/ml.json').then((m) => m.default),
  tl: () => import('./dictionaries/tl.json').then((m) => m.default),
  ta: () => import('./dictionaries/ta.json').then((m) => m.default),
  si: () => import('./dictionaries/si.json').then((m) => m.default),
}

export async function getDictionary(locale: Locale) {
  return dictionaries[locale]()
}

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>
