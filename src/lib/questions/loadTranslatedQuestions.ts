import type { Question } from '@/types/quiz'
import type { Locale } from '@/i18n/config'

interface QuestionOverlay {
  id: string
  question_text?: string
  explanation?: string | null
  answers?: { id: string; answer_text: string }[]
}

/**
 * Merge translated overlay onto English base questions.
 * Falls back to English for any missing translations.
 */
function mergeOverlay(base: Question[], overlay: QuestionOverlay[]): Question[] {
  const overlayMap = new Map(overlay.map((q) => [q.id, q]))

  return base.map((question) => {
    const translated = overlayMap.get(question.id)
    if (!translated) return question

    return {
      ...question,
      question_text: translated.question_text ?? question.question_text,
      explanation: translated.explanation !== undefined ? translated.explanation : question.explanation,
      answers: question.answers.map((answer) => {
        const translatedAnswer = translated.answers?.find((a) => a.id === answer.id)
        return translatedAnswer
          ? { ...answer, answer_text: translatedAnswer.answer_text }
          : answer
      }),
    }
  })
}

/**
 * Load questions for a module, with optional translation overlay.
 * If locale is 'en' or no overlay exists, returns English base.
 *
 * Translation overlay files are placed in src/data/questions/{locale}/{moduleSlug}.json
 * They only need to contain translated text fields - non-text fields inherit from English.
 *
 * To add translations:
 * 1. Create e.g. src/data/questions/ar/road-signs.json
 * 2. Add the dynamic import to the switch case below
 */
export async function loadTranslatedQuestions(
  moduleSlug: string,
  locale: Locale,
  baseQuestions: Question[]
): Promise<Question[]> {
  if (locale === 'en') return baseQuestions

  try {
    // Dynamic imports are added here as translation files are created.
    // Currently no question translations exist (v1 = UI translated, questions in English).
    // When Arabic translations are ready, uncomment and add:
    //
    // if (locale === 'ar') {
    //   if (moduleSlug === 'road-signs') {
    //     const overlay = await import('@/data/questions/ar/road-signs.json')
    //     return mergeOverlay(baseQuestions, overlay.default as QuestionOverlay[])
    //   }
    // }

    return baseQuestions
  } catch {
    return baseQuestions
  }
}
