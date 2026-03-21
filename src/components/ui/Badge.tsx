import { clsx } from 'clsx'

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'locked'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-surface-container-highest text-on-surface-variant',
  success: 'bg-success/20 text-success',
  warning: 'bg-secondary/20 text-secondary',
  error: 'bg-error/20 text-error',
  info: 'bg-tertiary/20 text-tertiary',
  locked: 'bg-surface-container-high text-outline',
}

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 px-3 py-1 font-label text-xs font-bold uppercase tracking-widest border-l-2',
        variantStyles[variant],
        variant === 'success' && 'border-l-success',
        variant === 'warning' && 'border-l-secondary',
        variant === 'error' && 'border-l-error',
        variant === 'info' && 'border-l-tertiary',
        variant === 'locked' && 'border-l-outline',
        variant === 'default' && 'border-l-on-surface-variant',
        className
      )}
    >
      {children}
    </span>
  )
}
