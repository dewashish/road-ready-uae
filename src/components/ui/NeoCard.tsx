import { clsx } from 'clsx'
import { type HTMLAttributes } from 'react'

interface NeoCardProps extends HTMLAttributes<HTMLDivElement> {
  level?: 1 | 2 | 3
  shadow?: 'default' | 'secondary' | 'tertiary' | 'none'
}

const levelStyles = {
  1: 'bg-surface-container',
  2: 'bg-surface-container-high',
  3: 'bg-surface-bright',
}

const shadowStyles = {
  default: 'neo-shadow',
  secondary: 'neo-shadow-secondary',
  tertiary: 'neo-shadow-tertiary',
  none: '',
}

export function NeoCard({
  level = 2,
  shadow = 'default',
  className,
  children,
  ...props
}: NeoCardProps) {
  return (
    <div
      className={clsx(
        'border-2 border-surface-container-lowest p-5',
        levelStyles[level],
        shadowStyles[shadow],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
