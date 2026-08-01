// GALAXY HOME STRUCTURAL REPLICA — Section 4: Content/Description block (inside mountain wrapper).
//
// Batch 4 reverted the cloud bubble (batch 3) on Nick's call: the text stands free again,
// as it did originally. What SURVIVES from the thought experiment, by his explicit list:
// the three shrinking trail puffs between text and button, and the floating idle on both —
// the button still quietly "thinks" the sentence above it, without the balloon.
import { motion } from 'motion/react'
import { useReducedMotionSafe, WA_LINK } from '../../lib/hooks'
import { GlossyPill } from '../Nav'
import { bk } from '../../lib/content'
import { EditableText } from '../../ok/OwnersKey'

export default function Opis() {
  const reduced = useReducedMotionSafe()

  /** a slow idle drift — what makes it read as alive rather than placed */
  const float = (amount: number, seconds: number, delay = 0) =>
    reduced
      ? {}
      : {
          animate: { y: [0, -amount, 0] },
          transition: { duration: seconds, repeat: Infinity, ease: 'easeInOut' as const, delay },
        }

  return (
    <div className="flex flex-col items-center px-5 sm:px-6 py-16 md:py-32 text-center">
      <motion.div
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-90px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.p
          className="max-w-[600px] text-base sm:text-lg md:text-xl font-medium text-ink leading-relaxed"
          style={{ textShadow: '2px 4px 26px rgba(245, 249, 253, 0.9)' }}
          {...float(7, 6.5)}
        >
          <EditableText k="opis-tekst">
            {bk('opis-tekst', 'Pravimo sajtove koji pretvaraju posetioce u kupce — jasan dogovor, fiksan rok i sajt koji radi za vas svaki dan.')}
          </EditableText>
        </motion.p>
      </motion.div>

      {/* the three thought puffs — kept from the bubble experiment on Nick's list */}
      <motion.div
        className="mt-5 flex flex-col items-center gap-2"
        aria-hidden
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-90px' }}
        transition={{ duration: 0.5, delay: 0.28 }}
      >
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

      <motion.div
        className="mt-5"
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
