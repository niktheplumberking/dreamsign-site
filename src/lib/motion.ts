// THE two easings (design-language §5) — no component retypes them.
export const EASE_A: [number, number, number, number] = [0.22, 1, 0.36, 1]
export const EASE_B: [number, number, number, number] = [0.16, 1, 0.3, 1]
export const EASE_LIFT: [number, number, number, number] = [0.45, 0, 0.15, 1]

export const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { duration: 0.7, delay, ease: EASE_B },
})
