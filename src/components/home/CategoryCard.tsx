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
  progress = 0,
  totalModules = 7,
  completedModules = 0,
  status = 'new',
}: CategoryCardProps) {
  const statusBadge = {
    new: { variant: 'info' as const, label: 'New' },
    active: { variant: 'warning' as const, label: 'In Progress' },
    completed: { variant: 'success' as const, label: 'Complete' },
  }

  return (
    <Link href={`/quiz/${category.type}`}>
      <NeoCard
        level={2}
        shadow="default"
        className="neo-hover cursor-pointer group"
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-14 h-14 bg-surface-container-lowest border-2 border-surface-container-lowest flex items-center justify-center group-hover:bg-secondary/10 transition-colors">
            <span
              className="material-symbols-outlined text-secondary"
              style={{ fontSize: 28 }}
            >
              {category.icon}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <h3 className="font-headline text-base font-bold text-primary truncate">
                {category.name}
              </h3>
              <Badge variant={statusBadge[status].variant}>
                {statusBadge[status].label}
              </Badge>
            </div>
            <p className="text-sm text-on-surface-variant mb-3">
              {category.description}
            </p>
            <ProgressBar
              value={completedModules}
              max={totalModules}
              color="tertiary"
              size="sm"
            />
            <div className="flex items-center justify-between mt-2">
              <span className="font-label text-xs text-on-surface-variant uppercase tracking-wider">
                {completedModules}/{totalModules} Modules
              </span>
              <span className="font-label text-xs text-outline">
                Min age: {category.minAge}
              </span>
            </div>
          </div>
        </div>
      </NeoCard>
    </Link>
  )
}
