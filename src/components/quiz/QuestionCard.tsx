'use client'

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
  /** In exam mode: no explanation, no correct/wrong feedback */
  examMode?: boolean
  /** Flag for review (exam mode only) */
  isFlagged?: boolean
  onToggleFlag?: () => void
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswerId,
  isAnswered,
  onSelectAnswer,
  examMode,
  isFlagged,
  onToggleFlag,
}: QuestionCardProps) {
  const dict = useDictionary()
  const correctAnswerId = question.answers.find((a) => a.is_correct)?.id
  const Illustration = question.svg_illustration_key
    ? getQuestionIllustration(question.svg_illustration_key)
    : null

  return (
    <div className={examMode ? undefined : 'animate-slide-in'}>
      <NeoCard level={2} shadow="default" className="mb-6 relative overflow-hidden">
        {/* Exam mode: cyan top stripe */}
        {examMode && <div className="absolute top-0 left-0 w-full h-1.5 bg-tertiary" />}

        {/* Question Header */}
        <div className="flex items-center gap-3 mb-4">
          {examMode ? (
            <span className="font-headline font-bold text-xs uppercase tracking-widest bg-surface-container-lowest px-3 py-1 border border-outline-variant text-tertiary">
              Q{questionNumber} · {question.module.replaceAll('_', ' ')}
            </span>
          ) : (
            <span className="font-label text-xs font-bold text-on-surface-variant uppercase tracking-widest">
              {dict.quiz.questionOf.replace('{current}', String(questionNumber)).replace('{total}', String(totalQuestions))}
            </span>
          )}
          <div className="flex-1" />
          {/* Exam mode: flag button inside header */}
          {examMode && onToggleFlag && (
            <button
              onClick={onToggleFlag}
              className={`flex items-center gap-1.5 px-3 py-1 font-headline text-xs font-bold uppercase tracking-wider transition-none active:translate-x-[1px] active:translate-y-[1px] ${
                isFlagged
                  ? 'text-secondary bg-secondary/10'
                  : 'text-on-surface-variant hover:text-secondary'
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 16, fontVariationSettings: isFlagged ? '"FILL" 1' : '"FILL" 0' }}
              >
                flag
              </span>
              {isFlagged ? 'Flagged' : 'Flag for Review'}
            </button>
          )}
          {!examMode && question.is_edcad_style && (
            <span className="inline-flex items-center gap-1 bg-tertiary/10 px-2 py-0.5 font-label text-[10px] font-bold text-tertiary uppercase tracking-wider">
              <span className="material-symbols-outlined" style={{ fontSize: 12 }}>verified</span>
              {dict.quiz.edcad}
            </span>
          )}
          {!examMode && question.source === 'rta' && (
            <span className="inline-flex items-center gap-1 bg-secondary/10 px-2 py-0.5 font-label text-[10px] font-bold text-secondary uppercase tracking-wider">
              <span className="material-symbols-outlined" style={{ fontSize: 12 }}>shield</span>
              RTA
            </span>
          )}
          {!examMode && (
            <span className="font-label text-xs text-outline uppercase tracking-wider">
              {question.module.replaceAll('_', ' ')}
            </span>
          )}
        </div>

        {/* Illustration (SVG or raster image) */}
        {Illustration ? (
          <div className="mb-5 flex justify-center">
            <div className="w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 bg-surface-container-lowest border-2 border-surface-container-lowest flex items-center justify-center p-4">
              <Illustration />
            </div>
          </div>
        ) : question.image_url ? (
          <div className="mb-5 flex justify-center">
            <div className="w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 bg-white border-2 border-surface-container-lowest flex items-center justify-center overflow-hidden p-2">
              <img
                src={question.image_url}
                alt="Question illustration"
                className="w-full h-full object-contain"
                loading="eager"
              />
            </div>
          </div>
        ) : null}

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
                isAnswered={examMode ? false : isAnswered}
                isCorrect={answer.id === correctAnswerId}
                onClick={() => onSelectAnswer(answer.id)}
                examMode={examMode}
              />
            ))}
        </div>

        {/* Explanation (shown after answering — hidden in exam mode) */}
        {!examMode && isAnswered && question.explanation && (
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
