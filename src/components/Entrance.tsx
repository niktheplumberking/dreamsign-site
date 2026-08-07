// The entrance, batch 5 — rebuilt from zero around one guarantee Nick has asked for three
// times now: THE FIRST PAINTED FRAME IS THE DS PAIR, DEAD CENTRE. The previous build ran
// its clock from mount, so on a slow load the mark could fade in mid-measurement — the
// "acting" he kept seeing. This one is readiness-gated: nothing starts, and nothing is
// visible, until the wordmark image is decoded, the script font is loaded and the seats
// are measured. Then t=0, and the choreography is deterministic:
//
//   1. DS fades in, centred at x0 y0 (600ms) — the first impression, guaranteed
//   2. holds (400ms)
//   3. the push: "ream" un-clips out of the D shoving the S right, "ign" draws out of
//      the S — and the OPEN word is also centred at x0 y0, by construction: the open
//      state IS the layout, the closed state is transforms on top of it
//   4. holds open (400ms)
//   5. the cloud banks come as they are — but FAST (batch 5): they populate the viewport
//      in ~1.4s, hold, and clear over the live page
//
// Transform + opacity + clip-path only (the Bennett principle, batch 4) — zero layout
// animation anywhere. Once per session · skipped under reduced motion and with ?jump.
import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { EASE_A } from '../lib/motion'
import { D_EDGE, IMG_H } from './Lockup'

/* ---------- the clock (ms) — starts at READY, not at mount ----------
   batch 25 (owner): the whole ride shortened ~33% — every beat keeps its easing and its
   overlaps (FADE still outlasts DRIFT so nothing blinks), the clock just runs tighter. */
const MARK_IN = 420        // DS fades in, already seated centre
const MARK_HOLD = 220
const PUSH = 780
const NAME_HOLD = 220
const DRIFT = 650          // one bank's travel
const FADE = 720           // its crossfade still outlasts the travel, so nothing blinks
const STAGGER_IN = 50
const STAGGER_OUT = 42
const COVER_HOLD = 180
const REVEAL = 200

const T_PUSH = MARK_IN + MARK_HOLD                   // 640
const T_COVER = T_PUSH + PUSH + NAME_HOLD            // 1640

/** the banks, unchanged from batch 4 — Nick: "clouds should come as they are" */
const BANKS: {
  x: number; y: number; w: number; dx: number; dy: number
  src: 'bank' | 'frame' | 'soft'; flipX?: boolean; flipY?: boolean; o?: number
}[] = [
  { x: 50, y: 26, w: 175, dx: 0, dy: -34, src: 'soft', o: 0.95 },
  { x: 50, y: 78, w: 185, dx: 0, dy: 30, src: 'soft', flipX: true, o: 0.95 },
  { x: 16, y: 66, w: 150, dx: -28, dy: 8, src: 'frame', flipX: true },
  { x: 86, y: 62, w: 150, dx: 28, dy: 8, src: 'frame' },
  { x: 50, y: 4, w: 190, dx: 0, dy: -30, src: 'bank', flipY: true },
  { x: 50, y: 44, w: 165, dx: 0, dy: 16, src: 'frame', flipX: true },
  { x: 50, y: 92, w: 205, dx: 0, dy: 26, src: 'bank' },
]

const SRC = {
  bank: '/media/hero-bank-fade.webp',
  frame: '/media/hero-cloud-fg-frame.webp',
  soft: '/media/bank-soft.webp',
}

const COVER_MS = FADE + (BANKS.length - 1) * STAGGER_IN     // 1430
const UNCOVER_MS = FADE + (BANKS.length - 1) * STAGGER_OUT  // 1340
const T_UNCOVER = T_COVER + COVER_MS + COVER_HOLD           // 4330
const CLOCK_TOTAL = T_UNCOVER + UNCOVER_MS + REVEAL         // 5950

/** what App.tsx budgets for __ready: the clock plus a worst-case asset wait */
export const ENTRANCE_MS = CLOCK_TOTAL + 1200

const ROLL: [number, number, number, number] = [0.25, 0.6, 0.3, 1]

type Phase = 'wait' | 'mark' | 'open' | 'cover' | 'uncover'

