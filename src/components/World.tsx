// THE WORLD — one continuous descent, hero → footer.
// ONE scroll progress drives every layer (no per-section useScroll anywhere below the hero),
// one uninterrupted sky paints the whole page, and no content section owns a background.
// Every world layer carries its own mask so its edges dissolve — a section line is impossible.
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import type { MotionValue } from 'motion/react'
import { motion, useScroll, useTransform } from 'motion/react'
import { useReducedMotionSafe } from '../lib/hooks'

type WorldValue = {
  /** 0 at the top of the page, 1 at the bottom — the single scroll source. */
  p: MotionValue<number>
  reduced: boolean
  /** one viewport expressed as a slice of world progress (so a beat can move at its own rate) */
  vh: number
}

const WorldCtx = createContext<WorldValue | null>(null)

export function useWorld(): WorldValue {
  const ctx = useContext(WorldCtx)
  if (!ctx) throw new Error('useWorld must be used inside <World>')
  return ctx
}

/** The hero's bottom edge, sampled off the render at 1440 and 390 (both agree) — the
 *  descent starts on this exact colour. Re-sample if the hero's foreground asset changes. */
export const SEAM_HEX = '#B0C9E4'

/** The one sky. Every section is transparent; this is what shows through, top to bottom. */
const SKY = `linear-gradient(to bottom,
  #D7E7F7 0%,
  ${SEAM_HEX} 24%,
  #CDE2F5 38%,
  #E6F1FB 52%,
  #F1F8FD 66%,
  #FAFCFE 80%,
  #FFFFFF 92%,
  #FFFFFF 100%)`

export function World({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotionSafe()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const [vh, setVh] = useState(0.35)

  useEffect(() => {
    const measure = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      setVh(scrollable > 0 ? Math.min(1, window.innerHeight / scrollable) : 1)
    }
    measure()
    const t = setTimeout(measure, 800) // after fonts + media settle the page height
    window.addEventListener('resize', measure)
    return () => { window.removeEventListener('resize', measure); clearTimeout(t) }
  }, [])

  return (
    <WorldCtx.Provider value={{ p: scrollYProgress, reduced, vh: Math.max(vh, 0.001) }}>
      <div ref={ref} className="relative overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: SKY }} />
        {children}
      </div>
    </WorldCtx.Provider>
  )
}

/**
 * A world layer: an asset anchored to a beat but free to straddle its neighbours.
 * `box` places the container (always with negative insets, so it crosses the junctions);
 * `mask` dissolves the container's own edges; `y` is its parallax rate over the world.
 */
export function WorldLayer({
  src, box, imgClass = 'absolute inset-0 h-full w-full object-cover', y = ['0%', '0%'],
  opacity, base = 1, mask, blend, eager = false,
}: {
  src: string
  box: string
  imgClass?: string
  y?: [string, string]
  opacity?: { range: number[]; values: number[] }
  base?: number
  mask?: string
  blend?: string
  eager?: boolean
}) {
  const { p, reduced } = useWorld()
  const yv = useTransform(p, [0, 1], y)
  const ov = useTransform(p, opacity?.range ?? [0, 1], opacity?.values ?? [base, base])
  const restOpacity = opacity ? Math.max(...opacity.values) : base

  return (
    <div
      className={`absolute left-0 right-0 z-0 overflow-hidden pointer-events-none select-none ${box}`}
      style={mask ? { WebkitMaskImage: mask, maskImage: mask } : undefined}
      aria-hidden
    >
      <motion.img
        src={src} alt="" decoding="async" loading={eager ? 'eager' : 'lazy'}
        className={imgClass}
        style={{
          ...(reduced ? {} : { y: yv }),
          opacity: reduced ? restOpacity : ov,
          ...(blend ? { mixBlendMode: blend as React.CSSProperties['mixBlendMode'] } : {}),
        }}
      />
    </div>
  )
}

/** The gradient bridge across the hero seam: starts on the hero's sampled bottom colour. */
export function SeamBridge({ className = '' }: { className?: string }) {
  return (
    <div
      className={`absolute left-0 right-0 z-0 pointer-events-none ${className}`}
      style={{
        background: `linear-gradient(to bottom,
          ${SEAM_HEX}00 0%, ${SEAM_HEX}D9 16%, ${SEAM_HEX}B3 42%, ${SEAM_HEX}59 72%, ${SEAM_HEX}00 100%)`,
      }}
      aria-hidden
    />
  )
}

/** A beat of the descent: its layers straddle outward, its content always rides on top.
 *  `name` is the Eyes hook — the junction test reads every data-beat boundary. */
export function Beat({ name, layers, children }: { name: string; layers?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="relative" data-beat={name}>
      {layers}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
