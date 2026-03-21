import Link from 'next/link'
import { NeoCard } from '@/components/ui/NeoCard'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import type { VehicleCategory } from '@/types/quiz'

interface CategoryCardProps {
  category: VehicleCategory
  progress?: number
  totalModules?: number
  completedModules?: number
  status?: 'new' | 'active' | 'completed'
}

export function CategoryCard({
  category,
  totalModules = 7,
  completedModules = 0,
  status = 'new',
}: CategoryCardProps) {
  const statusBadge = {
    new: { variant: 'info' as const, label: 'New' },
    active: { variant: 'warning' as const, label: 'In Progress' },
    completed: { variant: 'success' as const, label: 'Complete' },
  }

  const percent = Math.round((completedModules / totalModules) * 100)

  return (
    <Link href={`/quiz/${category.type}`}>
      <NeoCard
        level={2}
        shadow="default"
        className="neo-hover cursor-pointer group h-full"
      >
        {/* Top row: icon + badge */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-14 h-14 bg-surface-container-lowest border-2 border-surface-container-lowest flex items-center justify-center group-hover:bg-secondary/10 transition-colors">
            <span
              className="material-symbols-outlined text-secondary"
              style={{ fontSize: 28 }}
            >
              {category.icon}
            </span>
          </div>
          <Badge variant={statusBadge[status].variant}>
            {statusBadge[status].label}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="font-headline text-lg font-bold text-primary uppercase tracking-wider mb-1">
          {category.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-on-surface-variant mb-4">
          {category.description}
        </p>

        {/* Progress */}
        <div className="flex items-center gap-3 mb-4">
          <ProgressBar
            value={completedModules}
            max={totalModules}
            color={status === 'completed' ? 'success' : 'secondary'}
            size="sm"
            className="flex-1"
          />
          <span className="font-label text-xs text-on-surface-variant font-bold whitespace-nowrap">
            {percent}%
          </span>
        </div>

        {/* CTA Button */}
        <div className="neo-push bg-primary text-on-primary-container border-2 border-surface-container-lowest neo-shadow font-headline font-bold px-6 py-3 text-center uppercase tracking-wider text-sm">
          {status === 'completed' ? 'Review' : status === 'active' ? 'Continue' : 'Start Module'}
        </div>
      </NeoCard>
    </Link>
  )
}
