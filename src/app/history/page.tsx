'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { BottomNav } from '@/components/layout/BottomNav'
import { NeoCard } from '@/components/ui/NeoCard'
import { Badge } from '@/components/ui/Badge'
import { useProgress } from '@/context/ProgressContext'
import type { QuizSessionRecord } from '@/context/ProgressContext'

export default function HistoryPage() {
  const { getQuizHistory } = useProgress()
  const history = getQuizHistory()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <div className="min-h-dvh bg-background pb-20 sm:pb-0">
      <Header title="History" />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <h2 className="font-headline text-3xl font-bold text-primary mb-6">
          Quiz <span className="text-secondary">History</span>
        </h2>

        {history.length === 0 ? (
          <NeoCard level={1} shadow="none" className="text-center !py-16">
            <span className="material-symbols-outlined text-outline" style={{ fontSize: 48 }}>
              history
            </span>
            <h3 className="mt-4 font-headline text-lg font-bold text-primary">No History Yet</h3>
            <p className="mt-2 text-on-surface-variant">
              Complete a quiz to see your attempt history here.
            </p>
          </NeoCard>
        ) : (
          <div className="space-y-3">
            {history.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                isExpanded={expandedId === session.id}
                onToggle={() =>
                  setExpandedId(expandedId === session.id ? null : session.id)
                }
              />
            ))}
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  )
}

function SessionCard({
  session,
  isExpanded,
  onToggle,
}: {
  session: QuizSessionRecord
  isExpanded: boolean
  onToggle: () => void
}) {
  const wrongAnswers = session.answers.filter((a) => !a.isCorrect)
  const date = new Date(session.completedAt)
  const dateStr = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <NeoCard
      level={2}
      shadow={isExpanded ? 'secondary' : 'default'}
      className="cursor-pointer"
      onClick={onToggle}
    >
      <div className="flex items-center gap-4">
        <div
          className={`flex-shrink-0 w-12 h-12 border-2 flex items-center justify-center ${
            session.passed
              ? 'bg-success/10 border-success'
              : 'bg-error/10 border-error'
          }`}
        >
          <span
            className={`material-symbols-outlined ${
              session.passed ? 'text-success' : 'text-error'
            }`}
            style={{ fontSize: 24 }}
          >
            {session.passed ? 'check_circle' : 'cancel'}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-headline text-sm font-bold text-primary truncate">
              {session.moduleTitle}
            </h3>
            <Badge variant={session.passed ? 'success' : 'error'}>
              {session.percent}%
            </Badge>
          </div>
          <div className="flex items-center gap-3 text-xs text-on-surface-variant">
            <span>{dateStr}</span>
            <span>
              {session.score}/{session.total} correct
            </span>
            <span className="text-secondary">+{session.xpEarned} XP</span>
          </div>
        </div>
        <span
          className="material-symbols-outlined text-on-surface-variant"
          style={{ fontSize: 20 }}
        >
          {isExpanded ? 'expand_less' : 'expand_more'}
        </span>
      </div>

      {isExpanded && wrongAnswers.length > 0 && (
        <div className="mt-4 pt-4 border-t-2 border-surface-container-lowest">
          <p className="font-label text-xs font-bold text-error uppercase tracking-wider mb-3">
            Wrong Answers ({wrongAnswers.length})
          </p>
          <div className="space-y-3">
            {wrongAnswers.map((answer, idx) => (
              <div
                key={idx}
                className="bg-surface-container-lowest p-3 border-l-4 border-l-error"
              >
                <p className="font-body text-sm text-primary mb-2">
                  {answer.questionText}
                </p>
                {answer.selectedAnswerText !== '(Skipped)' && (
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="material-symbols-outlined text-error"
                      style={{ fontSize: 14 }}
                    >
                      close
                    </span>
                    <span className="text-xs text-error line-through">
                      {answer.selectedAnswerText}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span
                    className="material-symbols-outlined text-success"
                    style={{ fontSize: 14 }}
                  >
                    check
                  </span>
                  <span className="text-xs text-success font-semibold">
                    {answer.correctAnswerText}
                  </span>
                </div>
                {answer.explanation && (
                  <p className="mt-2 text-xs text-on-surface-variant italic">
                    {answer.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {isExpanded && wrongAnswers.length === 0 && (
        <div className="mt-4 pt-4 border-t-2 border-surface-container-lowest text-center">
          <span className="material-symbols-outlined text-success" style={{ fontSize: 32 }}>
            celebration
          </span>
          <p className="text-sm text-success font-bold mt-1">Perfect score! No wrong answers.</p>
        </div>
      )}
    </NeoCard>
  )
}
