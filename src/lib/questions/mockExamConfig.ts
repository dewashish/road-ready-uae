import type { Question } from '@/types/quiz'
import type { QuizSessionRecord } from '@/context/ProgressContext'
import { MODULE_POOLS } from './modulePools'
import { buildWrongCountMap, buildSeenSet, selectWeightedQuestions } from './selectWeightedQuestions'

export interface MockExamDef {
  id: string
  title: string
  subtitle: string
  icon: string
  distribution: Record<string, number>
}

export const MOCK_EXAMS: MockExamDef[] = [
  {
    id: '1',
    title: 'Mock Test 1',
    subtitle: 'Balanced coverage across all topics',
    icon: 'assignment',
    distribution: {
      'road-signs': 9, 'traffic-rules': 9, 'hazard-perception': 8,
      'driving-conditions': 6, 'critical-situations': 5, 'driving-behavior': 5, 'vehicle-maintenance': 3,
    },
  },
  {
    id: '2',
    title: 'Mock Test 2',
    subtitle: 'Extra focus on signs & hazards',
    icon: 'assignment_late',
    distribution: {
      'road-signs': 11, 'traffic-rules': 7, 'hazard-perception': 9,
      'driving-conditions': 5, 'critical-situations': 5, 'driving-behavior': 5, 'vehicle-maintenance': 3,
    },
  },
  {
    id: '3',
    title: 'Mock Test 3',
    subtitle: 'Emphasis on rules & critical situations',
    icon: 'assignment_turned_in',
    distribution: {
      'road-signs': 7, 'traffic-rules': 11, 'hazard-perception': 7,
      'driving-conditions': 5, 'critical-situations': 7, 'driving-behavior': 5, 'vehicle-maintenance': 3,
    },
  },
  {
    id: '4',
    title: 'Mock Test 4',
    subtitle: 'Comprehensive final practice',
    icon: 'fact_check',
    distribution: {
      'road-signs': 8, 'traffic-rules': 8, 'hazard-perception': 8,
      'driving-conditions': 6, 'critical-situations': 6, 'driving-behavior': 5, 'vehicle-maintenance': 4,
    },
  },
  {
    id: '5',
    title: 'Mock Test 5',
    subtitle: 'Heavy on penalties, fines & black points',
    icon: 'gavel',
    distribution: {
      'road-signs': 6, 'traffic-rules': 13, 'hazard-perception': 7,
      'driving-conditions': 5, 'critical-situations': 5, 'driving-behavior': 6, 'vehicle-maintenance': 3,
    },
  },
  {
    id: '6',
    title: 'Mock Test 6',
    subtitle: 'Focus on driving conditions & vehicle knowledge',
    icon: 'directions_car',
    distribution: {
      'road-signs': 7, 'traffic-rules': 7, 'hazard-perception': 7,
      'driving-conditions': 8, 'critical-situations': 6, 'driving-behavior': 5, 'vehicle-maintenance': 5,
    },
  },
  {
    id: '7',
    title: 'Mock Test 7',
    subtitle: 'Scenario-heavy — hazards & safe driving',
    icon: 'shield',
    distribution: {
      'road-signs': 6, 'traffic-rules': 8, 'hazard-perception': 10,
      'driving-conditions': 5, 'critical-situations': 6, 'driving-behavior': 7, 'vehicle-maintenance': 3,
    },
  },
  {
    id: '8',
    title: 'Mock Test 8',
    subtitle: 'Comprehensive — even spread across all topics',
    icon: 'school',
    distribution: {
      'road-signs': 7, 'traffic-rules': 8, 'hazard-perception': 7,
      'driving-conditions': 6, 'critical-situations': 6, 'driving-behavior': 6, 'vehicle-maintenance': 5,
    },
  },
]

export const MOCK_EXAM_TIME_LIMIT = 30 * 60 // 30 minutes in seconds
export const MOCK_EXAM_QUESTION_COUNT = 45
export const MOCK_EXAM_PASS_PERCENT = 71
export const MOCK_EXAM_XP = 200

/** Select questions for a mock exam across all modules using weighted sampling */
export function selectMockExamQuestions(
  examId: string,
  vehicleType: string,
  history: QuizSessionRecord[]
): Question[] {
  const exam = MOCK_EXAMS.find((e) => e.id === examId)
  if (!exam) return []

  // Build wrong/seen maps from ALL history (not just mock exam history)
  const wrongCounts = buildWrongCountMap(history)
  const seenIds = buildSeenSet(history)

  const allSelected: Question[] = []

  for (const [moduleSlug, count] of Object.entries(exam.distribution)) {
    const pool = MODULE_POOLS[moduleSlug]
    if (!pool) continue

    // Filter by vehicle type (same logic as quiz page)
    const filtered = pool.filter(
      (q) => q.vehicle_types.includes(vehicleType) || q.vehicle_types.includes('B')
    )

    const selected = selectWeightedQuestions(filtered, wrongCounts, seenIds, count)
    allSelected.push(...selected)
  }

  // Shuffle the combined questions
  for (let i = allSelected.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[allSelected[i], allSelected[j]] = [allSelected[j], allSelected[i]]
  }

  // Shuffle answers within each question
  return allSelected.map((q) => ({
    ...q,
    answers: [...q.answers]
      .sort(() => Math.random() - 0.5)
      .map((a, i) => ({ ...a, display_order: i + 1 })),
  }))
}
