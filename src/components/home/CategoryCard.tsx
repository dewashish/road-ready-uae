import Link from 'next/link'
import { NeoCard } from '@/components/ui/NeoCard'
import { ProgressBar } from '@/components/ui/ProgressBar'
import type { VehicleCategory } from '@/types/quiz'

interface CategoryCardProps {
  category: VehicleCategory
  progress?: number
  totalModules?: number
  completedModules?: number
  status?: 'new' | 'active' | 'completed'
}

/*
 * NeoPOP / CRED style — light from upper-left, hard shadow offset bottom-right.
 *
 * Color alternation:
 *   NEW       → yellow progress bar, cyan shadow on CTA
 *   ACTIVE    → cyan progress bar,   yellow shadow on CTA
 *   COMPLETED → yellow progress bar, yellow shadow on CTA
 */

const statusStyles = {
  new: {
    badge: 'bg-surface-container-highest text-on-surface',
    badgeLabel: 'NEW',
    progressColor: 'secondary' as const,
    buttonShadow: '4px 4px 0px 0px #81ecff',   // cyan
    cta: 'Start Module',
  },
  active: {
    badge: 'bg-tertiary text-on-tertiary',
    badgeLabel: 'ACTIVE',
    progressColor: 'tertiary' as const,
    buttonShadow: '4px 4px 0px 0px #f5ce53',   // yellow
    cta: 'Continue',
  },
  completed: {
    badge: 'bg-secondary text-on-secondary',
    badgeLabel: 'COMPLETED',
    progressColor: 'secondary' as const,
    buttonShadow: '4px 4px 0px 0px #f5ce53',   // yellow
    cta: 'Review',
  },
}

export function CategoryCard({
  category,
  totalModules = 7,
  completedModules = 0,
  status = 'new',
}: CategoryCardProps) {
  const percent = Math.round((completedModules / totalModules) * 100)
  const styles = statusStyles[status]

  return (
    <Link href={`/quiz/${category.type}`}>
      <NeoCard
        level={2}
        shadow="default"
        className="neo-hover cursor-pointer group h-full !p-6"
      >
        {/* Top: icon + badge */}
        <div className="flex items-start justify-between mb-5">
          {/* Icon — inverts on hover: dark bg + yellow icon → yellow bg + dark icon */}
          <div className="w-14 h-14 bg-surface-container-lowest border-2 border-surface-container-lowest flex items-center justify-center transition-colors group-hover:bg-secondary">
            <span
              className="material-symbols-outlined text-secondary transition-colors group-hover:text-surface-container-lowest"
              style={{ fontSize: 28 }}
            >
              {category.icon}
            </span>
          </div>
          <span className={`inline-block px-2.5 py-0.5 font-label text-[10px] font-bold uppercase tracking-widest ${styles.badge}`}>
            {styles.badgeLabel}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-headline text-lg font-bold text-primary uppercase tracking-wider mb-1.5">
          {category.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-on-surface-variant leading-relaxed mb-5">
          {category.description}
        </p>

        {/* Progress bar — alternating color */}
        <div className="mb-5">
          <div className="flex items-center gap-3">
            <ProgressBar
              value={completedModules}
              max={totalModules}
              color={styles.progressColor}
              size="md"
              className="flex-1"
            />
            <span className="font-label text-xs text-on-surface-variant font-bold whitespace-nowrap min-w-[32px] text-right">
              {percent}%
            </span>
          </div>
        </div>

        {/* CTA — NeoPOP raised button: colored hard shadow offset to bottom-right */}
        <div
          className="neo-push bg-primary text-surface-container-lowest border-2 border-surface-container-lowest font-headline font-bold py-3.5 text-center uppercase tracking-widest text-sm select-none"
          style={{ boxShadow: styles.buttonShadow }}
        >
          {styles.cta}
        </div>
      </NeoCard>
    </Link>
  )
}
