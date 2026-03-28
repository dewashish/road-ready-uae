'use client'

import { clsx } from 'clsx'
import { NeoCard } from '@/components/ui/NeoCard'
import { AnswerOption } from './AnswerOption'
import { getQuestionIllustration } from '@/lib/svg'
import type { Question } from '@/types/quiz'
import { useDictionary } from '@/i18n/DictionaryContext'

interface QuestionCardProps {
  question: Question
  questionNumber: number
  totalQuestions: number
  selectedAnswerId: string | null
  isAnswered: boolean
  correctAnswerId?: string
  onSelectAnswer: (answerId: string) => void
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswerId,
  isAnswered,
  onSelectAnswer,
}: QuestionCardProps) {
  const dict = useDictionary()
  const correctAnswerId = question.answers.find((a) => a.is_correct)?.id
  const Illustration = question.svg_illustration_key
    ? getQuestionIllustration(question.svg_illustration_key)
    : null

  return (
    <div className="animate-slide-in">
      <NeoCard level={2} shadow="default" className="mb-6">
        {/* Question Header */}
        <div className="flex items-center gap-3 mb-4">
          <span className="font-label text-xs font-bold text-on-surface-variant uppercase tracking-widest">
            {dict.quiz.questionOf.replace('{current}', String(questionNumber)).replace('{total}', String(totalQuestions))}
          </span>
          <div className="flex-1" />
          {question.is_edcad_style && (
            <span className="inline-flex items-center gap-1 bg-tertiary/10 px-2 py-0.5 font-label text-[10px] font-bold text-tertiary uppercase tracking-wider">
              <span className="material-symbols-outlined" style={{ fontSize: 12 }}>verified</span>
              {dict.quiz.edcad}
            </span>
          )}
          {question.source === 'rta' && (
            <span className="inline-flex items-center gap-1 bg-secondary/10 px-2 py-0.5 font-label text-[10px] font-bold text-secondary uppercase tracking-wider">
              <span className="material-symbols-outlined" style={{ fontSize: 12 }}>shield</span>
              RTA
            </span>
          )}
          <span className="font-label text-xs text-outline uppercase tracking-wider">
            {question.module.replaceAll('_', ' ')}
          </span>
        </div>

        {/* Illustration */}
        {Illustration && (
          <div className="mb-5 flex justify-center">
            <div className="w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 bg-surface-container-lowest border-2 border-surface-container-lowest flex items-center justify-center p-4">
              <Illustration />
            </div>
          </div>
        )}

        {/* Question Text */}
        <h2 className="font-headline text-xl sm:text-2xl font-bold text-primary mb-6 leading-tight">
          {question.question_text}
        </h2>

        {/* Answer Options */}
        <div className="space-y-3">
          {question.answers
            .sort((a, b) => a.display_order - b.display_order)
            .map((answer) => (
              <AnswerOption
                key={answer.id}
                answer={answer}
                label={String.fromCharCode(64 + answer.display_order)}
                isSelected={selectedAnswerId === answer.id}
                isAnswered={isAnswered}
                isCorrect={answer.id === correctAnswerId}
                onClick={() => onSelectAnswer(answer.id)}
              />
            ))}
        </div>

        {/* Explanation (shown after answering) */}
        {isAnswered && question.explanation && (
          <div className="mt-5 p-4 bg-surface-container-lowest border-s-4 border-tertiary">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-tertiary" style={{ fontSize: 18 }}>
                lightbulb
              </span>
              <span className="font-label text-xs font-bold text-tertiary uppercase tracking-wider">
                {dict.quiz.explanation}
              </span>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              {question.explanation}
            </p>
          </div>
        )}
      </NeoCard>
    </div>
  )
}
