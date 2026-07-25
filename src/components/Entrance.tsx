// M09 staged entrance — the logo IS a motion and doubles as the site's entrance (brief §7).
// D (cloud) + S (ink) arrive together, part, the pen underlines them, the sky takes over.
// ≤3s · once per session · reduced-motion/?jump ⇒ skipped entirely.
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { EASE_A, EASE_B, EASE_LIFT } from '../lib/motion'

export default function Entrance({ play, onDone }: { play: boolean; onDone: () => void }) {
  const [gone, setGone] = useState(!play)

  useEffect(() => {
    if (!play) { onDone(); return }
    const t = setTimeout(() => { setGone(true); onDone() }, 3000)
    return () => clearTimeout(t)
  }, [play, onDone])

  if (!play) return null

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          key="entrance"
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: 'linear-gradient(180deg, #DCEBF8 0%, #F5F9FD 70%)' }}
          exit={{ y: '-100%' }}
          transition={{ duration: 1.5, ease: EASE_LIFT }}
        >
          <div className="relative flex items-end">
            <motion.img
              src="/media/brand/cloud-d.webp"
              alt=""
              className="h-40 md:h-56 w-auto"
              initial={{ scale: 0.94, opacity: 0, x: 0 }}
              animate={{ scale: 1, opacity: 1, x: '-0.16em' }}
              transition={{
                scale: { duration: 0.6, ease: EASE_A },
                opacity: { duration: 0.6, ease: EASE_A },
                x: { delay: 0.6, duration: 0.9, ease: EASE_A },
              }}
            />
            <motion.span
              aria-hidden
              className="font-script text-accent leading-none text-[8.5rem] md:text-[12rem] -ml-6 translate-y-[0.10em]"
              style={{ textShadow: '0 1px 0 currentColor' }}
              initial={{ scale: 0.94, opacity: 0, x: 0, rotate: -8 }}
              animate={{ scale: 1, opacity: 1, x: '0.16em', rotate: -8 }}
              transition={{
                scale: { duration: 0.6, ease: EASE_A },
                opacity: { duration: 0.6, ease: EASE_A },
                x: { delay: 0.6, duration: 0.9, ease: EASE_A },
              }}
            >
              S
            </motion.span>
            {/* the pen underlines the name — the protagonist's first appearance */}
            <svg
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[130%]"
              viewBox="0 0 300 40" fill="none" aria-hidden
            >
              <motion.path
                d="M8 30 C 90 40, 210 36, 292 14"
                stroke="#2458A6" strokeWidth="4" strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 1.7, duration: 1.2, ease: EASE_B }}
              />
            </svg>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
