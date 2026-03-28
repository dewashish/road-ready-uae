'use client'

import { clsx } from 'clsx'

interface ProgressBarProps {
  value: number
  max?: number
  color?: 'secondary' | 'tertiary' | 'success' | 'error'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

const colorStyles = {
  secondary: 'bg-secondary',
  tertiary: 'bg-tertiary',
  success: 'bg-success',
  error: 'bg-error',
}

const sizeStyles = {
  sm: 'h-2',
  md: 'h-4',
  lg: 'h-6',
}

export function ProgressBar({
  value,
  max = 100,
  color = 'tertiary',
  size = 'md',
  showLabel = false,
  className,
}: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className={clsx('w-full', className)}>
      <div
        className={clsx(
          'w-full bg-surface-container-highest border-2 border-surface-container-lowest overflow-hidden',
          sizeStyles[size]
        )}
        role="progressbar"
        aria-valuenow={Math.round(percent)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={clsx(
            'h-full transition-all duration-500 ease-out progress-3d animate-fill',
            colorStyles[color]
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1">
          <span className="text-xs font-label text-on-surface-variant uppercase tracking-wider">
            {value}/{max}
          </span>
          <span className="text-xs font-label text-tertiary font-bold">
            {Math.round(percent)}%
          </span>
        </div>
      )}
    </div>
  )
}
