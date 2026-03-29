'use client'

import { useState, useEffect, useRef } from 'react'
import { NeoCard } from '@/components/ui/NeoCard'
import { NeoButton } from '@/components/ui/NeoButton'

interface ExamSubmitDialogProps {
  isOpen: boolean
  answeredCount: number
  unansweredCount: number
  flaggedCount: number
  onConfirm: () => void
  onCancel: () => void
}

export function ExamSubmitDialog({
  isOpen,
  answeredCount,
  unansweredCount,
  flaggedCount,
  onConfirm,
  onCancel,
}: ExamSubmitDialogProps) {
  const [step, setStep] = useState<'summary' | 'confirm'>('summary')
  const dialogRef = useRef<HTMLDivElement>(null)

  // Reset step when dialog opens/closes
  useEffect(() => {
    if (isOpen) setStep('summary')
  }, [isOpen])

  // Focus trap and Escape key
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', handleKeyDown)
    dialogRef.current?.focus()
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onCancel])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onCancel} />

      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Submit exam confirmation"
        tabIndex={-1}
        className="relative z-10 w-full max-w-md"
      >
        <NeoCard level={3} shadow="secondary" className="p-6">
          {step === 'summary' ? (
            <>
              {/* Step 1: Summary */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-secondary/20 border-2 border-secondary flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-secondary" style={{ fontSize: 24 }}>
                    assignment_turned_in
                  </span>
                </div>
                <div>
                  <h2 className="font-headline text-xl font-bold text-primary">
                    Review Before Submitting
                  </h2>
                  <p className="font-body text-xs text-on-surface-variant mt-0.5">
                    You cannot change answers after submitting.
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-surface-container border-2 border-surface-container-lowest p-3 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <span className="material-symbols-outlined text-success" style={{ fontSize: 16 }}>check_circle</span>
                  </div>
                  <span className="font-headline text-2xl font-bold text-success">{answeredCount}</span>
                  <p className="font-label text-[10px] uppercase tracking-wider text-on-surface-variant mt-1">Answered</p>
                </div>
                <div className="bg-surface-container border-2 border-surface-container-lowest p-3 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 16 }}>radio_button_unchecked</span>
                  </div>
                  <span className="font-headline text-2xl font-bold text-on-surface-variant">{unansweredCount}</span>
                  <p className="font-label text-[10px] uppercase tracking-wider text-on-surface-variant mt-1">Unanswered</p>
                </div>
                <div className="bg-surface-container border-2 border-surface-container-lowest p-3 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <span className="material-symbols-outlined text-secondary" style={{ fontSize: 16 }}>flag</span>
                  </div>
                  <span className="font-headline text-2xl font-bold text-secondary">{flaggedCount}</span>
                  <p className="font-label text-[10px] uppercase tracking-wider text-on-surface-variant mt-1">Flagged</p>
                </div>
              </div>

              {/* Warning */}
              {unansweredCount > 0 && (
                <div className="bg-error/10 border-2 border-error/30 p-3 mb-6">
                  <p className="font-body text-sm text-error">
                    You have <strong>{unansweredCount}</strong> unanswered question{unansweredCount > 1 ? 's' : ''}. Unanswered questions will be marked as incorrect.
                  </p>
                </div>
              )}

              {flaggedCount > 0 && (
                <div className="bg-secondary/10 border-2 border-secondary/30 p-3 mb-6">
                  <p className="font-body text-sm text-secondary">
                    You have <strong>{flaggedCount}</strong> flagged question{flaggedCount > 1 ? 's' : ''} marked for review.
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <NeoButton variant="ghost" onClick={onCancel} fullWidth icon="arrow_back">
                  Go Back
                </NeoButton>
                <NeoButton variant="tertiary" onClick={() => setStep('confirm')} fullWidth icon="arrow_forward">
                  Continue
                </NeoButton>
              </div>
            </>
          ) : (
            <>
              {/* Step 2: Final confirmation */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-error/10 border-2 border-error mx-auto flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-error" style={{ fontSize: 32 }}>
                    warning
                  </span>
                </div>
                <h2 className="font-headline text-xl font-bold text-primary mb-2">
                  Are you sure?
                </h2>
                <p className="font-body text-sm text-on-surface-variant">
                  This action is final. Your exam will be graded immediately and you cannot go back to change any answers.
                </p>
              </div>

              {/* Actions — destructive action uses danger styling, visually separated */}
              <div className="space-y-3">
                <NeoButton variant="ghost" onClick={() => setStep('summary')} fullWidth icon="arrow_back">
                  Review Again
                </NeoButton>
                <button
                  onClick={onConfirm}
                  className="neo-push w-full flex items-center justify-center gap-2 px-6 py-3 bg-error/10 border-2 border-error text-error font-headline font-bold uppercase tracking-wider text-base neo-shadow"
                  style={{ boxShadow: '4px 4px 0px 0px #ff716c' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>send</span>
                  Submit Final Answers
                </button>
              </div>
            </>
          )}
        </NeoCard>
      </div>
    </div>
  )
}
