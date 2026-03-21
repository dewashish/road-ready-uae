let audioCtx: AudioContext | null = null

function getAudioCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    audioCtx = new AudioContext()
  }
  return audioCtx
}

function isSoundEnabled(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return localStorage.getItem('road-ready-sound') !== 'off'
  } catch {
    return true
  }
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume = 0.3,
  startDelay = 0
): void {
  const ctx = getAudioCtx()
  if (!ctx) return

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.value = frequency
  gain.gain.value = volume

  // Fade out at the end to avoid clicks
  gain.gain.setValueAtTime(volume, ctx.currentTime + startDelay)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startDelay + duration)

  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(ctx.currentTime + startDelay)
  osc.stop(ctx.currentTime + startDelay + duration + 0.01)
}

/** Ascending 3-note chime — exam start */
export function playExamStart(): void {
  if (!isSoundEnabled()) return
  playTone(523, 0.12, 'sine', 0.25, 0)      // C5
  playTone(659, 0.12, 'sine', 0.25, 0.12)    // E5
  playTone(784, 0.2, 'sine', 0.3, 0.24)      // G5
}

/** Two short alert beeps — timer warning */
export function playTimerWarning(): void {
  if (!isSoundEnabled()) return
  playTone(440, 0.1, 'square', 0.15, 0)      // A4
  playTone(440, 0.1, 'square', 0.15, 0.2)    // A4
}

/** Descending tone — time's up */
export function playTimeUp(): void {
  if (!isSoundEnabled()) return
  playTone(784, 0.15, 'sine', 0.3, 0)        // G5
  playTone(523, 0.3, 'sine', 0.25, 0.15)     // C5
}

/** Bright ping — correct answer */
export function playCorrect(): void {
  if (!isSoundEnabled()) return
  playTone(659, 0.08, 'sine', 0.2, 0)        // E5
  playTone(784, 0.12, 'sine', 0.25, 0.06)    // G5
}

/** Low buzz — wrong answer */
export function playWrong(): void {
  if (!isSoundEnabled()) return
  playTone(220, 0.2, 'sawtooth', 0.1, 0)     // A3
}

/** Triumphant ascending arpeggio — passed */
export function playPass(): void {
  if (!isSoundEnabled()) return
  playTone(523, 0.1, 'sine', 0.25, 0)        // C5
  playTone(659, 0.1, 'sine', 0.25, 0.1)      // E5
  playTone(784, 0.1, 'sine', 0.3, 0.2)       // G5
  playTone(1047, 0.3, 'sine', 0.35, 0.3)     // C6
}

/** Descending two-note — failed */
export function playFail(): void {
  if (!isSoundEnabled()) return
  playTone(330, 0.15, 'sine', 0.2, 0)        // E4
  playTone(262, 0.3, 'sine', 0.2, 0.15)      // C4
}
