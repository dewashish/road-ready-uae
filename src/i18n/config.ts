export const locales = ['en', 'ar', 'ur', 'hi', 'bn', 'ml', 'tl', 'ta', 'si'] as const
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
  tl: 'Filipino',
  ta: 'தமிழ்',
  si: 'සිංහල',
}

export const ogLocaleMap: Record<Locale, string> = {
  en: 'en_AE',
  ar: 'ar_AE',
  ur: 'ur_PK',
  hi: 'hi_IN',
  bn: 'bn_BD',
  ml: 'ml_IN',
  tl: 'tl_PH',
  ta: 'ta_IN',
  si: 'si_LK',
}
