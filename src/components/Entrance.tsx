// The entrance, in five deliberate beats — nothing overlaps, nothing hurries:
//   1. the DS mark arrives, centred, and settles
//   2. it holds, long enough to be read as DS
//   3. "ream" pushes out of the D and shoves the S right while "ign" draws out of the S
//   4. the name holds, then cloud puffs DRIFT IN from off-frame, fading up as they come,
//      until the viewport is full
//   5. the same order runs backwards — they drift back out and fade — and the home page
//      is underneath
//
// Batch 3: nothing may appear or vanish on the spot. Every puff crossfades over a window
// longer than its own travel, so it is always arriving or leaving, never blinking. The mark
// is centred by rendering the lockup WITHOUT its reserved width (see Lockup's reserveWidth).
//
// Once per session · skipped entirely under reduced motion and with ?jump.
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { EASE_A } from '../lib/motion'
import Lockup from './Lockup'

/* ---------- the clock (ms) ---------- */
const MARK_IN = 800        // the DS arrives
const MARK_HOLD = 350      // ...and is allowed to just sit there
const PUSH = 1250          // the name opens itself
const NAME_HOLD = 450      // ...and lands
const DRIFT = 900          // one puff's travel
const FADE = 1150          // ...its crossfade, deliberately LONGER than the travel
const STAGGER_IN = 78      // between puffs, arriving
const COVER_HOLD = 500     // full white-out
const STAGGER_OUT = 66     // between puffs, leaving
const REVEAL = 320         // the last veil off the home page

const T_MARK = 150
const T_PUSH = T_MARK + MARK_IN + MARK_HOLD          // 1300
const T_COVER = T_PUSH + PUSH + NAME_HOLD            // 3000

/**
 * The puff field. Every plate carries a `rank`: 0 sits furthest back and is blurred and
 * slightly transparent, 2 is nearest and sharp. That depth is what stops seventeen copies of
 * one silhouette reading as stacked cut paper — the rims fall away into atmosphere instead
 * of lining up. Widths stay at or under the asset's own 2000px so the puffs stay chubby.
 * Order runs outward from the centre, so the cover grows rather than scatters.
 */
const PLATES = [
  { x: 50, y: 52, w: 86, r: -2, flip: false, rank: 2 },
  { x: 16, y: 44, w: 78, r: 4, flip: true, rank: 1 },
  { x: 84, y: 47, w: 80, r: -5, flip: false, rank: 1 },
  { x: 33, y: 84, w: 84, r: 3, flip: true, rank: 2 },
  { x: 69, y: 82, w: 86, r: -3, flip: false, rank: 2 },
  { x: 28, y: 14, w: 76, r: -4, flip: false, rank: 0 },
  { x: 73, y: 12, w: 78, r: 5, flip: true, rank: 0 },
  { x: -2, y: 72, w: 74, r: 6, flip: false, rank: 1 },
  { x: 102, y: 74, w: 76, r: -6, flip: true, rank: 1 },
  { x: 2, y: 14, w: 72, r: -3, flip: true, rank: 0 },
  { x: 98, y: 16, w: 74, r: 4, flip: false, rank: 0 },
  { x: 50, y: 102, w: 90, r: 2, flip: true, rank: 2 },
  { x: 50, y: -2, w: 82, r: -2, flip: false, rank: 0 },
  { x: 14, y: 104, w: 74, r: -5, flip: false, rank: 1 },
  { x: 88, y: 104, w: 74, r: 5, flip: true, rank: 1 },
]

/**
 * Depth ranks. The hero cloud is the texture Nick likes — but it is PAINTED to sit alone
 * against sky, so its shadow rim is drawn strong on purpose. Fifteen of them stacked put every
 * rim on screen at once and the cover reads as cut paper (measured by eye at full cover, and
 * the same fault batch 2 fixed). So the ranks are not just blur: the two back ranks use the
 * rim-lifted derivative and are blurred into atmosphere, and ONLY the front rank carries the
 * sharp hero cloud, where it is read against the soft mass rather than against copies of itself.
 */
const DEPTH = [
  { blur: 7, opacity: 0.82, src: '/media/cloud-puff.webp' },
  { blur: 3, opacity: 0.92, src: '/media/cloud-puff.webp' },
  { blur: 0, opacity: 1, src: '/media/hero-cloud-foreground.webp' },
]

/** how far outside its home a puff starts, as a share of its own width/height */
const DRIFT_X = 34
const DRIFT_Y = 30

