import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { BottomNav } from '@/components/layout/BottomNav'
import { NeoCard } from '@/components/ui/NeoCard'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { VEHICLE_CATEGORIES } from '@/types/quiz'

const MODULES = [
  {
    slug: 'road-signs',
    title: 'Traffic Signs',
    description: 'Learn regulatory, warning, and informational signs',
    icon: 'signpost',
    questionCount: 30,
    status: 'available' as const,
    order: 1,
  },
  {
    slug: 'traffic-rules',
    title: 'Road Rules',
    description: 'Speed limits, right of way, lane discipline',
    icon: 'gavel',
    questionCount: 30,
    status: 'locked' as const,
    order: 2,
  },
  {
    slug: 'hazard-perception',
    title: 'Hazard Perception',
    description: 'Identify and respond to dangerous situations',
    icon: 'warning',
    questionCount: 30,
    status: 'locked' as const,
    order: 3,
  },
  {
    slug: 'driving-conditions',
    title: 'Driving Conditions',
    description: 'City, highway, and adverse weather driving',
    icon: 'cloud',
    questionCount: 20,
    status: 'locked' as const,
    order: 4,
  },
  {
    slug: 'critical-situations',
    title: 'Critical Situations',
    description: 'Emergency responses and accident procedures',
    icon: 'emergency',
    questionCount: 20,
    status: 'locked' as const,
    order: 5,
  },
  {
    slug: 'driving-behavior',
    title: 'Safe Driving',
    description: 'Etiquette, courtesy, and defensive driving',
    icon: 'shield',
    questionCount: 20,
    status: 'locked' as const,
    order: 6,
  },
  {
    slug: 'vehicle-maintenance',
    title: 'Vehicle Knowledge',
    description: 'Vehicle systems, maintenance, and safety features',
    icon: 'build',
    questionCount: 15,
    status: 'locked' as const,
    order: 7,
  },
]

export default async function ModulePathPage({
  params,
}: {
  params: Promise<{ vehicleType: string }>
}) {
  const { vehicleType } = await params
  const category = VEHICLE_CATEGORIES.find((c) => c.type === vehicleType)
  const categoryName = category?.name ?? 'Vehicle'

  return (
    <div className="min-h-dvh bg-background pb-20 sm:pb-0">
      <Header showBack backHref="/" title={categoryName} />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Category Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-surface-container-lowest border-2 border-surface-container-lowest flex items-center justify-center">
            <span className="material-symbols-outlined text-secondary" style={{ fontSize: 32 }}>
              {category?.icon ?? 'directions_car'}
            </span>
          </div>
          <div>
            <h2 className="font-headline text-2xl font-bold text-primary">
              {categoryName}
            </h2>
            <p className="text-sm text-on-surface-variant">
              {category?.description}
            </p>
          </div>
        </div>

        {/* Overall Progress */}
        <NeoCard level={1} shadow="none" className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="font-label text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Overall Progress
            </span>
            <span className="font-headline text-sm font-bold text-tertiary">0%</span>
          </div>
          <ProgressBar value={0} max={100} color="tertiary" size="md" />
          <p className="mt-2 text-xs text-outline">
            Complete all modules to unlock the Mock Exam
          </p>
        </NeoCard>

        {/* Module List */}
        <div className="space-y-4">
          {MODULES.map((mod, idx) => {
            const isAvailable = mod.status === 'available' || idx === 0
            const isLocked = !isAvailable

            return (
              <div key={mod.slug} className="relative">
                {/* Connector line */}
                {idx > 0 && (
                  <div className="absolute left-7 -top-4 w-0.5 h-4 bg-surface-container-highest" />
                )}

                {isAvailable ? (
                  <Link href={`/quiz/${vehicleType}/${mod.slug}`}>
                    <NeoCard
                      level={2}
                      shadow="default"
                      className="neo-hover cursor-pointer"
                    >
                      <ModuleContent mod={mod} isLocked={false} />
                    </NeoCard>
                  </Link>
                ) : (
                  <NeoCard level={1} shadow="none" className="opacity-50">
                    <ModuleContent mod={mod} isLocked={true} />
                  </NeoCard>
                )}
              </div>
            )
          })}

          {/* Mock Exam */}
          <div className="relative">
            <div className="absolute left-7 -top-4 w-0.5 h-4 bg-surface-container-highest" />
            <NeoCard level={1} shadow="none" className="opacity-50 border-secondary/30">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-14 h-14 bg-secondary/10 border-2 border-secondary/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary/50" style={{ fontSize: 28 }}>
                    military_tech
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-headline text-base font-bold text-primary/50">
                      Mock Exam
                    </h3>
                    <Badge variant="locked">
                      <span className="material-symbols-outlined" style={{ fontSize: 12 }}>lock</span>
                      Locked
                    </Badge>
                  </div>
                  <p className="text-sm text-outline">
                    45 questions, 30 minutes - just like the real test
                  </p>
                </div>
              </div>
            </NeoCard>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  )
}

function ModuleContent({ mod, isLocked }: { mod: typeof MODULES[0]; isLocked: boolean }) {
  return (
    <div className="flex items-center gap-4">
      <div className={`flex-shrink-0 w-14 h-14 border-2 flex items-center justify-center ${
        isLocked
          ? 'bg-surface-container-lowest border-outline-variant'
          : 'bg-surface-container-lowest border-surface-container-lowest'
      }`}>
        <span
          className={`material-symbols-outlined ${isLocked ? 'text-outline' : 'text-secondary'}`}
          style={{ fontSize: 28 }}
        >
          {isLocked ? 'lock' : mod.icon}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-headline text-base font-bold text-primary">
            {mod.title}
          </h3>
          {!isLocked && (
            <Badge variant="info">Available</Badge>
          )}
        </div>
        <p className="text-sm text-on-surface-variant mb-2">{mod.description}</p>
        <div className="flex items-center gap-2">
          <ProgressBar value={0} max={mod.questionCount} color="tertiary" size="sm" className="flex-1" />
          <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider whitespace-nowrap">
            0/{mod.questionCount}
          </span>
        </div>
      </div>
    </div>
  )
}
