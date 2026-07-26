// The entrance: the DS mark opens into the full name with the SAME gesture the nav uses,
// then cloud forms spawn and spread until they cover the viewport, hold, and dissipate on
// exactly the reversed motion — revealing the hero underneath.
// ≤3s · once per session · skipped entirely under reduced motion and with ?jump.
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { EASE_A } from '../lib/motion'
import Lockup from './Lockup'

const TOTAL = 2950

// spawn → cover → hold → dissipate, as fractions of the sprite timeline
const T = [0, 0.22, 0.42, 0.66, 1] as const

/** how far the mark sits right of the name's left edge, so it starts optically centred */
const MARK_SHIFT = '2.1em'

/** the cloud mass: one plate, eight times, each with its own destination */
const SPRITES = [
  { box: 'w-[96vw]', x: '-38%', y: '-32%', s: 2.1, r: -7, d: 0 },
  { box: 'w-[88vw]', x: '42%', y: '-28%', s: 1.95, r: 6, d: 0.05 },
  { box: 'w-[100vw]', x: '-26%', y: '26%', s: 2.2, r: 4, d: 0.03 },
  { box: 'w-[92vw]', x: '30%', y: '31%', s: 2.0, r: -5, d: 0.08 },
  { box: 'w-[82vw]', x: '2%', y: '-40%', s: 1.8, r: 2, d: 0.11 },
  { box: 'w-[104vw]', x: '-2%', y: '42%', s: 2.35, r: -3, d: 0.06 },
  { box: 'w-[86vw]', x: '-44%', y: '4%', s: 1.9, r: 5, d: 0.09 },
  { box: 'w-[86vw]', x: '46%', y: '8%', s: 1.9, r: -6, d: 0.13 },
]

export default function Entrance({ play, onDone }: { play: boolean; onDone: () => void }) {
  const [gone, setGone] = useState(!play)
  const [named, setNamed] = useState(false)

  useEffect(() => {
    if (!play) { onDone(); return }
    const morph = setTimeout(() => setNamed(true), 750)
    const end = setTimeout(() => { setGone(true); onDone() }, TOTAL)
    return () => { clearTimeout(morph); clearTimeout(end) }
  }, [play, onDone])

  if (!play) return null

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          key="entrance"
          className="fixed inset-0 z-[100] overflow-hidden flex items-center justify-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: [1, 1, 1, 1, 0] }}
          transition={{ duration: TOTAL / 1000, times: [0, 0.46, 0.72, 0.80, 1], ease: 'linear' }}
        >
          {/* the ground the clouds build on — deep enough that white cloud forms read on it */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #BCD8F2 0%, #E7F1FB 76%)' }} />
          {/* the last of the sky going under the mass, so the cover is total, corners included */}
          <motion.div
            className="absolute inset-0 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0, 0.88, 0.88, 0] }}
            transition={{ duration: TOTAL / 1000 - 0.9, delay: 0.9, times: T as unknown as number[], ease: 'linear' }}
          />

          {/* the name: the mark starts optically centred and slides into place as it opens */}
          <motion.div
            className="relative z-10 text-[clamp(2.6rem,10vw,7rem)]"
            initial={{ opacity: 0, scale: 0.95, x: MARK_SHIFT }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0.95, 1, 1, 1.04], x: named ? '0em' : MARK_SHIFT }}
            transition={{
              opacity: { duration: 2.1, times: [0, 0.22, 0.66, 1], ease: EASE_A },
              scale: { duration: 2.1, times: [0, 0.22, 0.66, 1], ease: EASE_A },
              x: { duration: 0.64, ease: EASE_A },
            }}
          >
            <Lockup expanded={named} />
          </motion.div>

          {/* the clouds: spawn, spread, cover, then the same motion reversed */}
          {SPRITES.map((sp, i) => (
            <div key={i} className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 ${sp.box} pointer-events-none`}>
              <motion.img
                src="/media/hero-cloud-foreground.webp" alt="" aria-hidden
                className="w-full h-auto max-w-none select-none"
                initial={{ opacity: 0, scale: 0.22, x: '0%', y: '0%', rotate: sp.r / 2 }}
                animate={{
                  opacity: [0, 0, 1, 1, 0],
                  scale: [0.22, 0.7, sp.s, sp.s, 0.26],
                  x: ['0%', `${parseFloat(sp.x) / 2}%`, sp.x, sp.x, '0%'],
                  y: ['0%', `${parseFloat(sp.y) / 2}%`, sp.y, sp.y, '0%'],
                  rotate: [sp.r / 2, sp.r, sp.r, sp.r, sp.r / 2],
                }}
                transition={{
                  duration: TOTAL / 1000 - 0.9,
                  delay: 0.9 + sp.d,
                  times: T as unknown as number[],
                  ease: EASE_A,
                }}
              />
            </div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
