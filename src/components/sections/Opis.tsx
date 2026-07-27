// GALAXY HOME STRUCTURAL REPLICA — Section 4: Content/Description block (inside mountain wrapper).
//
// Batch 3: the block is now a cartoon thought — the button is the character, and the cloud
// above it is what the character is thinking. The bubble is built from real overlapping
// circles rather than a picture of a cloud, so it grows with its text at any width and never
// goes soft. The whole cloud is drawn OPAQUE inside a wrapper that carries the opacity:
// overlapping semi-transparent circles compound where they meet and the seams show. Fade the
// group, never the pieces.
//
// The h1 moved to the hero (one h1 per page, and the hero is what a search engine reads
// first), so this is a p — same job, correct rank.
import { motion } from 'motion/react'
import { useReducedMotionSafe, WA_LINK } from '../../lib/hooks'
import { GlossyPill } from '../Nav'

/** the puffs that turn a rounded box into a cloud — position/size in % of the bubble box */
const PUFFS = [
  { x: 6, y: -13, s: 30 }, { x: 28, y: -26, s: 42 }, { x: 55, y: -23, s: 36 },
  { x: 74, y: -11, s: 29 }, { x: -5, y: 24, s: 27 }, { x: 82, y: 27, s: 27 },
  { x: 12, y: 60, s: 26 }, { x: 38, y: 66, s: 30 }, { x: 64, y: 61, s: 26 },
]

export default function Opis() {
  const reduced = useReducedMotionSafe()

  /** a slow idle drift — the thing that makes it read as alive rather than placed */
  const float = (amount: number, seconds: number, delay = 0) =>
    reduced
      ? {}
      : {
          animate: { y: [0, -amount, 0] },
          transition: { duration: seconds, repeat: Infinity, ease: 'easeInOut' as const, delay },
        }

  return (
    <div className="flex flex-col items-center px-5 sm:px-6 py-16 md:py-32 text-center">
      {/* the thought itself */}
      <motion.div
        className="relative w-full max-w-[560px]"
        initial={{ opacity: 0, y: 26, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-90px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* the shadow goes on the wrapper, so the cloud lifts off the sky as ONE shape —
            put it on the pieces and every circle casts its own edge inside the bubble */}
        <motion.div
          className="relative"
          style={{ filter: 'drop-shadow(0 6px 18px rgba(22,50,79,0.16))' }}
          {...float(7, 6.5)}
        >
          <div className="absolute inset-0 opacity-[0.84]" aria-hidden>
            <div className="absolute inset-0 rounded-[999px] bg-white" />
            {PUFFS.map((c, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  left: `${c.x}%`,
                  top: `${c.y}%`,
                  width: `${c.s}%`,
                  paddingBottom: `${c.s}%`,
                  height: 0,
                }}
              />
            ))}
          </div>
          <p className="relative px-10 py-9 sm:px-12 sm:py-10 text-base sm:text-lg md:text-xl font-medium text-ink leading-relaxed">
            Pravimo sajtove koji pretvaraju posetioce u kupce — jasan dogovor, fiksan rok
            i sajt koji radi za vas svaki dan.
          </p>
        </motion.div>
      </motion.div>

      {/* the thought trail: three puffs shrinking toward whoever is doing the thinking */}
      <motion.div
        className="mt-4 flex flex-col items-center gap-2"
        aria-hidden
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-90px' }}
        transition={{ duration: 0.5, delay: 0.28 }}
      >
        {/* white on a pale sky is invisible — the trail needs the same lift the bubble has,
            otherwise the thought reads as a gap rather than as a thought */}
        {[16, 11, 7].map((size, i) => (
          <motion.span
            key={size}
            className="block rounded-full bg-white/[0.88]"
            style={{
              width: size, height: size,
              filter: 'drop-shadow(0 3px 8px rgba(22,50,79,0.20))',
            }}
            {...float(3.5, 5.2, i * 0.35)}
          />
        ))}
      </motion.div>

      {/* ...the character */}
      <motion.div
        className="mt-4"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-90px' }}
        transition={{ duration: 0.6, delay: 0.38 }}
      >
        <motion.div className="inline-block" {...float(6, 4.6, 0.6)}>
          <GlossyPill href={WA_LINK} className="px-8 sm:px-10 py-2.5 sm:py-3 text-base sm:text-lg">
            Započnite razgovor
          </GlossyPill>
        </motion.div>
      </motion.div>
    </div>
  )
}
