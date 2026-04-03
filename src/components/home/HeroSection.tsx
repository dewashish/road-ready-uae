'use client'

import { useRef, useState, useEffect, useLayoutEffect } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useMotionValueEvent, MotionValue } from 'motion/react'
import { useDictionary } from '@/i18n/DictionaryContext'

/* ─── Perspective Grid (SVG background) ─── */
function PerspectiveGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[150%] h-[60%]"
        viewBox="0 0 1200 400"
        preserveAspectRatio="none"
        fill="none"
      >
        {[390, 375, 355, 330, 300, 265, 225, 180, 130, 75, 15].map((y, i) => (
          <line
            key={`h-${i}`}
            x1="0" y1={y} x2="1200" y2={y}
            stroke="#3a3a3a"
            strokeWidth={i < 3 ? 1.5 : 1}
            opacity={0.4 + i * 0.05}
          />
        ))}
        {Array.from({ length: 21 }, (_, i) => {
          const bottomX = (i / 20) * 1200
          const topX = 600 + (bottomX - 600) * 0.12
          return (
            <line
              key={`v-${i}`}
              x1={bottomX} y1={400} x2={topX} y2={0}
              stroke="#3a3a3a"
              strokeWidth={1}
              opacity={0.35}
            />
          )
        })}
      </svg>
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 70% at 50% 100%, transparent 30%, #0e0e0e 75%)',
        }}
      />
    </div>
  )
}

/* ─── Vintage Car (NeoPOP gold silhouette) ─── */
export function VintageCar({ leftPercent }: { leftPercent: MotionValue<string> }) {
  const smokeOpacity = useMotionValue(0)
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useMotionValueEvent(leftPercent, 'change', () => {
    smokeOpacity.set(1)
    if (fadeTimer.current) clearTimeout(fadeTimer.current)
    fadeTimer.current = setTimeout(() => smokeOpacity.set(0), 150)
  })

  // Clear timer on unmount
  useEffect(() => {
    return () => { if (fadeTimer.current) clearTimeout(fadeTimer.current) }
  }, [])

  return (
    <motion.div
      className="absolute -top-[12px] sm:-top-[16px] z-20 pointer-events-none"
      style={{ left: leftPercent }}
    >
      {/* Exhaust flames — gold/cyan flicker near tailpipe */}
      <motion.div className="absolute -left-1 bottom-[30%]" style={{ opacity: smokeOpacity }}>
        {[0, 0.12, 0.28].map((delay, i) => (
          <motion.div
            key={`flame-${i}`}
            className="absolute"
            style={{
              width: 6 - i,
              height: 4 - i * 0.5,
              borderRadius: '50% 50% 50% 20%',
              filter: 'blur(0.5px)',
            }}
            animate={{
              x: [-1, -10 - i * 3],
              y: [0, i % 2 === 0 ? -1 : 1],
              opacity: [0.9, 0],
              scale: [1, 0.4],
              backgroundColor: i === 0
                ? ['#f5ce53', '#e6c047', '#f5ce53']
                : i === 1
                  ? ['#81ecff', '#f5ce53', '#81ecff']
                  : ['#ff716c', '#f5ce53', '#ff716c'],
            }}
            transition={{ duration: 0.3 + i * 0.05, repeat: Infinity, delay, ease: 'easeOut' }}
          />
        ))}
      </motion.div>
      {/* Jet exhaust smoke — horizontal trail, only when moving */}
      <motion.div className="absolute -left-3 bottom-[31%]" style={{ opacity: smokeOpacity }}>
        {[0, 0.12, 0.25, 0.4, 0.55, 0.7, 0.85, 1.0].map((delay, i) => (
          <motion.div
            key={`smoke-${i}`}
            className="absolute rounded-full"
            style={{
              width: 6 - i * 0.3,
              height: 4,
              backgroundColor: `rgba(200, 200, 200, ${0.55 - i * 0.05})`,
              filter: 'blur(1.5px)',
            }}
            animate={{
              x: [-4, -60 - i * 10],
              y: [0, -1.5 + (i % 2 === 0 ? -1 : 1)],
              opacity: [0.6, 0],
              scaleX: [1, 3 + i * 0.4],
            }}
            transition={{ duration: 0.7 + i * 0.1, repeat: Infinity, delay, ease: 'easeOut' }}
          />
        ))}
      </motion.div>
      <svg
        width="180" height="72" viewBox="0 0 220 88"
        className="w-[120px] h-[48px] sm:w-[180px] sm:h-[72px]"
        style={{ filter: 'drop-shadow(4px 4px 0 rgba(0,0,0,0.5))' }}
      >
        <defs>
          {/* Mask cuts real holes for windows so background shows through */}
          <mask id="car-window-mask">
            <rect width="220" height="88" fill="white" />
            <rect x="88" y="15" width="22" height="14" fill="black" />
            <rect x="113" y="15" width="30" height="14" fill="black" />
            <path d="M73 30 L85 15 L88 15 L88 29 Z" fill="black" />
            <path d="M145 15 L157 29 L143 29 L143 15 Z" fill="black" />
          </mask>
        </defs>
        <g mask="url(#car-window-mask)">
          {/* Body */}
          <path
            d="M20 55 L45 55 L55 30 L90 20 L155 20 L175 30 L195 55 L210 55 L210 65 L195 65 L195 62 L45 62 L45 65 L20 65 Z"
            fill="#f5ce53"
            stroke="#e6c047"
            strokeWidth="1.5"
          />
          {/* Roof */}
          <path
            d="M70 30 L85 12 L145 12 L160 30"
            fill="#f5ce53"
            stroke="#e6c047"
            strokeWidth="1.5"
          />
        </g>
        {/* Headlight */}
        <rect x="195" y="45" width="12" height="8" fill="#fff" opacity="0.9" />
        {/* Taillight */}
        <rect x="22" y="47" width="8" height="6" fill="#ff716c" />
        {/* Bumpers */}
        <rect x="15" y="55" width="8" height="10" fill="#e6c047" />
        <rect x="205" y="55" width="8" height="10" fill="#e6c047" />
        {/* Front wheel */}
        <circle cx="175" cy="65" r="14" fill="#262626" stroke="#3a3a3a" strokeWidth="2" />
        <circle cx="175" cy="65" r="6" fill="#484848" />
        {/* Rear wheel */}
        <circle cx="60" cy="65" r="14" fill="#262626" stroke="#3a3a3a" strokeWidth="2" />
        <circle cx="60" cy="65" r="6" fill="#484848" />
        {/* Chrome strip */}
        <line x1="50" y1="50" x2="190" y2="50" stroke="#e6c047" strokeWidth="1.5" />
      </svg>
    </motion.div>
  )
}

