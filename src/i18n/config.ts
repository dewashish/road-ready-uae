export const locales = ['en', 'ar', 'ur', 'hi', 'bn', 'ml'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

export const rtlLocales: Locale[] = ['ar', 'ur']

export function isRtl(locale: string): boolean {
  return rtlLocales.includes(locale as Locale)
}

export function hasLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}

export const localeNames: Record<Locale, string> = {
  en: 'English',
  ar: 'العربية',
  ur: 'اُردو',
  hi: 'हिन्दी',
  bn: 'বাংলা',
  ml: 'മലയാളം',
}
