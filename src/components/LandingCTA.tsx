// The daylight landing — the house CTA finale every page descends into (build-spec sitewide
// law: white-fade onto the paper zone, the stroke signs, the pill waits). Same grammar as
// the homepage's Zavrsnica, parameterized for each page's own closing line.
import { useRef } from 'react'
import { motion, useTransform } from 'motion/react'
import { WA_LINK } from '../lib/hooks'
import { GlossyPill } from './Nav'
import { useWorld, useWorldRange } from './World'
import { SIGNATURE_STROKE, SIGNATURE_SWEEP, SIGNATURE_VIEWBOX } from '../lib/marks'

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.6, delay: 0.15 * i },
})

export default function LandingCTA({
  script,
  lead,
  clipId,
}: {
  /** the Great Vibes closing line (short — the script never carries a paragraph) */
  script: string
  /** optional plain lead sentence above the script line */
  lead?: string
  /** unique clip-path id per page (SVG ids are document-global) */
  clipId: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { p, reduced } = useWorld()
  const [enter, exit] = useWorldRange(ref)
  const drawn = useTransform(p, [enter, exit], [0, 1], { clamp: true })
  // the clip that walks the nib across the page
  const inked = useTransform(drawn, (v) => SIGNATURE_SWEEP * v)

  return (
    <div ref={ref} className="relative px-5 sm:px-6 pb-24 pt-4 text-center">
      {lead && (
        <motion.p
          {...fadeUp(0)}
          className="mx-auto max-w-[38ch] text-balance font-medium text-ink/80
                     text-[clamp(1.05rem,2vw,1.4rem)] leading-relaxed"
        >
          {lead}
        </motion.p>
      )}

      <motion.p
        {...fadeUp(lead ? 1 : 0)}
        aria-hidden
        className={`font-script text-accent leading-tight text-[clamp(2.4rem,5.5vw,3.8rem)] ${lead ? 'mt-3' : ''}`}
        style={{ textShadow: '0 1px 0 currentColor' }}
      >
        {script}
      </motion.p>

      <svg
        viewBox={SIGNATURE_VIEWBOX}
        className="mx-auto -mt-2 w-[min(72%,420px)] overflow-visible"
        aria-hidden
      >
        <defs>
          <clipPath id={clipId}>
            {/* reduced motion gets the finished signature, not a half-written one */}
            <motion.rect x="-8" y="-16" height="92" width={reduced ? SIGNATURE_SWEEP : inked} />
          </clipPath>
        </defs>
        <g clipPath={`url(#${clipId})`} fill="#2458A6">
          <path d={SIGNATURE_STROKE} />
        </g>
      </svg>

      <motion.div {...fadeUp(lead ? 2 : 1)}>
        {/* the button breathes — small enough to feel alive, not enough to nag */}
        <motion.div
          animate={reduced ? undefined : { y: [0, -7, 0] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
          className="inline-block"
        >
          <GlossyPill href={WA_LINK} className="mt-8 px-8 sm:px-10 py-2.5 sm:py-3 text-base sm:text-lg">
            Započnite razgovor
          </GlossyPill>
        </motion.div>
      </motion.div>

      <motion.p {...fadeUp(lead ? 3 : 2)} className="mt-5 text-[13.5px] font-medium text-ink/50">
        ili pozovite <a href="tel:+381637736963" className="text-accent/80 hover:text-accent">+381 63 773 6963</a>
      </motion.p>
    </div>
  )
}
