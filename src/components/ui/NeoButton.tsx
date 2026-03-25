'use client'

import { clsx } from 'clsx'
import { type ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'tertiary' | 'ghost'

interface NeoButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: 'sm' | 'md' | 'lg'
  icon?: string
  fullWidth?: boolean
}

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-secondary text-surface-container-lowest border-3 border-surface-container-lowest neo-shadow-chunky font-headline font-bold',
  secondary:
    'bg-secondary text-on-secondary border-2 border-surface-container-lowest neo-shadow-secondary font-headline font-bold',
  tertiary:
    'bg-surface-container-high text-tertiary border-2 border-surface-container-lowest neo-shadow font-headline font-semibold',
  ghost:
    'bg-transparent text-on-surface-variant border-2 border-outline-variant hover:bg-surface-container-high font-body',
}

const sizeStyles = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

export function NeoButton({
  variant = 'primary',
  size = 'md',
  icon,
  fullWidth,
  className,
  children,
  disabled,
  ...props
}: NeoButtonProps) {
  return (
    <button
      className={clsx(
        `${variant === 'primary' ? 'neo-push-chunky' : 'neo-push'} inline-flex items-center justify-center gap-2 uppercase tracking-wider`,
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        disabled && 'opacity-40 pointer-events-none',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {icon && (
        <span className="material-symbols-outlined" style={{ fontSize: size === 'sm' ? 18 : 20 }}>
          {icon}
        </span>
      )}
      {children}
    </button>
  )
}
