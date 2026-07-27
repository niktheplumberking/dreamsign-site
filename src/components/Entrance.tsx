// The entrance, batch 4 — rebuilt on the Bennett Loader principle (bennett-co-site,
// src/components/ui/Loader.tsx): THE MARK NEVER ANIMATES LAYOUT. The full "DreamSign"
// lockup is laid out once, at its final centred position, and the closed DS state is
// expressed entirely as measured transforms + clip-paths on top of that layout. Opening
// is transforms returning to zero — compositor work, nothing for the layout engine to
// stutter on. That is what makes Bennett's curtain glassy, and now this one.
//
//   1. the full word is laid out centred (invisible), measured, then shown AS the DS pair,
//      dead centre, with a clean Bennett arrival: fade + a whisper of scale, no blur
//   2. hold — long enough to be read as DS
//   3. the push: "ream" un-clips out of the D while D and S slide to their final seats;
//      "ign" draws out of the S on the same clock. End state: DreamSign centred, x0 y0
//   4. the sky's cloud banks roll in — the HERO's own bank texture, huge and soft, each
//      fading up over a window longer than its travel, until the viewport is covered
//   5. the same banks roll back out over the live page
//
// Once per session · skipped entirely under reduced motion and with ?jump.
import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { EASE_A } from '../lib/motion'
import { D_EDGE, IMG_H } from './Lockup'

/* ---------- the clock (ms) ---------- */
const MARK_IN = 800        // the DS arrives
const MARK_HOLD = 400      // ...and is allowed to just sit there
const PUSH = 1250          // the name opens itself
const NAME_HOLD = 500      // ...and lands, centred
const DRIFT = 1700         // one bank's travel
const FADE = 2000          // ...its crossfade — deliberately LONGER than the travel
const STAGGER_IN = 170     // between banks, arriving
const STAGGER_OUT = 140    // between banks, leaving
const COVER_HOLD = 550     // full white-out
const REVEAL = 320         // the last veil off the home page

const T_MARK = 150
const T_PUSH = T_MARK + MARK_IN + MARK_HOLD          // 1350
const T_COVER = T_PUSH + PUSH + NAME_HOLD            // 3100

/**
 * The cloud banks — the texture Nick pointed at: the hero's own bank family, not the
 * rimmed comic cloud. Huge plates (well over viewport width), so the puffs read at the
 * same scale they do in the hero. `soft` uses bank-soft.webp: the same artwork with a
 * 7px blur BAKED INTO THE FILE — the browser never runs a filter, which is where the
 * batch-3 glitching came from (15 live blurs compositing over each other).
 * dx/dy: where each bank drifts in from, in % of its own size. No scale bounce — banks
 * roll, they do not pop.
 */
const BANKS: {
  x: number; y: number; w: number; dx: number; dy: number
  src: 'bank' | 'frame' | 'soft'; flipX?: boolean; flipY?: boolean; o?: number
}[] = [
  { x: 50, y: 26, w: 175, dx: 0, dy: -34, src: 'soft', o: 0.95 },            // upper haze
  { x: 50, y: 78, w: 185, dx: 0, dy: 30, src: 'soft', flipX: true, o: 0.95 },// lower haze
  { x: 16, y: 66, w: 150, dx: -28, dy: 8, src: 'frame', flipX: true },       // rolls in left
  { x: 86, y: 62, w: 150, dx: 28, dy: 8, src: 'frame' },                     // rolls in right
  { x: 50, y: 4, w: 190, dx: 0, dy: -30, src: 'bank', flipY: true },         // the ceiling
  { x: 50, y: 44, w: 165, dx: 0, dy: 16, src: 'frame', flipX: true },        // the centre seal
  { x: 50, y: 92, w: 205, dx: 0, dy: 26, src: 'bank' },                      // the hero's own rise
]

const SRC = {
  bank: '/media/hero-bank-fade.webp',
  frame: '/media/hero-cloud-fg-frame.webp',
  soft: '/media/bank-soft.webp',
}

const COVER_MS = FADE + (BANKS.length - 1) * STAGGER_IN
const UNCOVER_MS = FADE + (BANKS.length - 1) * STAGGER_OUT
const T_UNCOVER = T_COVER + COVER_MS + COVER_HOLD
const TOTAL = T_UNCOVER + UNCOVER_MS + REVEAL

export { TOTAL as ENTRANCE_MS }

/** banks roll — a long ease-out with no overshoot */
const ROLL: [number, number, number, number] = [0.25, 0.6, 0.3, 1]

type Phase = 'mark' | 'open' | 'cover' | 'uncover'

/**
 * The transform-only mark. The expanded lockup is the LAYOUT; the closed DS state is
 * derived by measuring where each piece sits and translating D+S so the pair is centred
 * (Bennett's measured-delta trick, run once per piece). Nothing here ever animates
 * width — only transform and clip-path.
 */
