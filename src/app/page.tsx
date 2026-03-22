'use client'

import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'motion/react'
import { Header } from '@/components/layout/Header'
import { BottomNav } from '@/components/layout/BottomNav'
import { CategoryCard } from '@/components/home/CategoryCard'
import { HeroSection, VintageCar } from '@/components/home/HeroSection'
import { NeoCard } from '@/components/ui/NeoCard'
import { VEHICLE_CATEGORIES } from '@/types/quiz'
import { useProgress } from '@/context/ProgressContext'

const ALL_MODULE_SLUGS = [
  'road-signs', 'traffic-rules', 'hazard-perception',
  'driving-conditions', 'critical-situations', 'driving-behavior', 'vehicle-maintenance',
]

export default function HomePage() {
  const { progress } = useProgress()
  const dailyDone = progress.dailyChallenge?.completed ?? 0
  const dailyTarget = progress.dailyChallenge?.target ?? 10

  // Count completed modules per vehicle type (keys are "B:road-signs", etc.)
  // Also checks legacy unscoped keys for backwards compatibility
  function getVehicleProgress(vehicleType: string) {
    const completed = ALL_MODULE_SLUGS.filter(
      (slug) => {
        const scoped = progress.modules[`${vehicleType}:${slug}`]?.completionCount ?? 0
        const legacy = progress.modules[slug]?.completionCount ?? 0
        return (vehicleType === 'B' ? (scoped > 0 || legacy > 0) : scoped > 0)
      }
    ).length
    return completed
  }

  const vehicleSectionRef = useRef<HTMLDivElement>(null)
  const vehicleInView = useInView(vehicleSectionRef, { once: true, margin: '-50px' })

  // Car drives across the "road" (vehicle section) as it scrolls to the top
  // "start 80%" = section top is 80% down viewport (just appearing), "start start" = reached top
  const { scrollYProgress: sectionProgress } = useScroll({
    target: vehicleSectionRef,
    offset: ['start 80%', 'start start'],
  })
  const carLeft = useTransform(sectionProgress, [0, 1], ['-15%', '110%'])

  const dailyChallengeRef = useRef<HTMLDivElement>(null)
  const dailyInView = useInView(dailyChallengeRef, { once: true, margin: '-30px' })

  return (
    <div className="min-h-dvh bg-background pb-20 sm:pb-0">
      <Header />
      <HeroSection />
      <main className="max-w-7xl mx-auto px-4 sm:px-6">
        <div id="vehicle-section" className="relative z-30 mb-6 bg-background pt-6 -mt-[96vh]" ref={vehicleSectionRef}>
          {/* Car driving on the "road" (this section) */}
          <VintageCar leftPercent={carLeft} />

          {/* App tagline — left-aligned, fills the gap */}
          <h2 className="font-headline text-lg sm:text-xl font-bold uppercase tracking-wider mb-6">
            <span style={{ WebkitTextStroke: '1px #f5ce53', color: 'transparent', paintOrder: 'stroke fill' }}>UAE&apos;s #1</span>{' '}
            <span className="text-primary">Theory Test</span>{' '}
            <span className="text-secondary">Platform</span>
          </h2>

          {/* Section heading flies in */}
          <motion.div
            className="flex items-center gap-3 mb-4"
            initial={{ opacity: 0, x: -40 }}
            animate={vehicleInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, ease: [0.175, 0.885, 0.32, 1.275] }}
          >
            <h3 className="font-headline text-xl font-bold text-primary uppercase tracking-wider">Choose Your Vehicle</h3>
            <div className="flex-1 h-0.5 bg-surface-container-highest" />
          </motion.div>

          {/* Cards fly in staggered from below */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {VEHICLE_CATEGORIES.map((category, idx) => {
              const completed = getVehicleProgress(category.type)
              return (
                <motion.div
                  key={category.type}
                  initial={{ opacity: 0, y: 60, scale: 0.95 }}
                  animate={vehicleInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{
                    duration: 0.5,
                    delay: 0.15 + idx * 0.1,
                    ease: [0.175, 0.885, 0.32, 1.275],
                  }}
                >
                  <CategoryCard
                    category={category}
                    completedModules={completed}
                    status={category.type === 'F' ? 'coming_soon' : completed >= 7 ? 'completed' : completed > 0 ? 'active' : 'new'}
                    index={idx}
                  />
                </motion.div>
              )
            })}
          </div>

          {/* Daily challenge flies in */}
          <motion.div
            ref={dailyChallengeRef}
            initial={{ opacity: 0, y: 40 }}
            animate={dailyInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.175, 0.885, 0.32, 1.275] }}
          >
            <NeoCard level={1} shadow="secondary" className="mt-8">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-secondary/20 border-2 border-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary" style={{ fontSize: 24 }}>local_fire_department</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-headline text-base font-bold text-secondary">Daily Challenge</h4>
                  <p className="text-sm text-on-surface-variant">Answer {dailyTarget} questions today to maintain your streak</p>
                </div>
                <div className="font-headline text-2xl font-bold text-secondary">
                  {Math.min(dailyDone, dailyTarget)}/{dailyTarget}
                </div>
              </div>
            </NeoCard>
          </motion.div>
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
