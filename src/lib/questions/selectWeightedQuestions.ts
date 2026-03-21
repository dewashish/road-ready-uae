import type { Question } from '@/types/quiz'
import type { QuizSessionRecord } from '@/context/ProgressContext'

/**
 * Build a map of questionId → number of times answered wrong.
 */
export function buildWrongCountMap(
  sessions: QuizSessionRecord[]
): Map<string, number> {
  const map = new Map<string, number>()
  for (const session of sessions) {
    for (const answer of session.answers) {
      if (!answer.isCorrect) {
        map.set(answer.questionId, (map.get(answer.questionId) ?? 0) + 1)
      }
    }
  }
  return map
}

/**
 * Build a set of all question IDs the user has ever seen.
 */
export function buildSeenSet(
  sessions: QuizSessionRecord[]
): Set<string> {
  const seen = new Set<string>()
  for (const session of sessions) {
    for (const answer of session.answers) {
      seen.add(answer.questionId)
    }
  }
  return seen
}

/**
 * Select questions using weighted random sampling (without replacement).
 *
 * Weighting:
 * - Previously wrong (capped at 3): 1.0 + wrongCount × 3.0
 * - Never seen:                      1.0 + 0.5
 * - Seen & always correct:           1.0
 * - Multiplied by relevance_rank / 8 (range 1.0–1.25)
 */
export function selectWeightedQuestions(
  pool: Question[],
  wrongCounts: Map<string, number>,
  seenIds: Set<string>,
  count: number = 30
): Question[] {
  if (pool.length <= count) return [...pool]

  const entries = pool.map((q) => {
    const wrongCount = Math.min(wrongCounts.get(q.id) ?? 0, 3)
    let weight = 1.0
    if (wrongCount > 0) {
      weight += wrongCount * 3.0
    } else if (!seenIds.has(q.id)) {
      weight += 0.5
    }
    weight *= (q.relevance_rank ?? 8) / 8.0
    return { question: q, weight }
  })

  const selected: Question[] = []
  const remaining = [...entries]

  for (let i = 0; i < count && remaining.length > 0; i++) {
    const totalWeight = remaining.reduce((sum, e) => sum + e.weight, 0)
    let r = Math.random() * totalWeight
    let idx = 0
    for (; idx < remaining.length - 1; idx++) {
      r -= remaining[idx].weight
      if (r <= 0) break
    }
    selected.push(remaining[idx].question)
    remaining.splice(idx, 1)
  }

  return selected
}