/* ─── Traffic Light (CSS 3D) ─── */
function TrafficLight3D({ x, opacity }: { x: MotionValue<number>; opacity: MotionValue<number> }) {
  return (
    <motion.div
      className="hidden lg:block absolute left-[6%] top-[18%] xl:left-[10%]"
      style={{ x, opacity, perspective: '800px' }}
      initial={{ opacity: 0, x: -80 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.9, delay: 0.3, ease: [0.175, 0.885, 0.32, 1.275] }}
    >
      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transform: 'rotateY(15deg) rotateX(-5deg)', transformStyle: 'preserve-3d' }}
      >
        <div className="w-3 h-16 mx-auto bg-surface-container-highest" style={{ boxShadow: '3px 3px 0 #f5ce53' }} />
        <div
          className="w-[52px] h-[130px] bg-surface-container-lowest border-2 border-surface-container-highest flex flex-col items-center justify-around py-2 -mt-1"
          style={{ boxShadow: '4px 4px 0 #f5ce53' }}
        >
          {/* Red — lit during last 1/3 of cycle (top) */}
          <motion.div
            className="w-9 h-9 rounded-full border-2 border-error-dim"
            animate={{
              backgroundColor: ['rgba(220,38,38,0.15)', 'rgba(220,38,38,0.15)', 'rgba(220,38,38,0.15)', 'rgba(220,38,38,0.8)', 'rgba(220,38,38,0.8)', 'rgba(220,38,38,0.15)'],
              boxShadow: ['0 0 0px transparent', '0 0 0px transparent', '0 0 0px transparent', '0 0 14px rgba(220,38,38,0.7)', '0 0 14px rgba(220,38,38,0.7)', '0 0 0px transparent'],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', times: [0, 0.3, 0.63, 0.67, 0.96, 1] }}
          />
          {/* Amber — lit during middle 1/3 of cycle (middle) */}
          <motion.div
            className="w-9 h-9 rounded-full border-2 border-secondary-dim"
            animate={{
              backgroundColor: ['rgba(245,206,83,0.15)', 'rgba(245,206,83,0.15)', 'rgba(245,206,83,0.8)', 'rgba(245,206,83,0.8)', 'rgba(245,206,83,0.15)', 'rgba(245,206,83,0.15)'],
              boxShadow: ['0 0 0px transparent', '0 0 0px transparent', '0 0 14px rgba(245,206,83,0.7)', '0 0 14px rgba(245,206,83,0.7)', '0 0 0px transparent', '0 0 0px transparent'],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', times: [0, 0.3, 0.34, 0.63, 0.67, 1] }}
          />
          {/* Green — lit during first 1/3 of cycle (bottom) */}
          <motion.div
            className="w-9 h-9 rounded-full border-2 border-success-dim"
            animate={{
              backgroundColor: ['rgba(74,222,128,0.8)', 'rgba(74,222,128,0.8)', 'rgba(74,222,128,0.15)', 'rgba(74,222,128,0.15)', 'rgba(74,222,128,0.15)', 'rgba(74,222,128,0.8)'],
              boxShadow: ['0 0 14px rgba(74,222,128,0.7)', '0 0 14px rgba(74,222,128,0.7)', '0 0 0px transparent', '0 0 0px transparent', '0 0 0px transparent', '0 0 14px rgba(74,222,128,0.7)'],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', times: [0, 0.3, 0.34, 0.65, 0.96, 1] }}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ─── Stop Sign ─── */
function StopSign({ x, opacity }: { x: MotionValue<number>; opacity: MotionValue<number> }) {
  return (
    <motion.div
      className="hidden lg:block absolute right-[6%] top-[14%] xl:right-[10%]"
      style={{ x, opacity }}
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.9, delay: 0.45, ease: [0.175, 0.885, 0.32, 1.275] }}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        style={{ transform: 'rotateY(-20deg) rotateX(5deg)', transformStyle: 'preserve-3d' }}
      >
        <svg width="90" height="90" viewBox="0 0 100 100" style={{ filter: 'drop-shadow(4px 4px 0 #81ecff)' }}>
          <polygon points="30,5 70,5 95,30 95,70 70,95 30,95 5,70 5,30" fill="#d7383b" stroke="#ff716c" strokeWidth="3" />
          <text x="50" y="56" textAnchor="middle" fill="white" fontFamily="Space Grotesk, sans-serif" fontWeight="bold" fontSize="22">STOP</text>
        </svg>
      </motion.div>
    </motion.div>
  )
}

/* ─── Speed Limit Sign ─── */
function SpeedSign({ x, opacity }: { x: MotionValue<number>; opacity: MotionValue<number> }) {
  return (
    <motion.div
      className="hidden xl:block absolute right-[10%] top-[52%]"
      style={{ x, opacity }}
      initial={{ opacity: 0, x: 60, scale: 0.7 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.6, ease: [0.175, 0.885, 0.32, 1.275] }}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
        style={{ transform: 'rotateY(-15deg) rotateX(8deg)' }}
      >
        <svg width="68" height="68" viewBox="0 0 80 80" style={{ filter: 'drop-shadow(3px 3px 0 #f5ce53)' }}>
          <circle cx="40" cy="40" r="36" fill="white" stroke="#d7383b" strokeWidth="6" />
          <text x="40" y="47" textAnchor="middle" fill="#0e0e0e" fontFamily="Space Grotesk, sans-serif" fontWeight="bold" fontSize="26">60</text>
        </svg>
      </motion.div>
    </motion.div>
  )
}

/* ─── Lightning Bolt ─── */
function LightningBolt({ className, delay = 0, size = 28, scrollOpacity }: { className?: string; delay?: number; size?: number; scrollOpacity: MotionValue<number> }) {
  return (
    <motion.div
      className={`absolute hidden sm:block ${className}`}
      style={{ opacity: scrollOpacity }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.6 + delay, type: 'spring', stiffness: 300 }}
    >
      <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay }}>
        <svg width={size} height={size * 1.6} viewBox="0 0 24 38" fill="#f5ce53">
          <path d="M13.5 0L0 22h9.5L7.5 38 24 14h-10z" />
        </svg>
      </motion.div>
    </motion.div>
  )
}

/* ─── Sparkle ─── */
function Sparkle({ className, delay = 0, size = 14, color = '#81ecff', scrollOpacity }: { className?: string; delay?: number; size?: number; color?: string; scrollOpacity: MotionValue<number> }) {
  return (
    <motion.div
      className={`absolute hidden sm:block ${className}`}
      style={{ opacity: scrollOpacity }}
      initial={{ opacity: 0, scale: 0, rotate: 0 }}
      animate={{ opacity: 1, scale: 1, rotate: 45 }}
      transition={{ duration: 0.35, delay: 0.7 + delay, type: 'spring' }}
    >
      <motion.div animate={{ opacity: [0.5, 1, 0.5], scale: [0.85, 1.15, 0.85] }} transition={{ duration: 2.5 + delay, repeat: Infinity, ease: 'easeInOut' }}>
        <div style={{ width: size, height: size, backgroundColor: color, transform: 'rotate(45deg)' }} />
      </motion.div>
    </motion.div>
  )
}

/* ─── Mobile Accents ─── */
function MobileAccents({ scrollOpacity }: { scrollOpacity: MotionValue<number> }) {
  return (
    <>
      <motion.div className="sm:hidden absolute left-4 top-[30%]" style={{ opacity: scrollOpacity }}
        initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 0.7, scale: 1 }} transition={{ delay: 0.5, type: 'spring' }}>
        <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
          <svg width="18" height="28" viewBox="0 0 24 38" fill="#f5ce53"><path d="M13.5 0L0 22h9.5L7.5 38 24 14h-10z" /></svg>
        </motion.div>
      </motion.div>
      <motion.div className="sm:hidden absolute right-6 top-[25%]" style={{ opacity: scrollOpacity }}
        initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 0.6, scale: 1, rotate: 45 }} transition={{ delay: 0.6, type: 'spring' }}>
        <motion.div animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.1, 0.9] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}>
          <div className="w-3 h-3 bg-tertiary" style={{ transform: 'rotate(45deg)' }} />
        </motion.div>
      </motion.div>
    </>
  )
}


