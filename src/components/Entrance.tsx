// The entrance, in five deliberate beats — nothing overlaps, nothing hurries:
//   1. the DS mark arrives and settles
//   2. it holds, long enough to be read as DS
//   3. "ream" pushes out of the D and shoves the S right while "ign" draws out of the S
//   4. the name holds, then cloud puffs pop in one after another until the viewport is full
//   5. the same pops run backwards and the home page is underneath
//
// Every beat has its own clock below. Nothing is expressed as a fraction of one big
// keyframe array any more — that is what made the old version feel like one rushed
// 670ms event with a 250ms cover slapped on the end.
//
// Once per session · skipped entirely under reduced motion and with ?jump.
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { EASE_A } from '../lib/motion'
import Lockup from './Lockup'

/* ---------- the clock (ms) ---------- */
const MARK_IN = 700        // the DS arrives
const MARK_HOLD = 260      // ...and is allowed to just sit there
const PUSH = 1100          // the name opens itself
const NAME_HOLD = 380      // ...and lands
const POP = 560            // one puff
const STAGGER_IN = 34      // between puffs, arriving
const COVER_HOLD = 400     // full white-out
const STAGGER_OUT = 30     // between puffs, leaving
const REVEAL = 280         // the last veil off the home page

const T_MARK = 120
const T_PUSH = T_MARK + MARK_IN + MARK_HOLD          // 1080
const T_COVER = T_PUSH + PUSH + NAME_HOLD            // 2560

/** the puff field: three overlapping ranks, ordered so the cover grows out of the middle.
    Widths stay at or under the asset's own 2000px, so the puffs read chubby and crisp —
    the old field blew one plate up past 2× and the texture turned to mush.
    The plate is cloud-puff.webp: our hero cloud with its shadow rim lifted, because the
    hero bank's rim is drawn for ONE cloud against sky, and seventeen of them stacked
    turned every rim into a hard line — the page looked like cut paper, not weather. */
const PLATES = [
  { x: 50, y: 50, w: 84, r: -2, flip: false }, // centre first
  { x: 18, y: 44, w: 76, r: 4, flip: true },
  { x: 82, y: 46, w: 78, r: -5, flip: false },
  { x: 34, y: 82, w: 80, r: 3, flip: true },
  { x: 68, y: 80, w: 82, r: -3, flip: false },
  { x: 30, y: 16, w: 74, r: -4, flip: false },
  { x: 72, y: 14, w: 76, r: 5, flip: true },
  { x: 0, y: 74, w: 72, r: 6, flip: false },
  { x: 100, y: 76, w: 74, r: -6, flip: true },
  { x: 2, y: 16, w: 70, r: -3, flip: true },
  { x: 98, y: 18, w: 72, r: 4, flip: false },
  { x: 50, y: 100, w: 86, r: 2, flip: true },
  { x: 50, y: 0, w: 80, r: -2, flip: false },
  { x: 14, y: 100, w: 70, r: -5, flip: false },
  { x: 88, y: 100, w: 70, r: 5, flip: true },
  { x: 12, y: -2, w: 68, r: 3, flip: true },
  { x: 90, y: -2, w: 68, r: -4, flip: false },
]

const COVER_MS = POP + (PLATES.length - 1) * STAGGER_IN
const UNCOVER_MS = POP + (PLATES.length - 1) * STAGGER_OUT
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
            transition={{ duration: 0.55, ease: 'linear' }}
          />

          {/* corner insurance: a soft white that arrives only once the puffs are nearly
              home, so the cover is total without washing the puff texture out */}
          <motion.div
            className="absolute inset-0 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: covering ? 0.72 : 0 }}
            transition={{
              duration: covering ? 0.5 : 0.45,
              delay: covering ? (COVER_MS - 200) / 1000 : 0,
              ease: 'linear',
            }}
          />

          {/* the name — arrives, settles, opens, then is left behind the weather */}
          <motion.div
            className="relative z-10 text-[clamp(2.6rem,10vw,7rem)]"
            initial={{ opacity: 0, scale: 0.86, filter: 'blur(7px)' }}
            animate={{
              opacity: phase === 'cover' || phase === 'uncover' ? 0 : 1,
              scale: 1,
              filter: 'blur(0px)',
            }}
            transition={{
              opacity: covering
                ? { duration: 0.4, delay: 0.5, ease: 'linear' }
                : { duration: MARK_IN / 1000, delay: T_MARK / 1000, ease: EASE_A },
              scale: { duration: MARK_IN / 1000, delay: T_MARK / 1000, ease: EASE_A },
              filter: { duration: MARK_IN / 1000, delay: T_MARK / 1000, ease: EASE_A },
            }}
          >
            <Lockup expanded={phase !== 'mark'} ms={PUSH} />
          </motion.div>

          {/* the puffs: each one pops, with a little overshoot, in its own turn —
              then the whole order runs backwards */}
          {PLATES.map((p, i) => {
            const shown = phase === 'cover'
            const s = shown ? 1 : 0.3
            const dir = p.flip ? -1 : 1 // mirrored copies, so one silhouette never reads as repeated
            return (
              <motion.img
                key={i}
                src="/media/cloud-puff.webp"
                alt=""
                aria-hidden
                className="absolute z-20 h-auto max-w-none select-none pointer-events-none"
                style={{
                  width: `${p.w}vw`,
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  x: '-50%',
                  y: '-50%',
                }}
                initial={{ opacity: 0, scaleX: dir * 0.3, scaleY: 0.3, rotate: p.r }}
                animate={{ opacity: shown ? 1 : 0, scaleX: dir * s, scaleY: s, rotate: p.r }}
                transition={{
                  duration: POP / 1000,
                  delay: (shown ? i * STAGGER_IN : (PLATES.length - 1 - i) * STAGGER_OUT) / 1000,
                  ease: shown ? [0.34, 1.4, 0.64, 1] : EASE_A,
                }}
              />
            )
          })}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
