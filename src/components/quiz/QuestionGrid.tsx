'use client'

import { clsx } from 'clsx'
import type { QuestionStatus } from '@/hooks/useMockExam'

interface QuestionGridProps {
  questionStatuses: Array<{ index: number; questionId: string; status: QuestionStatus }>
  currentIndex: number
  onNavigate: (index: number) => void
  answeredCount: number
  flaggedCount: number
  unansweredCount: number
  onSubmit?: () => void
}

export function QuestionGrid({
  questionStatuses,
  currentIndex,
  onNavigate,
  answeredCount,
  flaggedCount,
  unansweredCount,
  onSubmit,
}: QuestionGridProps) {
  return (
    <div className="bg-surface-container-high border-2 border-outline-variant p-5" style={{ boxShadow: '4px 4px 0px 0px #000000' }}>
      <div className="mb-5">
        <h3 className="font-headline font-bold text-lg text-secondary uppercase tracking-tight">
          Questions
        </h3>
        <p className="font-headline text-[10px] text-outline font-bold uppercase tracking-[0.2em]">
          Exam Progress
        </p>
      </div>

      <div className="grid grid-cols-5 gap-2 mb-6">
        {questionStatuses.map(({ index, status }) => {
          const isCurrent = currentIndex === index
          const isPastCurrent = index > currentIndex && status === 'unanswered'

          return (
            <button
              key={index}
              onClick={() => onNavigate(index)}
              className={clsx(
                'w-full aspect-square flex items-center justify-center font-headline font-bold text-xs transition-none',
                'active:translate-x-[1px] active:translate-y-[1px]',
                // Current question
                isCurrent && 'bg-surface-container-lowest text-secondary border-2 border-secondary',
                // Answered (green)
                !isCurrent && status === 'answered' && 'bg-success/80 text-surface border border-success',
                // Flagged (gold)
                !isCurrent && status === 'flagged' && 'bg-secondary text-on-secondary border border-surface-container-lowest',
                // Unanswered but already visited (before current)
                !isCurrent && status === 'unanswered' && !isPastCurrent && 'bg-surface-container-lowest text-outline border border-outline-variant',
                // Unanswered and not yet reached (dimmed)
                !isCurrent && isPastCurrent && 'bg-surface-container-lowest border border-outline-variant opacity-40 text-outline',
              )}
            >
              {index + 1}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="space-y-2.5 border-t-2 border-outline-variant pt-5">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-success/80" />
          <span className="text-[10px] font-headline font-bold uppercase tracking-wider text-on-surface-variant">
            {answeredCount} Answered
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-secondary" />
          <span className="text-[10px] font-headline font-bold uppercase tracking-wider text-on-surface-variant">
            {flaggedCount} Flagged
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-surface-container-lowest border border-outline-variant" />
          <span className="text-[10px] font-headline font-bold uppercase tracking-wider text-on-surface-variant">
            {unansweredCount} Remaining
          </span>
        </div>
      </div>

      {/* Submit — subtle, in sidebar */}
      {onSubmit && (
        <button
          onClick={onSubmit}
          className="mt-5 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-surface-container-lowest border-2 border-outline-variant text-on-surface-variant hover:border-secondary hover:text-secondary transition-colors font-headline text-xs font-bold uppercase tracking-wider active:translate-x-[1px] active:translate-y-[1px]"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>send</span>
          Submit Exam
        </button>
      )}
    </div>
  )
}
