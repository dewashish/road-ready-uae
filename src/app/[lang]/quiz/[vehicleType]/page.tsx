'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { BottomNav } from '@/components/layout/BottomNav'
import { useProgress } from '@/context/ProgressContext'
import { VEHICLE_CATEGORIES } from '@/types/quiz'
import { getModuleSeenStats } from '@/lib/questions/modulePools'
import { MOCK_EXAMS, MOCK_EXAM_PASS_PERCENT } from '@/lib/questions/mockExamConfig'
import { useDictionary, useLocale } from '@/i18n/DictionaryContext'
import { localePath } from '@/i18n/utils'

const MODULES = [
  { slug: 'road-signs', icon: 'signpost', xp: 100 },
  { slug: 'traffic-rules', icon: 'gavel', xp: 100 },
  { slug: 'hazard-perception', icon: 'warning', xp: 120 },
  { slug: 'driving-conditions', icon: 'cloud', xp: 80 },
  { slug: 'critical-situations', icon: 'emergency', xp: 120 },
  { slug: 'driving-behavior', icon: 'shield', xp: 80 },
  { slug: 'vehicle-maintenance', icon: 'build', xp: 60 },
]

type ModuleState = 'done' | 'next' | 'not-started'

export default function ModulePathPage() {
  const params = useParams()
  const vehicleType = params.vehicleType as string
  const category = VEHICLE_CATEGORIES.find((c) => c.type === vehicleType)
  const dict = useDictionary()
  const locale = useLocale()

  const vehicleDict = (dict as any).vehicles?.[vehicleType]
  const categoryName = vehicleDict?.name ?? category?.name ?? 'Vehicle'
  const categoryDescription = vehicleDict?.description ?? category?.description

  const { progress, getQuizHistory } = useProgress()
  const history = getQuizHistory()

  // Determine state for each module: done / next / not-started
  let foundNext = false
  const moduleStates: ModuleState[] = MODULES.map((m) => {
    const completions = progress.modules[`${vehicleType}:${m.slug}`]?.completionCount ?? 0
    if (completions > 0) return 'done'
    if (!foundNext) {
      foundNext = true
      return 'next'
    }
    return 'not-started'
  })

  const completedCount = moduleStates.filter((s) => s === 'done').length
  const completionPercent = Math.round((completedCount / MODULES.length) * 100)

  // Total questions seen
  const totalSeenStats = MODULES.reduce(
    (acc, m) => {
      const s = getModuleSeenStats(m.slug, vehicleType, history)
      return { seen: acc.seen + s.seen, total: acc.total + s.total }
    },
    { seen: 0, total: 0 }
  )

  // Mock exam stats
  const mockAttempts = MOCK_EXAMS.reduce(
    (sum, e) => sum + (progress.modules[`${vehicleType}:mock-exam-${e.id}`]?.completionCount ?? 0),
    0
  )
  const mockBest = Math.max(
    0,
    ...MOCK_EXAMS.map((e) => progress.modules[`${vehicleType}:mock-exam-${e.id}`]?.bestPercent ?? 0)
  )

  // Weakest completed module
  const completedModules = MODULES.map((m) => {
    const p = progress.modules[`${vehicleType}:${m.slug}`]
    const modDict = (dict as any).modules?.[m.slug]
    return {
      slug: m.slug,
      title: modDict?.title ?? m.slug,
      bestPercent: p?.bestPercent ?? 0,
      completions: p?.completionCount ?? 0,
    }
  }).filter((m) => m.completions > 0)
  const weakest =
    completedModules.length > 0
      ? completedModules.reduce((a, b) => (a.bestPercent < b.bestPercent ? a : b))
      : null

  return (
    <div className="min-h-dvh bg-background pb-24 sm:pb-0">
      <Header showBack backHref="/" title={categoryName} />

      <main className="max-w-[1280px] mx-auto w-full px-4 sm:px-8 py-6 sm:py-12 flex flex-col md:flex-row gap-8 md:gap-12">
        {/* ================================================================
            LEFT COLUMN
            ================================================================ */}
        <div className="w-full md:w-[60%] flex flex-col gap-6 md:gap-8 relative">
          {/* ── Breadcrumb (desktop) ── */}
          <nav className="hidden md:flex items-center gap-2 font-headline uppercase text-xs tracking-widest text-on-surface-variant">
            <Link href={localePath(locale, '/')} className="hover:text-primary cursor-pointer">
              {dict.common.home}
            </Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-secondary">{categoryName}</span>
          </nav>

          {/* ── Vehicle Header (desktop) ── */}
          <div className="hidden md:flex items-start gap-6 p-8 bg-surface-container-low border-2 border-surface-container-highest neo-shadow">
            <div className="w-16 h-16 bg-secondary flex items-center justify-center text-surface-container-lowest">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                {category?.icon ?? 'directions_car'}
              </span>
            </div>
            <div>
              <h1 className="text-4xl font-headline font-black uppercase tracking-tighter text-primary">
                {categoryName}
              </h1>
              <p className="text-on-surface-variant max-w-md mt-2">{categoryDescription}</p>
            </div>
          </div>

          {/* ── Hero Header (mobile) ── */}
          <section className="md:hidden bg-surface-container border-4 border-surface-container-lowest neo-shadow p-6 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-10">
              <span className="material-symbols-outlined text-[120px]">{category?.icon ?? 'directions_car'}</span>
            </div>
            <div className="space-y-1 relative z-10">
              <h2 className="font-headline font-black text-3xl tracking-tight text-primary">{categoryName}</h2>
              <p className="font-headline text-on-surface-variant text-sm font-medium">{dict.mockExam.completeAllModules}</p>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-6">
              <div className="bg-surface-container-low border-2 border-surface-container-lowest p-2 text-center">
                <p className="font-label text-[10px] uppercase text-on-surface-variant font-bold">{dict.common.xp}</p>
                <p className="font-headline font-black text-secondary">{progress.totalXp} XP</p>
              </div>
              <div className="bg-surface-container-low border-2 border-surface-container-lowest p-2 text-center">
                <p className="font-label text-[10px] uppercase text-on-surface-variant font-bold">{dict.progressPage.dayStreak}</p>
                <p className="font-headline font-black text-tertiary">{progress.currentStreak} {dict.common.dayStreak}</p>
              </div>
              <div className="bg-surface-container-low border-2 border-surface-container-lowest p-2 text-center">
                <p className="font-label text-[10px] uppercase text-on-surface-variant font-bold">{dict.progressPage.moduleMastery}</p>
                <p className="font-headline font-black text-primary">{completedCount}/{MODULES.length}</p>
              </div>
            </div>
            <div className="mt-6 space-y-2">
              <div className="flex justify-between items-end font-label text-[11px] font-bold uppercase tracking-widest">
                <span>{dict.quiz.complete.replace('{percent}', '')}</span>
                <span className="text-tertiary">{completionPercent}%</span>
              </div>
              <div className="h-6 w-full bg-surface-container-highest border-2 border-surface-container-lowest relative overflow-hidden">
                <div className="h-full bg-tertiary progress-3d-lip border-r-2 border-surface-container-lowest animate-fill" style={{ width: `${completionPercent}%` }} />
              </div>
            </div>
          </section>

          {/* ── Mock Exam Banner (mobile) ── */}
          <Link href={localePath(locale, `/quiz/${vehicleType}/mock-exam`)} className="md:hidden">
            <section className="bg-surface-container-high border-4 border-secondary neo-shadow-lg p-5 flex items-center gap-4 neo-hover cursor-pointer">
              <div className="bg-secondary p-3 border-2 border-surface-container-lowest flex items-center justify-center">
                <span className="material-symbols-outlined text-surface-container-lowest text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
              </div>
              <div className="flex-1">
                <h3 className="font-headline font-black text-xl text-secondary uppercase italic tracking-tighter">{dict.mockExam.title}</h3>
                <p className="font-body text-xs text-on-surface-variant font-semibold">{dict.mockExam.mockExamsInfo}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="bg-success text-white font-label text-[10px] font-black px-2 py-1 border-2 border-surface-container-lowest uppercase">
                  {dict.quiz.bestScore.replace('{percent}', String(mockBest))}
                </span>
                <span className="material-symbols-outlined text-secondary icon-directional">arrow_forward</span>
              </div>
            </section>
          </Link>

          {/* ================================================================
              MODULE LIST
              ================================================================ */}

          {/* Mobile modules */}
          <div className="md:hidden space-y-0 relative">
            <div className="absolute left-[26px] top-8 bottom-8 w-1 bg-surface-container-highest z-0" />
            {MODULES.map((mod, idx) => (
              <MobileModuleCard key={mod.slug} mod={mod} idx={idx} state={moduleStates[idx]} vehicleType={vehicleType} progress={progress} history={history} dict={dict} locale={locale} />
            ))}
          </div>

          {/* Desktop modules */}
          <div className="hidden md:flex md:flex-col md:gap-8 md:mt-4">
            {MODULES.map((mod, idx) => (
              <DesktopModuleCard key={mod.slug} mod={mod} idx={idx} isLast={idx === MODULES.length - 1} state={moduleStates[idx]} vehicleType={vehicleType} progress={progress} history={history} dict={dict} locale={locale} />
            ))}
          </div>
        </div>

        {/* ================================================================
            RIGHT COLUMN — Sticky sidebar (desktop)
            ================================================================ */}
        <aside className="hidden md:flex w-[40%] flex-col gap-6 sticky top-24 h-fit">
          {/* Progress Overview */}
          <div className="bg-surface-container-high border-2 border-primary-dim p-6 neo-shadow">
            <h2 className="font-headline font-black uppercase tracking-tighter text-xl mb-6">{(dict as any).modulePath.progressOverview}</h2>
            <div className="flex items-center gap-8 mb-8">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
                  <circle className="text-surface-container-highest" cx="64" cy="64" r="58" fill="transparent" stroke="currentColor" strokeWidth="12" />
                  <circle className="text-tertiary" cx="64" cy="64" r="58" fill="transparent" stroke="currentColor" strokeWidth="12" strokeDasharray={2 * Math.PI * 58} strokeDashoffset={2 * Math.PI * 58 * (1 - completionPercent / 100)} strokeLinecap="butt" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-headline font-black">{completionPercent}%</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{completedCount} / {MODULES.length} {(dict as any).modulePath.modules}</span>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary flex items-center justify-center neo-shadow">
                    <span className="material-symbols-outlined text-surface-container-lowest" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                  </div>
                  <div>
                    <div className="text-lg font-headline font-black">{progress.totalXp} XP</div>
                    <div className="text-[10px] uppercase font-bold text-on-surface-variant">{(dict as any).modulePath.totalEarned}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-tertiary flex items-center justify-center neo-shadow">
                    <span className="material-symbols-outlined text-surface-container-lowest" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                  </div>
                  <div>
                    <div className="text-lg font-headline font-black">{progress.currentStreak} {dict.common.dayStreak}</div>
                    <div className="text-[10px] uppercase font-bold text-on-surface-variant">{(dict as any).modulePath.consistency}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-surface-container-low border-2 border-surface-container-highest flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-widest">{(dict as any).modulePath.questionsSeen}</span>
              <span className="font-headline font-black text-tertiary">{totalSeenStats.seen} / {totalSeenStats.total}</span>
            </div>
          </div>

          {/* Mock Exam Card (Gold) — ALWAYS shows best score bar */}
          <Link href={localePath(locale, `/quiz/${vehicleType}/mock-exam`)}>
            <div className="bg-secondary p-8 border-2 border-surface-container-lowest neo-shadow relative overflow-hidden neo-hover cursor-pointer">
              <div className="absolute -right-4 -top-4 opacity-10 rotate-12">
                <span className="material-symbols-outlined text-[120px]" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-surface-container-lowest font-black">emoji_events</span>
                  <h2 className="font-headline font-black uppercase tracking-tighter text-2xl text-surface-container-lowest">{dict.mockExam.title}</h2>
                </div>
                <p className="text-surface-container-lowest font-bold text-sm mb-6">{dict.mockExam.mockExamsInfo}</p>
                {/* Best Score bar — always visible */}
                <div className="bg-surface-container-lowest/10 p-4 border border-surface-container-lowest/20 mb-6">
                  <div className="flex justify-between text-xs font-black uppercase text-surface-container-lowest mb-2">
                    <span>{dict.mockExam.bestScore}</span>
                    <span>{mockBest}%</span>
                  </div>
                  <div className="h-3 w-full bg-surface-container-lowest/20 border border-surface-container-lowest/30">
                    <div className="h-full bg-surface-container-lowest" style={{ width: `${mockBest}%` }} />
                  </div>
                  <p className="text-[10px] uppercase font-black text-surface-container-lowest mt-3 opacity-80">
                    45 Questions · 30 Min · {MOCK_EXAM_PASS_PERCENT}% {(dict as any).modulePath.toPass}
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="w-full bg-surface-container-lowest text-secondary py-4 font-headline font-black uppercase tracking-tighter neo-shadow-secondary neo-push text-lg text-center border-2 border-secondary-dim">
                    {(dict as any).modulePath.startMockExam}
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Weekly Performance */}
          <div className="bg-surface-container-high border-2 border-surface-container-highest p-6 neo-shadow">
            <h3 className="font-headline font-black uppercase tracking-tighter text-sm mb-4">{(dict as any).modulePath.weeklyPerformance}</h3>
            <div className="flex items-end justify-between h-24 gap-2 mb-6">
              {MODULES.map((mod) => {
                const p = progress.modules[`${vehicleType}:${mod.slug}`]
                const pct = p?.bestPercent ?? 0
                return (
                  <div
                    key={mod.slug}
                    className={`flex-grow ${pct > 0 ? 'bg-success/30 border-t-4 border-success' : 'bg-surface-container-highest'}`}
                    style={{ height: `${Math.max(pct, 5)}%` }}
                    title={`${(dict as any).modules?.[mod.slug]?.title ?? mod.slug}: ${pct}%`}
                  />
                )
              })}
            </div>
            {weakest && (
              <div className="p-4 bg-error-container/20 border-l-4 border-error text-error">
                <div className="text-[10px] font-black uppercase tracking-widest mb-1">{(dict as any).modulePath.weakestTopic}</div>
                <div className="font-headline font-black uppercase text-sm">{weakest.title}</div>
                <p className="text-xs mt-1 opacity-80">{(dict as any).modulePath.weakestTopicAdvice}</p>
              </div>
            )}
          </div>

          {/* ── Adaptive learning info strip ── */}
          <div className="flex items-start gap-3 p-4 bg-tertiary/5 border-2 border-tertiary/20">
            <span className="material-symbols-outlined text-tertiary text-lg mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              <span className="text-tertiary font-headline font-bold uppercase tracking-wider">{(dict as any).modulePath.adaptiveTitle}</span>{' '}
              {(dict as any).modulePath.adaptiveDesc}
            </p>
          </div>
        </aside>
      </main>

      <BottomNav />
    </div>
  )
}

