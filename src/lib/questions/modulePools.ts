import type { Question } from '@/types/quiz'
import type { QuizSessionRecord } from '@/context/ProgressContext'

// Import all question data (same as quiz page)
import roadSignsData from '@/data/questions/road-signs.json'
import trafficRulesData from '@/data/questions/traffic-rules.json'
import hazardPerceptionData from '@/data/questions/hazard-perception.json'
import drivingConditionsData from '@/data/questions/driving-conditions.json'
import criticalSituationsData from '@/data/questions/critical-situations.json'
import drivingBehaviorData from '@/data/questions/driving-behavior.json'
import vehicleMaintenanceData from '@/data/questions/vehicle-maintenance.json'
import supplementaryData from '@/data/questions/supplementary.json'
import supplementary2Data from '@/data/questions/supplementary-2.json'
import supplementary3Data from '@/data/questions/supplementary-3.json'
import supplementary4Data from '@/data/questions/supplementary-4.json'
import supplementary5Data from '@/data/questions/supplementary-5.json'
import supplementary6Data from '@/data/questions/supplementary-6.json'
import supplementary7Data from '@/data/questions/supplementary-7.json'
import supplementary8Data from '@/data/questions/supplementary-8.json'
import motorcycleData from '@/data/questions/motorcycle-specific.json'
import heavyTruckData from '@/data/questions/heavy-truck-specific.json'
import lightBusData from '@/data/questions/light-bus-specific.json'
import heavyBusData from '@/data/questions/heavy-bus-specific.json'
import supplementaryRtaData from '@/data/questions/supplementary-rta.json'
import forkliftData from '@/data/questions/forklift-specific.json'

const ALL_SUPPLEMENTARY = [
  ...(supplementaryData as Question[]),
  ...(supplementary2Data as Question[]),
  ...(supplementary3Data as Question[]),
  ...(supplementary4Data as Question[]),
  ...(supplementary5Data as Question[]),
  ...(supplementary6Data as Question[]),
  ...(supplementary7Data as Question[]),
  ...(supplementary8Data as Question[]),
  ...(motorcycleData as Question[]),
  ...(heavyTruckData as Question[]),
  ...(lightBusData as Question[]),
  ...(heavyBusData as Question[]),
  ...(supplementaryRtaData as Question[]),
  ...(forkliftData as Question[]),
]

function mergeByModule(moduleKey: string, primary: Question[]): Question[] {
  const matching = ALL_SUPPLEMENTARY.filter((q) => q.module === moduleKey)
  return [...primary, ...matching]
}

/** Full merged question pools per module (all vehicle types) */
export const MODULE_POOLS: Record<string, Question[]> = {
  'road-signs': mergeByModule('road_signs', roadSignsData as Question[]),
  'traffic-rules': mergeByModule('traffic_rules', trafficRulesData as Question[]),
  'hazard-perception': mergeByModule('hazard_perception', hazardPerceptionData as Question[]),
  'driving-conditions': mergeByModule('driving_conditions', drivingConditionsData as Question[]),
  'critical-situations': mergeByModule('critical_situations', criticalSituationsData as Question[]),
  'driving-behavior': mergeByModule('driving_behavior', drivingBehaviorData as Question[]),
  'vehicle-maintenance': mergeByModule('vehicle_maintenance', vehicleMaintenanceData as Question[]),
}

/** Get the set of question IDs for a module filtered by vehicle type */
export function getModulePoolIds(moduleSlug: string, vehicleType: string): Set<string> {
  const pool = MODULE_POOLS[moduleSlug]
  if (!pool) return new Set()
  return new Set(
    pool
      .filter((q) => q.vehicle_types.includes(vehicleType) || q.vehicle_types.includes('B'))
      .map((q) => q.id)
  )
}

/** Get the total pool count for a module filtered by vehicle type */
export function getModulePoolCount(moduleSlug: string, vehicleType: string): number {
  return getModulePoolIds(moduleSlug, vehicleType).size
}

/** Compute seen questions stats for a module */
export function getModuleSeenStats(
  moduleSlug: string,
  vehicleType: string,
  history: QuizSessionRecord[]
): { seen: number; total: number; percent: number } {
  const poolIds = getModulePoolIds(moduleSlug, vehicleType)
  const total = poolIds.size
  if (total === 0) return { seen: 0, total: 0, percent: 0 }

  const seenIds = new Set<string>()
  for (const session of history) {
    if (session.moduleSlug === moduleSlug && session.vehicleType === vehicleType) {
      for (const answer of session.answers) {
        if (poolIds.has(answer.questionId)) {
          seenIds.add(answer.questionId)
        }
      }
    }
  }

  const seen = seenIds.size
  return { seen, total, percent: Math.round((seen / total) * 100) }
}
