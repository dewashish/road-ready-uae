import confetti from 'canvas-confetti'

/** Fire a burst of confetti in the design system's gold + cyan colors */
export function firePassConfetti(): void {
  confetti({
    particleCount: 150,
    spread: 80,
    origin: { y: 0.6 },
    colors: ['#f5ce53', '#81ecff', '#f9f9f9'],
  })
}