/* ======================================================================
   MOBILE MODULE CARD — 3 states: done / next / not-started
   ====================================================================== */
function MobileModuleCard({
  mod, idx, state, vehicleType, progress, history, dict, locale,
}: {
  mod: (typeof MODULES)[number]; idx: number; state: ModuleState
  vehicleType: string; progress: any; history: any[]; dict: any; locale: string
}) {
  const modProgress = progress.modules[`${vehicleType}:${mod.slug}`]
  const completions = modProgress?.completionCount ?? 0
  const bestPercent = modProgress?.bestPercent ?? 0
  const seenStats = getModuleSeenStats(mod.slug, vehicleType, history)
  const modDict = dict.modules?.[mod.slug]
  const modTitle = modDict?.title ?? mod.slug
  const modDescription = modDict?.description ?? ''
  const stepNum = String(idx + 1).padStart(2, '0')

  return (
    <Link href={localePath(locale, `/quiz/${vehicleType}/${mod.slug}`)} className="block">
      <div className={`relative z-10 flex gap-4 pb-8 ${state === 'not-started' ? 'opacity-60' : ''}`}>
        {/* Step number */}
        <div className="flex flex-col items-center">
          {state === 'done' ? (
            <div className="w-14 h-14 bg-surface-container border-4 border-surface-container-lowest flex items-center justify-center font-headline font-black text-lg text-tertiary neo-shadow">
              {stepNum}
            </div>
          ) : state === 'next' ? (
            <div className="w-14 h-14 bg-surface-container border-4 border-tertiary flex items-center justify-center font-headline font-black text-lg text-tertiary neo-shadow-lg">
              {stepNum}
            </div>
          ) : (
            <div className="w-14 h-14 bg-surface-container border-2 border-surface-container-highest flex items-center justify-center font-headline font-black text-lg text-on-surface-variant">
              {stepNum}
            </div>
          )}
        </div>

        {/* Card */}
        {state === 'done' ? (
          /* ── DONE card ── */
          <div className="flex-1 bg-surface-container-high border-2 border-surface-container-lowest border-l-[8px] border-l-success neo-shadow p-4 neo-hover cursor-pointer">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className="font-headline font-bold text-primary">{modTitle}</h4>
                  <span className="bg-success/20 text-success font-label font-black text-[9px] px-1.5 py-0.5 border border-success/30 uppercase">
                    {dict.quiz.timesDone.replace('{count}', String(completions))}
                  </span>
                </div>
                <p className="text-[11px] text-on-surface-variant font-medium leading-tight">{modDescription}</p>
              </div>
              <div className="text-right">
                <span className="text-primary font-headline font-black text-sm">{bestPercent}%</span>
              </div>
            </div>
            <div className="mt-4 space-y-1">
              <div className="h-2 bg-surface-container-lowest border border-surface-container-lowest">
                <div className="h-full bg-tertiary animate-fill" style={{ width: `${bestPercent}%` }} />
              </div>
              <div className="flex justify-between font-label text-[9px] uppercase font-bold">
                <span className="text-on-surface-variant">
                  {dict.quiz.questionsSeen.replace('{seen}', String(seenStats.seen)).replace('{total}', String(seenStats.total)).replace('{percent}', String(seenStats.percent))}
                </span>
                <span className="text-success">✓ {mod.xp * completions} {(dict as any).modulePath.xpEarned}</span>
              </div>
            </div>
          </div>
        ) : state === 'next' ? (
          /* ── NEXT (active) card — cyan ring, larger, "Start" badge ── */
          <div className="flex-1 bg-surface-container-high border-4 border-surface-container-lowest neo-shadow-lg p-4 ring-2 ring-tertiary ring-offset-2 ring-offset-background neo-hover cursor-pointer transition-all">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-headline font-black text-primary text-lg uppercase tracking-tight">{modTitle}</h4>
                <p className="text-[11px] text-on-surface-variant font-medium leading-tight">{modDescription}</p>
              </div>
              <div className="text-right">
                <span className="bg-tertiary text-surface-container-lowest font-label font-black text-[10px] px-2 py-0.5 border border-surface-container-lowest uppercase block">
                  {dict.common.start}
                </span>
                <span className="text-on-surface-variant font-headline font-black text-sm">--%</span>
              </div>
            </div>
            <div className="mt-4 space-y-1">
              <div className="h-2 bg-surface-container-lowest border border-surface-container-lowest">
                <div className="h-full bg-tertiary" style={{ width: '0%' }} />
              </div>
              <div className="flex justify-between font-label text-[9px] uppercase font-bold">
                <span className="text-on-surface-variant">
                  {dict.quiz.questionsSeen.replace('{seen}', String(seenStats.seen)).replace('{total}', String(seenStats.total)).replace('{percent}', String(seenStats.percent))}
                </span>
                <span className="text-secondary">+{mod.xp} XP</span>
              </div>
            </div>
          </div>
        ) : (
          /* ── NOT STARTED card — muted, no progress bar area ── */
          <div className="flex-1 bg-surface-container border-2 border-surface-container-highest p-4 neo-hover cursor-pointer">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-headline font-bold text-on-surface-variant">{modTitle}</h4>
                <p className="text-[11px] text-on-surface-variant opacity-70">{modDescription}</p>
              </div>
              <span className="bg-tertiary/20 text-tertiary font-label font-black text-[10px] px-2 py-0.5 border border-surface-container-highest uppercase block">
                {dict.common.start}
              </span>
            </div>
          </div>
        )}
      </div>
    </Link>
  )
}

