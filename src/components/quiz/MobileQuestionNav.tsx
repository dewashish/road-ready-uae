'use client'

import { useState, useRef, useEffect } from 'react'
import { clsx } from 'clsx'
import { QuestionGrid } from './QuestionGrid'
import type { QuestionStatus } from '@/hooks/useMockExam'

interface MobileQuestionNavProps {
  questionStatuses: Array<{ index: number; questionId: string; status: QuestionStatus }>
  currentIndex: number
  onNavigate: (index: number) => void
  answeredCount: number
  flaggedCount: number
  unansweredCount: number
}

const dotColors: Record<QuestionStatus, string> = {
  answered: 'bg-success',
  unanswered: 'bg-surface-variant',
  flagged: 'bg-secondary',
}

export function MobileQuestionNav({
  questionStatuses,
  currentIndex,
  onNavigate,
  answeredCount,
  flaggedCount,
  unansweredCount,
}: MobileQuestionNavProps) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const stripRef = useRef<HTMLDivElement>(null)

  // Auto-scroll strip to keep current question visible
  useEffect(() => {
    if (stripRef.current) {
      const dot = stripRef.current.children[currentIndex] as HTMLElement
      dot?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }
  }, [currentIndex])

  const handleNavigate = (index: number) => {
    onNavigate(index)
    setSheetOpen(false)
  }

  return (
    <>
      {/* Compact status strip */}
      <button
        onClick={() => setSheetOpen(true)}
        className="w-full py-2 px-3 bg-surface-container border-b-2 border-surface-container-lowest"
        aria-label="View all questions"
      >
        <div ref={stripRef} className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {questionStatuses.map(({ index, status }) => (
            <span
              key={index}
              className={clsx(
                'flex-shrink-0 transition-all',
                dotColors[status],
                currentIndex === index
                  ? 'w-5 h-3 border border-tertiary'
                  : 'w-2 h-2'
              )}
            />
          ))}
        </div>
      </button>

      {/* Bottom sheet */}
      {sheetOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 z-50"
            onClick={() => setSheetOpen(false)}
          />

          {/* Sheet */}
          <div className="fixed bottom-0 start-0 end-0 z-50 animate-slide-up max-h-[70dvh] overflow-y-auto bg-surface border-t-2 border-surface-container-lowest">
            <div className="sticky top-0 bg-surface flex items-center justify-between px-4 py-3 border-b-2 border-surface-container-lowest">
              <span className="font-label text-sm font-bold uppercase tracking-wider text-primary">
                Questions
              </span>
              <button
                onClick={() => setSheetOpen(false)}
                className="neo-push w-8 h-8 flex items-center justify-center bg-surface-container border-2 border-surface-container-lowest"
                aria-label="Close"
              >
                <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 18 }}>close</span>
              </button>
            </div>
            <div className="p-4">
              <QuestionGrid
                questionStatuses={questionStatuses}
                currentIndex={currentIndex}
                onNavigate={handleNavigate}
                answeredCount={answeredCount}
                flaggedCount={flaggedCount}
                unansweredCount={unansweredCount}
              />
            </div>
          </div>
        </>
      )}
    </>
  )
}