function EntranceMark({ open }: { open: boolean }) {
  const imgRef = useRef<HTMLImageElement>(null)
  const sRef = useRef<HTMLSpanElement>(null)
  const ignRef = useRef<HTMLSpanElement>(null)
  const [dx, setDx] = useState<{ img: number; s: number } | null>(null)

  const measure = useCallback(() => {
    const img = imgRef.current, s = sRef.current
    if (!img || !s) return
    const ir = img.getBoundingClientRect(), sr = s.getBoundingClientRect()
    if (ir.width < 10) return // not loaded yet — measuring now would park the mark off-centre
    const cx = window.innerWidth / 2
    const dW = ir.width * D_EDGE                 // the D alone
    const pairW = dW + sr.width                  // the closed DS pair
    setDx({
      img: cx - pairW / 2 - ir.left,             // D's left edge lands at the pair's start
      s: cx - pairW / 2 + dW - sr.left,          // S lands flush against the D
    })
  }, [])

  useEffect(() => {
    if (imgRef.current?.complete) measure()
    document.fonts?.ready.then(measure)
  }, [measure])

  const seat = (piece: 'img' | 's') => (dx === null ? 0 : open ? 0 : dx[piece])
  // the closed seats are applied INSTANTLY (duration 0): when the measurement lands, the
  // pieces must snap into the DS pair before anyone sees them — only the OPEN is animated
  const dur = open ? { duration: PUSH / 1000, ease: EASE_A } : { duration: 0 }

  return (
    <span
      className="inline-flex items-baseline leading-none"
      style={{
        opacity: dx === null ? 0 : 1, // Bennett's rule: never show an unmeasured mark
        filter: 'drop-shadow(0 1px 2px rgba(22,50,79,0.28))',
      }}
      aria-hidden
    >
      <motion.img
        ref={imgRef}
        src="/media/brand/cloud-dream.webp"
        alt=""
        onLoad={measure}
        className="block w-auto max-w-none select-none"
        style={{ height: `${IMG_H}em` }}
        initial={false}
        animate={{
          x: seat('img'),
          clipPath: open
            ? 'inset(-8% 0% -8% 0%)'
            : `inset(-8% ${((1 - D_EDGE) * 100).toFixed(2)}% -8% 0%)`,
        }}
        transition={{ x: dur, clipPath: dur }}
      />
      <motion.span
        ref={sRef}
        className="font-script font-normal text-[1.45em] leading-none text-accent"
        initial={false}
        animate={{ x: seat('s') }}
        transition={{ x: dur }}
      >
        S
      </motion.span>
      <motion.span
        ref={ignRef}
        className="font-script font-normal text-[1.45em] leading-none text-accent"
        initial={false}
        animate={{
          x: seat('s'),
          clipPath: open ? 'inset(-45% -16% -45% 0%)' : 'inset(-45% 100% -45% 0%)',
        }}
        transition={{ x: dur, clipPath: dur }}
      >
        ign
      </motion.span>
    </span>
  )
}

export default function Entrance({ play, onDone }: { play: boolean; onDone: () => void }) {
  const [gone, setGone] = useState(!play)
  const [phase, setPhase] = useState<Phase>('mark')

  useEffect(() => {
    if (!play) { onDone(); return }
    const t = [
      setTimeout(() => setPhase('open'), T_PUSH),
      setTimeout(() => setPhase('cover'), T_COVER),
      setTimeout(() => setPhase('uncover'), T_UNCOVER),
      setTimeout(() => { setGone(true); onDone() }, TOTAL),
    ]
    return () => t.forEach(clearTimeout)
  }, [play, onDone])

  if (!play) return null

  const covering = phase === 'cover'

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
          {/* the sky the banks build on — it leaves FIRST on the way out, so the banks
              retreat over the live home page instead of over a flat gradient */}
          <motion.div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(180deg, #BCD8F2 0%, #E7F1FB 76%)' }}
            initial={{ opacity: 1 }}
            animate={{ opacity: phase === 'uncover' ? 0 : 1 }}
            transition={{ duration: 0.65, ease: 'linear' }}
          />

          {/* corner insurance: a soft white that arrives once the banks are nearly home */}
          <motion.div
            className="absolute inset-0 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: covering ? 0.85 : 0 }}
            transition={{
              duration: covering ? 1.2 : 0.5,
              delay: covering ? (COVER_MS - 1000) / 1000 : 0,
              ease: 'linear',
            }}
          />

          {/* the mark — Bennett arrival: fade + a whisper of scale, then the push */}
          <motion.div
            className="relative z-10 text-[clamp(3.2rem,11vw,8.5rem)]"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{
              opacity: phase === 'cover' || phase === 'uncover' ? 0 : 1,
              scale: 1,
            }}
            transition={{
              opacity: covering
                ? { duration: 0.6, delay: 0.6, ease: 'linear' }
                : { duration: MARK_IN / 1000, delay: T_MARK / 1000, ease: EASE_A },
              scale: { duration: (MARK_IN + 150) / 1000, delay: T_MARK / 1000, ease: EASE_A },
            }}
          >
            <EntranceMark open={phase !== 'mark'} />
          </motion.div>

          {/* the banks: each rolls in from off its own edge while fading up, holds, then
              rolls back out — the whole order reversed. Transform + opacity only. */}
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
