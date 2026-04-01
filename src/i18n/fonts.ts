import { Space_Grotesk, Manrope, IBM_Plex_Sans_Arabic, Noto_Sans_Devanagari, Noto_Sans_Bengali, Noto_Nastaliq_Urdu, Noto_Sans_Malayalam, Noto_Sans_Tamil, Noto_Sans_Sinhala } from 'next/font/google'
import type { Locale } from './config'

const spaceGrotesk = Space_Grotesk({
  variable: '--font-headline',
  subsets: ['latin'],
  display: 'swap',
})

const manrope = Manrope({
  variable: '--font-body',
  subsets: ['latin'],
  display: 'swap',
})

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  variable: '--font-arabic',
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

const notoNastaliqUrdu = Noto_Nastaliq_Urdu({
  variable: '--font-nastaliq',
  subsets: ['arabic'],
  display: 'swap',
})

const notoDevanagari = Noto_Sans_Devanagari({
  variable: '--font-devanagari',
  subsets: ['devanagari'],
  display: 'swap',
})

const notoBengali = Noto_Sans_Bengali({
  variable: '--font-bengali',
  subsets: ['bengali'],
  display: 'swap',
})

const notoMalayalam = Noto_Sans_Malayalam({
  variable: '--font-malayalam',
  subsets: ['malayalam'],
  display: 'swap',
})

const notoTamil = Noto_Sans_Tamil({
  variable: '--font-tamil',
  subsets: ['tamil'],
  display: 'swap',
})

const notoSinhala = Noto_Sans_Sinhala({
  variable: '--font-sinhala',
  subsets: ['sinhala'],
  display: 'swap',
})

// Base Latin fonts always loaded
const baseFontClasses = `${spaceGrotesk.variable} ${manrope.variable}`

export function getFontsForLocale(locale: Locale): string {
  switch (locale) {
    case 'ar':
      return `${baseFontClasses} ${ibmPlexArabic.variable}`
    case 'ur':
      return `${baseFontClasses} ${notoNastaliqUrdu.variable}`
    case 'hi':
      return `${baseFontClasses} ${notoDevanagari.variable}`
    case 'bn':
      return `${baseFontClasses} ${notoBengali.variable}`
    case 'ml':
      return `${baseFontClasses} ${notoMalayalam.variable}`
    case 'ta':
      return `${baseFontClasses} ${notoTamil.variable}`
    case 'si':
      return `${baseFontClasses} ${notoSinhala.variable}`
    default:
      return baseFontClasses
  }
}
