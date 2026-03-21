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

const statusConfig = {
  new: { label: 'NEW', bg: 'bg-tertiary/20', text: 'text-tertiary', border: 'border-tertiary' },
  active: { label: 'IN PROGRESS', bg: 'bg-secondary/20', text: 'text-secondary', border: 'border-secondary' },
  completed: { label: 'COMPLETE', bg: 'bg-success/20', text: 'text-success', border: 'border-success' },
}

export function CategoryCard({
  category,
  totalModules = 7,
  completedModules = 0,
  status = 'new',
}: CategoryCardProps) {
  const percent = Math.round((completedModules / totalModules) * 100)
  const badge = statusConfig[status]
  const ctaLabel = status === 'completed' ? 'Review' : status === 'active' ? 'Continue' : 'Start Module'

  return (
    <Link href={`/quiz/${category.type}`}>
      <NeoCard
        level={2}
        shadow="default"
        className="neo-hover cursor-pointer group h-full !p-6"
      >
        {/* Top: icon + badge */}
        <div className="flex items-start justify-between mb-5">
          <div className="w-14 h-14 bg-surface-container-lowest border-2 border-surface-container-lowest flex items-center justify-center group-hover:border-secondary transition-colors">
            <span
              className="material-symbols-outlined text-secondary"
              style={{ fontSize: 28 }}
            >
              {category.icon}
            </span>
          </div>
          <span className={`inline-block px-2.5 py-0.5 font-label text-[10px] font-bold uppercase tracking-widest ${badge.bg} ${badge.text} border ${badge.border}`}>
            {badge.label}
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

        {/* Progress bar (thicker, yellow when active) */}
        <div className="mb-5">
          <div className="flex items-center gap-3">
            <ProgressBar
              value={completedModules}
              max={totalModules}
              color={status === 'completed' ? 'success' : 'secondary'}
              size="md"
              className="flex-1"
            />
            <span className="font-label text-xs text-on-surface-variant font-bold whitespace-nowrap min-w-[32px] text-right">
              {percent}%
            </span>
          </div>
        </div>

        {/* CTA — 3D raised button with hard shadow */}
        <div
          className="neo-push bg-primary text-surface-container-lowest border-2 border-surface-container-lowest neo-shadow font-headline font-bold py-3.5 text-center uppercase tracking-widest text-sm select-none"
        >
          {ctaLabel}
        </div>
      </NeoCard>
    </Link>
  )
}