/* ═══════════════════════════════════════════════
   HERO SECTION — Main Export
   ═══════════════════════════════════════════════ */
export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const dict = useDictionary()

  // Responsive — use useLayoutEffect to avoid hydration flash
  const [isMobile, setIsMobile] = useState(false)
  const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect
  useIsomorphicLayoutEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // All animations must complete within ~380px of scroll (sticky scroll distance)
  // ── Floating objects: drift outward + fade ──
  const leftObjX = useTransform(scrollY, [0, 250], [0, -200])
  const rightObjX = useTransform(scrollY, [0, 250], [0, 200])
  const objOpacity = useTransform(scrollY, [0, 200], [1, 0])

  // ── Accents fade ──
  const accentOpacity = useTransform(scrollY, [0, 180], [1, 0])

  // ── Grid fade — lasts longer ──
  const gridOpacity = useTransform(scrollY, [200, 500], [1, 0])

  // ── Hero text: fontSize shrinks so inline spans reflow from 3 lines → 1 line ──
  const fontSize = useTransform(scrollY, [50, 380], [isMobile ? 52 : 80, 14])
  const textTop = useTransform(scrollY, [50, 380], [isMobile ? '22%' : '30%', '10px'])

  // ── Compact bar background fades in behind the shrunk text ──
  const barOpacity = useTransform(scrollY, [300, 380], [0, 0.95])

  // ── Subtitle/CTA fade ──
  const secondaryOpacity = useTransform(scrollY, [80, 220], [1, 0])

  // ── Scroll indicator ──
  const scrollIndicatorOpacity = useTransform(scrollY, [0, 60], [1, 0])

  const handleCTA = () => {
    document.getElementById('vehicle-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* Outer wrapper — scroll height for the animation */}
      <div className="h-[160vh] relative z-20 pointer-events-none" ref={heroRef}>
        {/* Sticky hero — stays pinned while scrolling through outer wrapper */}
        <div className="sticky top-[64px] h-[calc(100vh-64px)] overflow-hidden">
          {/* Background Grid */}
          <motion.div className="absolute inset-0" style={{ opacity: gridOpacity }}>
            <PerspectiveGrid />
          </motion.div>

          {/* Radial glow */}
          <div
            className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[300px] sm:w-[600px] sm:h-[400px] md:w-[800px] md:h-[500px] pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at center, rgba(245, 206, 83, 0.06) 0%, transparent 70%)' }}
          />

          {/* Floating objects — each directly positioned */}
          <TrafficLight3D x={leftObjX} opacity={objOpacity} />
          <StopSign x={rightObjX} opacity={objOpacity} />
          <SpeedSign x={rightObjX} opacity={objOpacity} />

          {/* Lightning bolts */}
          <LightningBolt className="left-[18%] top-[12%]" delay={0} size={24} scrollOpacity={accentOpacity} />
          <LightningBolt className="right-[18%] top-[65%]" delay={0.3} size={20} scrollOpacity={accentOpacity} />
          <LightningBolt className="left-[12%] bottom-[20%]" delay={0.15} size={18} scrollOpacity={accentOpacity} />
          <LightningBolt className="right-[30%] top-[10%]" delay={0.45} size={22} scrollOpacity={accentOpacity} />

          {/* Sparkles */}
          <Sparkle className="left-[22%] top-[55%]" delay={0} size={12} color="#81ecff" scrollOpacity={accentOpacity} />
          <Sparkle className="right-[14%] top-[38%]" delay={0.2} size={10} color="#f5ce53" scrollOpacity={accentOpacity} />
          <Sparkle className="left-[35%] top-[15%]" delay={0.4} size={8} color="#81ecff" scrollOpacity={accentOpacity} />
          <Sparkle className="right-[25%] bottom-[25%]" delay={0.1} size={14} color="#f5ce53" scrollOpacity={accentOpacity} />
          <Sparkle className="left-[8%] top-[42%]" delay={0.35} size={10} color="#81ecff" scrollOpacity={accentOpacity} />

          {/* Mobile accents */}
          <MobileAccents scrollOpacity={accentOpacity} />

          {/* ── Compact bar background — fades in as text shrinks to top ── */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-[44px] z-[9] bg-surface-container-low/95 backdrop-blur-sm border-b border-surface-container-highest pointer-events-none"
            style={{ opacity: barOpacity }}
          />

          {/* ── Headline — inline spans reflow from 3 lines → 1 line as fontSize shrinks ── */}
          <motion.div
            className="absolute left-1/2 z-10 text-center w-full max-w-4xl px-4"
            style={{
              top: textTop,
              translateX: '-50%',
              fontSize,
            }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.175, 0.885, 0.32, 1.275] }}
          >
            <motion.span
              className="font-headline font-bold uppercase tracking-tight leading-[1.1] inline"
              style={{ WebkitTextStroke: '2px #f5ce53', color: 'transparent', paintOrder: 'stroke fill' }}
            >
              {dict.hero.uaes1}{' '}
            </motion.span>
            <span className="font-headline font-bold uppercase tracking-tight text-primary leading-[1.1] inline">
              {dict.hero.theoryTest}{' '}
            </span>
            <span className="font-headline font-bold uppercase tracking-tight text-secondary leading-[1.1] inline">
              {dict.hero.platform}
            </span>
          </motion.div>

          {/* ── Subtitle & CTA — separate from headline, centered, fades out early ── */}
          <div className="absolute inset-0 flex items-center justify-center" style={{ paddingTop: isMobile ? '180px' : '100px' }}>
            <div className="text-center px-4 max-w-xl pointer-events-auto z-10">
              <motion.div className="hidden sm:flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 text-on-surface-variant text-xs sm:text-sm"
                style={{ opacity: secondaryOpacity }}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.55 }}>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary" style={{ fontSize: 18 }}>menu_book</span>
                  <span>{dict.hero.officialQuestions}</span>
                </div>
                <div className="hidden sm:block w-1 h-1 bg-surface-container-highest rounded-full" />
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary" style={{ fontSize: 18 }}>route</span>
                  <span>{dict.hero.adaptiveLearning}</span>
                </div>
                <div className="hidden sm:block w-1 h-1 bg-surface-container-highest rounded-full" />
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-tertiary" style={{ fontSize: 18 }}>timer</span>
                  <span>{dict.hero.realExam}</span>
                </div>
              </motion.div>

              <motion.div className="mt-4 sm:mt-10" style={{ opacity: secondaryOpacity }}
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.85, type: 'spring', stiffness: 200 }}>
                <button
                  onClick={handleCTA}
                  className="neo-push font-headline font-bold py-3.5 px-6 sm:px-10 md:px-14 text-center uppercase tracking-widest text-sm bg-primary text-surface-container-lowest border-2 border-surface-container-lowest select-none cursor-pointer w-full sm:w-auto"
                  style={{ boxShadow: '4px 4px 0px 0px #f5ce53' }}
                >
                  {dict.hero.startPracticing}
                </button>
              </motion.div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <motion.div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10" style={{ opacity: scrollIndicatorOpacity }}>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
              <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 28 }}>expand_more</span>
            </motion.div>
          </motion.div>
        </div>
      </div>

    </>
  )
}