const COVER_MS = FADE + (PLATES.length - 1) * STAGGER_IN
const UNCOVER_MS = FADE + (PLATES.length - 1) * STAGGER_OUT
const T_UNCOVER = T_COVER + COVER_MS + COVER_HOLD
const TOTAL = T_UNCOVER + UNCOVER_MS + REVEAL

export { TOTAL as ENTRANCE_MS }

type Phase = 'mark' | 'open' | 'cover' | 'uncover'

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
          animate={{ opacity: gone ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: REVEAL / 1000, ease: 'linear' }}
        >
          {/* the sky the puffs build on — it leaves FIRST on the way out, so the puffs
              retreat over the live home page instead of over a flat gradient */}
          <motion.div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(180deg, #BCD8F2 0%, #E7F1FB 76%)' }}
            initial={{ opacity: 1 }}
            animate={{ opacity: phase === 'uncover' ? 0 : 1 }}
            transition={{ duration: 0.65, ease: 'linear' }}
          />

          {/* corner insurance: a soft white that arrives only once the puffs are nearly
              home, so the cover is total without washing the puff texture out */}
          <motion.div
            className="absolute inset-0 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: covering ? 0.8 : 0 }}
            transition={{
              duration: covering ? 1.1 : 0.5,
              delay: covering ? (COVER_MS - 900) / 1000 : 0,
              ease: 'linear',
            }}
          />

          {/* the name — centred (no reserved width), arrives, settles, opens, then is left
              behind the weather */}
          <motion.div
            className="relative z-10 text-[clamp(3.4rem,13vw,9.5rem)]"
            initial={{ opacity: 0, scale: 0.88, filter: 'blur(8px)' }}
            animate={{
              opacity: phase === 'cover' || phase === 'uncover' ? 0 : 1,
              scale: 1,
              filter: 'blur(0px)',
            }}
            transition={{
              opacity: covering
                ? { duration: 0.55, delay: 0.55, ease: 'linear' }
                : { duration: MARK_IN / 1000, delay: T_MARK / 1000, ease: EASE_A },
              scale: { duration: MARK_IN / 1000, delay: T_MARK / 1000, ease: EASE_A },
              filter: { duration: MARK_IN / 1000, delay: T_MARK / 1000, ease: EASE_A },
            }}
          >
            <Lockup expanded={phase !== 'mark'} ms={PUSH} reserveWidth={false} />
          </motion.div>

          {/* the puffs: each drifts in from off its own edge while fading up, holds, then
              drifts back out — the whole order reversed */}
          {PLATES.map((p, i) => {
            const shown = phase === 'cover'
            const d = DEPTH[p.rank]
            const dir = p.flip ? -1 : 1 // mirrored copies, so one silhouette never reads as repeated
            const dx = ((p.x - 50) / 50) * DRIFT_X
            const dy = ((p.y - 50) / 50) * DRIFT_Y
            return (
              <motion.img
                key={i}
                src={d.src}
                alt=""
                aria-hidden
                className="absolute z-20 h-auto max-w-none select-none pointer-events-none"
                style={{
                  width: `${p.w}vw`,
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  filter: d.blur ? `blur(${d.blur}px)` : undefined,
                  willChange: 'transform, opacity',
                }}
                initial={{
                  opacity: 0,
                  x: `${-50 + dx}%`, y: `${-50 + dy}%`,
                  scaleX: dir * 0.72, scaleY: 0.72, rotate: p.r,
                }}
                animate={{
                  opacity: shown ? d.opacity : 0,
                  x: `${shown ? -50 : -50 + dx}%`,
                  y: `${shown ? -50 : -50 + dy}%`,
                  scaleX: dir * (shown ? 1 : 0.72),
                  scaleY: shown ? 1 : 0.72,
                  rotate: p.r,
                }}
                transition={{
                  // the crossfade outlasts the travel, so a puff is never simply switched on
                  opacity: {
                    duration: FADE / 1000,
                    delay: (shown ? i * STAGGER_IN : (PLATES.length - 1 - i) * STAGGER_OUT) / 1000,
                    ease: 'linear',
                  },
                  default: {
                    duration: DRIFT / 1000,
                    delay: (shown ? i * STAGGER_IN : (PLATES.length - 1 - i) * STAGGER_OUT) / 1000,
                    ease: shown ? [0.22, 1.12, 0.36, 1] : EASE_A,
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
