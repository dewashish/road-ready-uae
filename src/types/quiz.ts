export type VehicleType = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'

export type ModuleSlug =
  | 'road-signs'
  | 'traffic-rules'
  | 'hazard-perception'
  | 'driving-conditions'
  | 'critical-situations'
  | 'driving-behavior'
  | 'vehicle-maintenance'

export type ModuleStatus = 'locked' | 'available' | 'in_progress' | 'completed' | 'mastered'

export type SessionType = 'practice' | 'module_quiz' | 'mock_exam'

export interface Question {
  id: string
  question_text: string
  explanation: string | null
  module: string
  vehicle_types: string[]
  difficulty: number
  relevance_rank: number
  svg_illustration_key: string | null
  image_url: string | null
  tags: string[]
  is_edcad_style: boolean
  answers: Answer[]
}

export interface Answer {
  id: string
  question_id: string
  answer_text: string
  is_correct: boolean
  display_order: number
}

export interface Module {
  id: string
  slug: string
  title: string
  description: string | null
  icon_name: string
  display_order: number
  question_count: number
  passing_score: number
  vehicle_type: string
  prerequisite_module_id: string | null
  xp_reward: number
}

export interface QuizSession {
  id: string
  module_id: string | null
  session_type: SessionType
  vehicle_type: string
  total_questions: number
  correct_answers: number
  score_percent: number | null
  time_spent_secs: number | null
  passed: boolean | null
  started_at: string
  completed_at: string | null
}

export interface QuizState {
  questions: Question[]
  currentIndex: number
  selectedAnswerId: string | null
  isAnswered: boolean
  answers: Record<string, { selectedId: string; isCorrect: boolean }>
  score: number
  status: 'loading' | 'active' | 'reviewing' | 'completed'
  timeRemaining: number | null
}

export type QuizAction =
  | { type: 'SELECT_ANSWER'; answerId: string }
  | { type: 'CHECK_ANSWER' }
  | { type: 'NEXT_QUESTION' }
  | { type: 'SKIP' }
  | { type: 'COMPLETE' }
  | { type: 'TICK_TIMER' }
  | { type: 'SET_QUESTIONS'; questions: Question[] }
  | { type: 'START_MOCK_EXAM'; questions: Question[]; timeLimit: number }

export interface UserModuleProgress {
  module_id: string
  status: ModuleStatus
  best_score: number
  attempts: number
  questions_seen: number
  last_attempted: string | null
}

export interface VehicleCategory {
  type: VehicleType
  name: string
  description: string
  icon: string
  minAge: number
}

export const VEHICLE_CATEGORIES: VehicleCategory[] = [
  { type: 'B', name: 'Light Vehicle', description: 'Cars & SUVs up to 3,500 kg', icon: 'directions_car', minAge: 18 },
  { type: 'A', name: 'Motorcycle', description: 'Two-wheeled motor vehicles', icon: 'two_wheeler', minAge: 17 },
  { type: 'C', name: 'Heavy Truck', description: 'Trucks over 3,500 kg', icon: 'local_shipping', minAge: 20 },
  { type: 'D', name: 'Light Bus', description: 'Buses up to 26 passengers', icon: 'airport_shuttle', minAge: 21 },
  { type: 'E', name: 'Heavy Bus', description: 'Large passenger buses', icon: 'directions_bus', minAge: 21 },
  { type: 'F', name: 'Forklift', description: 'Industrial lift trucks', icon: 'forklift', minAge: 18 },
]
