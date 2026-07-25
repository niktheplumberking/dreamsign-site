// The page close on the white ground the stats created — the only addition beyond the
// replicated skeleton (a site must convert and end): script line, signature, CTA, tel.
import { motion } from 'motion/react'
import { WA_LINK } from '../../lib/hooks'
import { GlossyPill } from '../Nav'

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.6, delay: 0.15 * i },
})

export default function Zavrsnica() {
  return (
    <div className="relative px-5 sm:px-6 pb-24 pt-4 text-center">
      <motion.p {...fadeUp(0)} aria-hidden className="font-script text-accent leading-tight text-[clamp(2.4rem,5.5vw,3.8rem)]"
                style={{ textShadow: '0 1px 0 currentColor' }}>
        Potpišite svoj san
      </motion.p>
      <svg viewBox="0 0 520 54" fill="none" className="mx-auto -mt-1 w-[min(72%,420px)]" aria-hidden>
        <motion.path
          d="M14 36 C 120 52, 300 48, 380 22 C 420 10, 460 26, 506 14"
          stroke="#2458A6" strokeWidth="3.5" strokeLinecap="round"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <motion.div {...fadeUp(1)}>
        <GlossyPill href={WA_LINK} className="mt-8 px-8 sm:px-10 py-2.5 sm:py-3 text-base sm:text-lg">
          Započnite razgovor
        </GlossyPill>
      </motion.div>
      <motion.p {...fadeUp(2)} className="mt-5 text-[13.5px] font-medium text-ink/50">
        ili pozovite <a href="tel:+381637736963" className="text-accent/80 hover:text-accent">+381 63 773 6963</a>
      </motion.p>
    </div>
  )
}