/* ======================================================================
   DESKTOP MODULE CARD — 3 states: done / next / not-started
   ====================================================================== */
function DesktopModuleCard({
  mod, idx, isLast, state, vehicleType, progress, history, dict, locale,
}: {
  mod: (typeof MODULES)[number]; idx: number; isLast: boolean; state: ModuleState
  vehicleType: string; progress: any; history: any[]; dict: any; locale: string
}) {
  const modProgress = progress.modules[`${vehicleType}:${mod.slug}`]
  const completions = modProgress?.completionCount ?? 0
  const bestPercent = modProgress?.bestPercent ?? 0
  const seenStats = getModuleSeenStats(mod.slug, vehicleType, history)
  const modDict = dict.modules?.[mod.slug]
  const modTitle = modDict?.title ?? mod.slug
  const modDescription = modDict?.description ?? ''
  const stepNum = String(idx + 1).padStart(2, '0')

  if (state === 'done') {
    /* ── DONE: green border, green check, green XP badge ── */
    return (
      <Link href={localePath(locale, `/quiz/${vehicleType}/${mod.slug}`)} className="block">
        <div className="relative flex items-center gap-8 group">
          {!isLast && <div className="connecting-line" />}
          <div className="w-16 h-16 z-10 flex items-center justify-center border-4 border-success bg-surface-container-low text-success font-headline font-black text-2xl neo-shadow">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          </div>
          <div className="flex-grow p-6 bg-surface-container-high border-2 border-success neo-shadow neo-shadow-hover transition-all">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-headline text-xs text-on-surface-variant font-bold tracking-widest uppercase">Module {stepNum}</span>
                  <span className="bg-success/20 text-success font-label font-black text-[10px] px-2 py-0.5 border border-success/30 uppercase">
                    {dict.quiz.timesDone.replace('{count}', String(completions))}
                  </span>
                </div>
                <h3 className="text-xl font-headline font-black uppercase tracking-tight text-primary">{modTitle}</h3>
              </div>
              <div className="flex items-center gap-2 bg-success/10 text-success px-3 py-1 text-xs font-bold uppercase tracking-tighter">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> {mod.xp * completions} {(dict as any).modulePath.xpEarned}
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex-grow">
                <div className="flex justify-between text-xs font-headline uppercase mb-1">
                  <span className="text-success">{dict.quiz.bestScore.replace('{percent}', String(bestPercent))}</span>
                  <span className="text-on-surface-variant">{seenStats.seen}/{seenStats.total} {(dict as any).modulePath.seen}</span>
                </div>
                <div className="h-4 w-full bg-surface-container-highest border-2 border-surface-container-lowest relative">
                  <div className="h-full bg-success border-t-2 border-success-dim animate-fill" style={{ width: `${bestPercent}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  if (state === 'next') {
    /* ── NEXT: gold border-4, gold step circle, "Up Next" label, Start Module button ── */
    return (
      <Link href={localePath(locale, `/quiz/${vehicleType}/${mod.slug}`)} className="block">
        <div className="relative flex items-center gap-8 group">
          {!isLast && <div className="connecting-line" />}
          <div className="w-16 h-16 z-10 flex items-center justify-center border-4 border-secondary bg-surface-container-low text-secondary font-headline font-black text-2xl neo-shadow">
            {stepNum}
          </div>
          <div className="flex-grow p-6 bg-surface-container-high border-4 border-secondary neo-shadow neo-shadow-hover transition-all">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-headline text-xs text-secondary font-bold tracking-widest uppercase">{(dict as any).modulePath.upNext}</span>
                <h3 className="text-2xl font-headline font-black uppercase tracking-tight text-primary">{modTitle}</h3>
                <p className="text-sm text-on-surface-variant mt-1">{modDescription}</p>
              </div>
              <div className="bg-secondary text-surface-container-lowest px-6 py-3 font-headline font-black uppercase tracking-tighter flex items-center gap-2 neo-shadow neo-push">
                {(dict as any).modulePath.startModule} <span className="material-symbols-outlined">play_arrow</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs font-headline uppercase mb-1">
                <span className="text-on-surface-variant">{(dict as any).modulePath.progress0}</span>
                <span className="text-on-surface-variant">{seenStats.seen}/{seenStats.total} {(dict as any).modulePath.seen}</span>
              </div>
              <div className="h-4 w-full bg-surface-container-highest border-2 border-surface-container-lowest" />
            </div>
          </div>
        </div>
      </Link>
    )
  }

  /* ── NOT STARTED: white/neutral border, number, minimal card ── */
  return (
    <Link href={localePath(locale, `/quiz/${vehicleType}/${mod.slug}`)} className="block">
      <div className="relative flex items-center gap-8 group">
        {!isLast && <div className="connecting-line" />}
        <div className="w-16 h-16 z-10 flex items-center justify-center border-4 border-surface-container-highest bg-surface-container-low text-on-surface-variant font-headline font-black text-2xl neo-shadow">
          {stepNum}
        </div>
        <div className="flex-grow p-6 bg-surface-container-high border-2 border-surface-container-highest neo-shadow neo-shadow-hover transition-all">
          <div className="flex justify-between items-start">
            <div>
              <span className="font-headline text-xs text-on-surface-variant font-bold tracking-widest uppercase">Module {stepNum}</span>
              <h3 className="text-xl font-headline font-black uppercase tracking-tight text-primary">{modTitle}</h3>
              <p className="text-sm text-on-surface-variant mt-1">{modDescription}</p>
            </div>
            <div className="flex items-center gap-2 bg-surface-container-highest text-on-surface-variant px-3 py-1 text-xs font-bold uppercase tracking-tighter">
              <span className="material-symbols-outlined text-sm">stars</span> +{mod.xp} XP
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs font-headline uppercase mb-1">
              <span className="text-on-surface-variant">{dict.common.start}</span>
              <span className="text-on-surface-variant">{seenStats.seen}/{seenStats.total} {(dict as any).modulePath.seen}</span>
            </div>
            <div className="h-4 w-full bg-surface-container-highest border-2 border-surface-container-lowest" />
          </div>
        </div>
      </div>
    </Link>
  )
}
