import Link from 'next/link'
import { NeoCard } from '@/components/ui/NeoCard'
import { ProgressBar } from '@/components/ui/ProgressBar'
import type { VehicleCategory } from '@/types/quiz'

export type CardStatus = 'new' | 'active' | 'completed' | 'coming_soon'

interface CategoryCardProps {
  category: VehicleCategory
  progress?: number
  totalModules?: number
  completedModules?: number
  status?: CardStatus
  index?: number
}

/*
 * NeoPOP / CRED style — light from upper-left, hard shadow offset bottom-right.
 *
 * Alternation by card index:
 *   Even (0, 2, 4…) → yellow button shadow, yellow badge, cyan progress bar
 *   Odd  (1, 3, 5…) → cyan button shadow,   cyan badge,   yellow progress bar
 *
 * Badge color = same as button shadow color (alternates together).
 * Progress bar color = opposite of button shadow.
 *
 * COMPLETED: everything yellow.
 * COMING_SOON: greyed out, no shadow, unavailable.
 */

const SHADOW_YELLOW = '4px 4px 0px 0px #f5ce53'
const SHADOW_CYAN = '4px 4px 0px 0px #81ecff'

const ctaLabels: Record<CardStatus, string> = {
  new: 'Start Module',
  active: 'Continue',
  completed: 'Review',
  coming_soon: 'Unavailable',
}

const badgeLabels: Record<CardStatus, string> = {
  new: 'NEW',
  active: 'IN PROGRESS',
  completed: 'COMPLETED',
  coming_soon: 'COMING SOON',
}

export function CategoryCard({
  category,
  totalModules = 7,
  completedModules = 0,
  status = 'new',
  index = 0,
}: CategoryCardProps) {
  const percent = Math.round((completedModules / totalModules) * 100)
  const isComingSoon = status === 'coming_soon'
  const isCompleted = status === 'completed'
  const isEven = index % 2 === 0

  // Determine accent colors based on alternation
  // Badge + button shadow share the same color; progress bar is the opposite
  const buttonShadow = isComingSoon
    ? 'none'
    : isCompleted
      ? SHADOW_YELLOW
      : isEven ? SHADOW_YELLOW : SHADOW_CYAN

  const badgeStyle = isComingSoon
    ? 'bg-surface-container-highest text-outline'
    : isCompleted
      ? 'bg-secondary text-on-secondary'
      : isEven ? 'bg-secondary text-on-secondary' : 'bg-tertiary text-on-tertiary'

  const progressColor: 'secondary' | 'tertiary' = isCompleted
    ? 'secondary'
    : isEven ? 'tertiary' : 'secondary'

  const card = (
    <NeoCard
      level={isComingSoon ? 1 : 2}
      shadow={isComingSoon ? 'none' : 'default'}
      className={`group h-full !p-6 flex flex-col ${isComingSoon ? 'opacity-40' : 'neo-hover cursor-pointer'}`}
    >
      {/* Top: icon + badge */}
      <div className="flex items-start justify-between mb-5">
        <div className={`w-14 h-14 border-2 flex items-center justify-center transition-colors ${
          isComingSoon
            ? 'bg-surface-container-lowest border-surface-container-lowest'
            : 'bg-surface-container-lowest border-surface-container-lowest group-hover:bg-secondary'
        }`}>
          <span
            className={`material-symbols-outlined transition-colors ${
              isComingSoon ? 'text-outline' : 'text-secondary group-hover:text-surface-container-lowest'
            }`}
            style={{ fontSize: 28 }}
          >
            {category.icon}
          </span>
        </div>
        <span className={`inline-block px-2.5 py-0.5 font-label text-[10px] font-bold uppercase tracking-widest ${badgeStyle}`}>
          {badgeLabels[status]}
        </span>
      </div>

      {/* Title */}
      <h3 className={`font-headline text-lg font-bold uppercase tracking-wider mb-1.5 ${
        isComingSoon ? 'text-outline' : 'text-primary'
      }`}>
        {category.name}
      </h3>

      {/* Description */}
      <p className={`text-sm leading-relaxed mb-5 ${
        isComingSoon ? 'text-outline' : 'text-on-surface-variant'
      }`}>
        {category.description}
      </p>

      {/* Spacer to push CTA to bottom */}
      <div className="flex-1" />

      {/* Progress bar — always render the space, hide content for coming_soon */}
      <div className="mb-5">
        {isComingSoon ? (
          <div className="h-[24px]" />
        ) : (
          <div className="flex items-center gap-3">
            <ProgressBar
              value={completedModules}
              max={totalModules}
              color={progressColor}
              size="md"
              className="flex-1"
            />
            <span className="font-label text-xs text-on-surface-variant font-bold whitespace-nowrap min-w-[32px] text-right">
              {percent}%
            </span>
          </div>
        )}
      </div>

      {/* CTA */}
      <div
        className={`font-headline font-bold py-3.5 text-center uppercase tracking-widest text-sm select-none border-2 ${
          isComingSoon
            ? 'bg-surface-container-high text-outline border-outline-variant cursor-not-allowed'
            : 'neo-push bg-primary text-surface-container-lowest border-surface-container-lowest'
        }`}
        style={{ boxShadow: buttonShadow }}
      >
        {ctaLabels[status]}
      </div>
    </NeoCard>
  )

  if (isComingSoon) {
    return <div className="h-full">{card}</div>
  }

  return (
    <Link href={`/quiz/${category.type}`} className="h-full">
      {card}
    </Link>
  )
}
