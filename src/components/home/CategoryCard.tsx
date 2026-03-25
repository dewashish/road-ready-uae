'use client'

import Link from 'next/link'
import { NeoCard } from '@/components/ui/NeoCard'
import { ProgressBar } from '@/components/ui/ProgressBar'
import type { VehicleCategory } from '@/types/quiz'
import { useDictionary, useLocale } from '@/i18n/DictionaryContext'
import { localePath } from '@/i18n/utils'

export type CardStatus = 'new' | 'active' | 'completed' | 'coming_soon'

interface CategoryCardProps {
  category: VehicleCategory
  progress?: number
  totalModules?: number
  completedModules?: number
  status?: CardStatus
  index?: number
}


export function CategoryCard({
  category,
  totalModules = 7,
  completedModules = 0,
  status = 'new',
  index = 0,
}: CategoryCardProps) {
  const dict = useDictionary()
  const locale = useLocale()
  const percent = Math.round((completedModules / totalModules) * 100)
  const isComingSoon = status === 'coming_soon'
  const isCompleted = status === 'completed'
  const isEven = index % 2 === 0

  const ctaLabels: Record<CardStatus, string> = {
    new: dict.categoryCard.startModule,
    active: dict.categoryCard.continue,
    completed: dict.categoryCard.review,
    coming_soon: dict.categoryCard.unavailable,
  }

  const badgeLabels: Record<CardStatus, string> = {
    new: dict.common.new,
    active: dict.common.inProgress,
    completed: dict.common.completed,
    coming_soon: dict.categoryCard.comingSoon,
  }

  // Get translated vehicle name/description from dictionary
  const vehicleDict = dict.vehicles[category.type as keyof typeof dict.vehicles]
  const vehicleName = vehicleDict?.name ?? category.name
  const vehicleDesc = vehicleDict?.description ?? category.description

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
      className={`group h-full !p-6 flex flex-col ${isComingSoon ? 'opacity-70' : 'neo-hover cursor-pointer'}`}
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
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 font-label text-[10px] font-bold uppercase tracking-widest ${badgeStyle}`}>
          {isComingSoon && <span className="material-symbols-outlined" style={{ fontSize: 12 }}>lock</span>}
          {badgeLabels[status]}
        </span>
      </div>

      {/* Title */}
      <h3 className={`font-headline text-lg font-bold uppercase tracking-wider mb-1.5 ${
        isComingSoon ? 'text-outline' : 'text-primary'
      }`}>
        {vehicleName}
      </h3>

      {/* Description */}
      <p className={`text-sm leading-relaxed mb-5 ${
        isComingSoon ? 'text-outline' : 'text-on-surface-variant'
      }`}>
        {vehicleDesc}
      </p>

      {/* Spacer to push CTA to bottom */}
      <div className="flex-1" />

      {/* Progress bar */}
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
            <span className="font-label text-xs text-on-surface-variant font-bold whitespace-nowrap min-w-[32px] text-end">
              {percent}%
            </span>
          </div>
        )}
      </div>

      {/* CTA */}
      <div
        className={`font-headline font-bold py-3.5 text-center uppercase tracking-widest text-sm select-none border-3 ${
          isComingSoon
            ? 'bg-surface-container-high text-outline border-outline-variant cursor-not-allowed'
            : 'neo-push-chunky neo-shadow-chunky bg-secondary text-surface-container-lowest border-surface-container-lowest'
        }`}
      >
        {ctaLabels[status]}
      </div>
    </NeoCard>
  )

  if (isComingSoon) {
    return <div className="h-full">{card}</div>
  }

  return (
    <Link href={localePath(locale, `/quiz/${category.type}`)} className="h-full">
      {card}
    </Link>
  )
}
