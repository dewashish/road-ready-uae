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

/** Whether a question is from an official source (EDCAD or RTA). */
function isOfficial(q: Question): boolean {
  return q.is_edcad_style || q.source === 'rta'
}

interface WeightedEntry {
  question: Question
  weight: number
}

/**
 * Weighted random sampling without replacement.
 * Picks up to `count` items from `entries` proportional to weight.
 */
function weightedSample(entries: WeightedEntry[], count: number): Question[] {
  if (entries.length === 0) return []
  if (entries.length <= count) return entries.map((e) => e.question)

  const selected: Question[] = []
  const remaining = [...entries]

  for (let i = 0; i < count && remaining.length > 0; i++) {
    const totalWeight = remaining.reduce((sum, e) => sum + e.weight, 0)
    let r = Math.random() * totalWeight
    let idx = 0
    for (; idx < remaining.length; idx++) {
      r -= remaining[idx].weight
      if (r <= 0) break
    }
    // Clamp index to valid range
    idx = Math.min(idx, remaining.length - 1)
    selected.push(remaining[idx].question)
    remaining.splice(idx, 1)
  }

  return selected
}

/**
 * Select questions using tiered weighted sampling.
 *
 * Tier 1 — Unseen Official (EDCAD + RTA, never seen):
 *   Fill as many slots as possible. EDCAD weight 1.5, RTA weight 1.2.
 *
 * Tier 2 — Previously Wrong Official (EDCAD + RTA, answered wrong):
 *   Fill remaining slots. Weight: 1.0 + wrongCount × 2.0.
 *
 * Tier 3 — Everything Else (unofficial unseen, seen-correct, wrong unofficial):
 *   Fill any remaining slots.
 *
 * All tiers multiply by relevance_rank / 8.0.
 */
export function selectWeightedQuestions(
  pool: Question[],
  wrongCounts: Map<string, number>,
  seenIds: Set<string>,
  count: number = 30
): Question[] {
  if (pool.length <= count) return [...pool]

  const tier1: WeightedEntry[] = [] // unseen official
  const tier2: WeightedEntry[] = [] // wrong official
  const tier3: WeightedEntry[] = [] // everything else

  for (const q of pool) {
    const wrongCount = Math.min(wrongCounts.get(q.id) ?? 0, 3)
    const seen = seenIds.has(q.id)
    const official = isOfficial(q)
    const relevance = (q.relevance_rank ?? 8) / 8.0

    if (official && !seen) {
      // Tier 1: unseen official — EDCAD slightly higher than RTA
      const sourceWeight = q.is_edcad_style ? 1.5 : 1.2
      tier1.push({ question: q, weight: sourceWeight * relevance })
    } else if (official && wrongCount > 0) {
      // Tier 2: wrong official — reinforce mistakes on official material
      const w = 1.0 + wrongCount * 2.0
      tier2.push({ question: q, weight: w * relevance })
    } else {
      // Tier 3: everything else
      let w: number
      if (!seen && !official) {
        w = 1.0 // unseen unofficial
      } else if (wrongCount > 0) {
        w = 0.8 + wrongCount * 1.5 // wrong unofficial
      } else if (official) {
        w = 0.6 // seen-correct official
      } else {
        w = 0.3 // seen-correct unofficial
      }
      tier3.push({ question: q, weight: w * relevance })
    }
  }

  // Select from tiers in priority order
  const selected: Question[] = []
  for (const tier of [tier1, tier2, tier3]) {
    if (selected.length >= count) break
    const needed = count - selected.length
    const picked = weightedSample(tier, needed)
    selected.push(...picked)
  }

  return selected
}
