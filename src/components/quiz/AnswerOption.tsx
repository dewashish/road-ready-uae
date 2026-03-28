'use client'

import { clsx } from 'clsx'
import type { Answer } from '@/types/quiz'

interface AnswerOptionProps {
  answer: Answer
  label: string
  isSelected: boolean
  isAnswered: boolean
  isCorrect: boolean
  onClick: () => void
}

export function AnswerOption({
  answer,
  label,
  isSelected,
  isAnswered,
  isCorrect,
  onClick,
}: AnswerOptionProps) {
  const getStyles = () => {
    if (!isAnswered) {
      return isSelected
        ? 'bg-surface-container-highest border-secondary text-primary neo-shadow-secondary'
        : 'bg-surface-container border-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high neo-shadow'
    }
    if (isCorrect) {
      return 'bg-success/10 border-success text-success neo-shadow-tertiary'
    }
    if (isSelected && !isCorrect) {
      return 'bg-error/10 border-error text-error animate-shake'
    }
    return 'bg-surface-container border-surface-container-lowest text-outline opacity-60'
  }

  return (
    <button
      onClick={onClick}
      disabled={isAnswered}
      className={clsx(
        'w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border-2 text-start transition-all duration-150 neo-push',
        getStyles()
      )}
    >
      <span
        className={clsx(
          'flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center border-2 font-headline text-xs sm:text-sm font-bold',
          isAnswered && isCorrect
            ? 'bg-success border-success text-surface'
            : isAnswered && isSelected && !isCorrect
              ? 'bg-error border-error text-surface'
              : isSelected
                ? 'bg-secondary border-secondary text-on-secondary'
                : 'bg-surface-container-lowest border-surface-container-lowest text-on-surface-variant'
        )}
      >
        {isAnswered && isCorrect ? (
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>check</span>
        ) : isAnswered && isSelected && !isCorrect ? (
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
        ) : (
          label
        )}
      </span>
      <span className="font-body text-sm sm:text-base leading-snug">
        {answer.answer_text}
      </span>
    </button>
  )
}