export default function Entrance({ play, onDone }: { play: boolean; onDone: () => void }) {
  const [gone, setGone] = useState(!play)
  const [phase, setPhase] = useState<Phase>('wait')

  const imgRef = useRef<HTMLImageElement>(null)
  const sRef = useRef<HTMLSpanElement>(null)
  const measured = useRef(false)
  const [dx, setDx] = useState<{ img: number; s: number } | null>(null)

  // readiness: fonts loaded AND image decoded -> measure ONCE -> only then, t=0.
  //
  // THE BUG THIS ORDERING KILLS (it survived batches 2-4 and was the "acting" Nick kept
  // seeing): measure used to run twice — on image load and again on fonts.ready — and the
  // second run read rects that already contained the first run's transforms, so the deltas
  // cancelled to ~0 and the mark sat half-open. Which run came last depended on network
  // timing, which is why it glitched on some loads and not others. getBoundingClientRect
  // INCLUDES transforms; a measurement that feeds transforms may run exactly once.
  const measure = useCallback(() => {
    if (measured.current) return
    const img = imgRef.current, s = sRef.current
    if (!img || !s) return
    const ir = img.getBoundingClientRect(), sr = s.getBoundingClientRect()
    if (ir.width < 10) return
    measured.current = true
    const cx = window.innerWidth / 2
    const dW = ir.width * D_EDGE
    const pairW = dW + sr.width
    setDx({
      img: cx - pairW / 2 - ir.left,
      s: cx - pairW / 2 + dW - sr.left,
    })
  }, [])

  useEffect(() => {
    if (!play) return
    let alive = true
    const arm = async () => {
      try { await document.fonts?.ready } catch { /* fonts API absent — proceed */ }
      const img = imgRef.current
      if (img && !img.complete) {
        await new Promise<void>(res => {
          img.addEventListener('load', () => res(), { once: true })
          img.addEventListener('error', () => res(), { once: true })
          setTimeout(res, 2500) // a wedged image must not hold the site hostage
        })
      }
      if (alive) measure()
    }
    arm()
    return () => { alive = false }
  }, [play, measure])

  // the clock — armed by measurement, not by mount
  useEffect(() => {
    if (!play) { onDone(); return }
    if (dx === null) return
    setPhase('mark')
    const t = [
      setTimeout(() => setPhase('open'), T_PUSH),
      setTimeout(() => setPhase('cover'), T_COVER),
      setTimeout(() => setPhase('uncover'), T_UNCOVER),
      setTimeout(() => { setGone(true); onDone() }, CLOCK_TOTAL),
    ]
    return () => t.forEach(clearTimeout)
  }, [play, dx, onDone])

  if (!play) return null

  const covering = phase === 'cover'
  const open = phase !== 'wait' && phase !== 'mark'
  const seat = (piece: 'img' | 's') => (dx === null ? 0 : open ? 0 : dx[piece])
  const pushT = open
    ? { duration: PUSH / 1000, ease: EASE_A }
    : { duration: 0 } // closed seats apply instantly — measurement must never be seen sliding

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          key="entrance"
          className="fixed inset-0 z-[100] overflow-hidden flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: REVEAL / 1000, ease: 'linear' }}
        >
          <motion.div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(180deg, #BCD8F2 0%, #E7F1FB 76%)' }}
            initial={{ opacity: 1 }}
            animate={{ opacity: phase === 'uncover' ? 0 : 1 }}
            transition={{ duration: 0.55, ease: 'linear' }}
          />

          {/* corner insurance under the full cover */}
          <motion.div
            className="absolute inset-0 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: covering ? 0.85 : 0 }}
            transition={{
              duration: covering ? 0.8 : 0.4,
              delay: covering ? (COVER_MS - 600) / 1000 : 0,
              ease: 'linear',
            }}
          />

          {/* the mark — invisible until measured, then it IS the first frame, centred */}
          <motion.div
            className="relative z-10 text-[clamp(3.2rem,11vw,8.5rem)]"
            initial={false}
            animate={{
              opacity: phase === 'wait' ? 0 : covering || phase === 'uncover' ? 0 : 1,
            }}
            transition={{
              opacity:
                phase === 'wait'
                  ? { duration: 0 }
                  : covering
                    ? { duration: 0.5, delay: 0.45, ease: 'linear' }
                    : { duration: MARK_IN / 1000, ease: EASE_A },
            }}
          >
            <span
              className="inline-flex items-baseline leading-none"
              style={{ filter: 'drop-shadow(0 1px 2px rgba(22,50,79,0.28))' }}
              aria-hidden
            >
              {/* no onLoad path — arm() is the ONLY caller of measure, in one order */}
              <motion.img
                ref={imgRef}
                src="/media/brand/cloud-dream.webp"
                alt=""
                className="block w-auto max-w-none select-none"
                style={{ height: `${IMG_H}em` }}
                initial={false}
                animate={{
                  x: seat('img'),
                  clipPath: open
                    ? 'inset(-8% 0% -8% 0%)'
                    : `inset(-8% ${((1 - D_EDGE) * 100).toFixed(2)}% -8% 0%)`,
                }}
                transition={{ x: pushT, clipPath: pushT }}
              />
              <motion.span
                ref={sRef}
                className="font-script font-normal text-[1.45em] leading-none text-accent"
                initial={false}
                animate={{ x: seat('s') }}
                transition={{ x: pushT }}
              >
                S
              </motion.span>
              <motion.span
                className="font-script font-normal text-[1.45em] leading-none text-accent"
                initial={false}
                animate={{
                  x: seat('s'),
                  clipPath: open ? 'inset(-45% -16% -45% 0%)' : 'inset(-45% 100% -45% 0%)',
                }}
                transition={{ x: pushT, clipPath: pushT }}
              >
                ign
              </motion.span>
            </span>
          </motion.div>

          {/* the banks — same weather, faster: in fast, hold, out fast, page underneath */}
          {BANKS.map((b, i) => {
            const shown = phase === 'cover'
            return (
              <motion.img
                key={i}
                src={SRC[b.src]}
                alt=""
                aria-hidden
                className="absolute z-20 h-auto max-w-none select-none pointer-events-none"
                style={{
                  width: `${b.w}vw`,
                  left: `${b.x}%`,
                  top: `${b.y}%`,
                  willChange: 'transform, opacity',
                }}
                initial={false}
                animate={{
                  opacity: shown ? (b.o ?? 1) : 0,
                  x: `${-50 + (shown ? 0 : b.dx)}%`,
                  y: `${-50 + (shown ? 0 : b.dy)}%`,
                  scaleX: b.flipX ? -1 : 1,
                  scaleY: b.flipY ? -1 : 1,
                }}
                transition={{
                  opacity: {
                    duration: FADE / 1000,
                    delay: (shown ? i * STAGGER_IN : (BANKS.length - 1 - i) * STAGGER_OUT) / 1000,
                    ease: 'linear',
                  },
                  default: {
                    duration: DRIFT / 1000,
                    delay: (shown ? i * STAGGER_IN : (BANKS.length - 1 - i) * STAGGER_OUT) / 1000,
                    ease: ROLL,
                  },
                }}
              />
            )
          })}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
