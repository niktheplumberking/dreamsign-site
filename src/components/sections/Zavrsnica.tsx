// The page close on the white ground the stats created — the only addition beyond the
// replicated skeleton (a site must convert and end): script line, signature, CTA, tel.
//
// The signature is a real pen stroke, not a rule: a filled, tapered ribbon that comes to a
// point at both ends and swells where a hand would press, drawn left-to-right BY THE SCROLL
// (it reads the world's one progress value through useWorldRange — no second useScroll).
import { useRef } from 'react'
import { motion, useTransform } from 'motion/react'
import { WA_LINK } from '../../lib/hooks'
import { GlossyPill } from '../Nav'
import { useWorld, useWorldRange } from '../World'
import { SIGNATURE_STROKE, SIGNATURE_SWEEP, SIGNATURE_VIEWBOX } from '../../lib/marks'

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.6, delay: 0.15 * i },
})

export default function Zavrsnica() {
  const ref = useRef<HTMLDivElement>(null)
  const { p, reduced } = useWorld()
  const [enter, exit] = useWorldRange(ref)
  const drawn = useTransform(p, [enter, exit], [0, 1], { clamp: true })
  // the clip that walks the nib across the page
  const inked = useTransform(drawn, (v) => SIGNATURE_SWEEP * v)

  return (
    <div ref={ref} className="relative px-5 sm:px-6 pb-24 pt-4 text-center">
      <motion.p
        {...fadeUp(0)}
        aria-hidden
        className="font-script text-accent leading-tight text-[clamp(2.4rem,5.5vw,3.8rem)]"
        style={{ textShadow: '0 1px 0 currentColor' }}
      >
        Potpišite svoj san
      </motion.p>

      <svg
        viewBox={SIGNATURE_VIEWBOX}
        className="mx-auto -mt-2 w-[min(72%,420px)] overflow-visible"
        aria-hidden
      >
        <defs>
          <clipPath id="ds-sign-clip">
            {/* reduced motion gets the finished signature, not a half-written one */}
            <motion.rect x="-8" y="-16" height="92" width={reduced ? SIGNATURE_SWEEP : inked} />
          </clipPath>
        </defs>
        <g clipPath="url(#ds-sign-clip)" fill="#2458A6">
          <path d={SIGNATURE_STROKE} />
        </g>
      </svg>

      <motion.div {...fadeUp(1)}>
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

      <motion.p {...fadeUp(2)} className="mt-5 text-[13.5px] font-medium text-ink/50">
        ili pozovite <a href="tel:+381637736963" className="text-accent/80 hover:text-accent">+381 63 773 6963</a>
      </motion.p>
    </div>
  )
}
