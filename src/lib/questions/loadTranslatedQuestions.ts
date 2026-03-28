import type { Question } from '@/types/quiz'
import type { Locale } from '@/i18n/config'

interface QuestionOverlay {
  id: string
  question_text?: string
  explanation?: string | null
  answers?: { id: string; answer_text: string }[]
}

/** Apply a single overlay to a question. Falls back to English for missing fields. */
function applyOverlay(question: Question, translated: QuestionOverlay): Question {
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
}

/** Merge translated overlays onto English base questions. */
function mergeOverlay(base: Question[], overlay: QuestionOverlay[]): Question[] {
  const overlayMap = new Map(overlay.map((q) => [q.id, q]))
  return base.map((question) => {
    const translated = overlayMap.get(question.id)
    return translated ? applyOverlay(question, translated) : question
  })
}

const MODULE_SLUGS = [
  'road-signs',
  'traffic-rules',
  'hazard-perception',
  'driving-conditions',
  'critical-situations',
  'driving-behavior',
  'vehicle-maintenance',
] as const

type ModuleSlug = (typeof MODULE_SLUGS)[number]

const overlayLoaders: Record<string, () => Promise<{ default: QuestionOverlay[] }>> = {
  'ar/road-signs': () => import('@/data/questions/ar/road-signs.json'),
  'ar/traffic-rules': () => import('@/data/questions/ar/traffic-rules.json'),
  'ar/hazard-perception': () => import('@/data/questions/ar/hazard-perception.json'),
  'ar/driving-conditions': () => import('@/data/questions/ar/driving-conditions.json'),
  'ar/critical-situations': () => import('@/data/questions/ar/critical-situations.json'),
  'ar/driving-behavior': () => import('@/data/questions/ar/driving-behavior.json'),
  'ar/vehicle-maintenance': () => import('@/data/questions/ar/vehicle-maintenance.json'),

  'ur/road-signs': () => import('@/data/questions/ur/road-signs.json'),
  'ur/traffic-rules': () => import('@/data/questions/ur/traffic-rules.json'),
  'ur/hazard-perception': () => import('@/data/questions/ur/hazard-perception.json'),
  'ur/driving-conditions': () => import('@/data/questions/ur/driving-conditions.json'),
  'ur/critical-situations': () => import('@/data/questions/ur/critical-situations.json'),
  'ur/driving-behavior': () => import('@/data/questions/ur/driving-behavior.json'),
  'ur/vehicle-maintenance': () => import('@/data/questions/ur/vehicle-maintenance.json'),

  'hi/road-signs': () => import('@/data/questions/hi/road-signs.json'),
  'hi/traffic-rules': () => import('@/data/questions/hi/traffic-rules.json'),
  'hi/hazard-perception': () => import('@/data/questions/hi/hazard-perception.json'),
  'hi/driving-conditions': () => import('@/data/questions/hi/driving-conditions.json'),
  'hi/critical-situations': () => import('@/data/questions/hi/critical-situations.json'),
  'hi/driving-behavior': () => import('@/data/questions/hi/driving-behavior.json'),
  'hi/vehicle-maintenance': () => import('@/data/questions/hi/vehicle-maintenance.json'),

  'bn/road-signs': () => import('@/data/questions/bn/road-signs.json'),
  'bn/traffic-rules': () => import('@/data/questions/bn/traffic-rules.json'),
  'bn/hazard-perception': () => import('@/data/questions/bn/hazard-perception.json'),
  'bn/driving-conditions': () => import('@/data/questions/bn/driving-conditions.json'),
  'bn/critical-situations': () => import('@/data/questions/bn/critical-situations.json'),
  'bn/driving-behavior': () => import('@/data/questions/bn/driving-behavior.json'),
  'bn/vehicle-maintenance': () => import('@/data/questions/bn/vehicle-maintenance.json'),

  'ml/road-signs': () => import('@/data/questions/ml/road-signs.json'),
  'ml/traffic-rules': () => import('@/data/questions/ml/traffic-rules.json'),
  'ml/hazard-perception': () => import('@/data/questions/ml/hazard-perception.json'),
  'ml/driving-conditions': () => import('@/data/questions/ml/driving-conditions.json'),
  'ml/critical-situations': () => import('@/data/questions/ml/critical-situations.json'),
  'ml/driving-behavior': () => import('@/data/questions/ml/driving-behavior.json'),
  'ml/vehicle-maintenance': () => import('@/data/questions/ml/vehicle-maintenance.json'),
}

/**
 * Load questions for a module, with translation overlay applied.
 * If locale is 'en' or no overlay exists, returns English base.
 */
export async function loadTranslatedQuestions(
  moduleSlug: string,
  locale: Locale,
  baseQuestions: Question[]
): Promise<Question[]> {
  if (locale === 'en') return baseQuestions

  const key = `${locale}/${moduleSlug}`
  const loader = overlayLoaders[key]
  if (!loader) return baseQuestions

  try {
    const overlay = await loader()
    return mergeOverlay(baseQuestions, overlay.default)
  } catch {
    return baseQuestions
  }
}

/**
 * Translate a batch of questions that may span multiple modules.
 * Used by mock exams which pull questions from all modules.
 */
export async function translateQuestionBatch(
  questions: Question[],
  locale: Locale
): Promise<Question[]> {
  if (locale === 'en') return questions

  // Load all overlay files for this locale in parallel
  const loaderEntries = MODULE_SLUGS
    .map((slug) => ({ slug, loader: overlayLoaders[`${locale}/${slug}`] }))
    .filter((e) => e.loader)

  const overlayResults = await Promise.allSettled(
    loaderEntries.map((e) => e.loader!())
  )

  // Build a single id→overlay map from all modules
  const overlayMap = new Map<string, QuestionOverlay>()
  for (const result of overlayResults) {
    if (result.status === 'fulfilled') {
      for (const q of result.value.default) {
        overlayMap.set(q.id, q)
      }
    }
  }

  if (overlayMap.size === 0) return questions

  return questions.map((question) => {
    const translated = overlayMap.get(question.id)
    return translated ? applyOverlay(question, translated) : question
  })
}
