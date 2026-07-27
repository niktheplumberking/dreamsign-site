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

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.6, delay: 0.15 * i },
})

/** One confident stroke: a point going down, pressure through the belly, and off the
    page in a thin rising flick — the weight change is what reads as a nib rather than
    a rule. Both ends close on themselves, so the ink genuinely tapers to nothing. */
const STROKE =
  'M 8 40 C 64 24, 146 19, 226 28 C 296 36, 358 45, 416 33 C 452 25, 482 15, 515 2 ' +
  'C 486 17, 456 27, 414 37 C 356 51, 294 42, 225 34 C 145 25, 64 30, 8 40 Z'

const VB_W = 520

export default function Zavrsnica() {
  const ref = useRef<HTMLDivElement>(null)
  const { p, reduced } = useWorld()
  const [enter, exit] = useWorldRange(ref)
  const drawn = useTransform(p, [enter, exit], [0, 1], { clamp: true })
  // the clip that walks the nib across the page
  const inked = useTransform(drawn, (v) => VB_W * 1.06 * v)

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
        viewBox="0 0 520 60"
        className="mx-auto -mt-2 w-[min(72%,420px)] overflow-visible"
        aria-hidden
      >
        <defs>
          <clipPath id="ds-sign-clip">
            {/* reduced motion gets the finished signature, not a half-written one */}
            <motion.rect x="-8" y="-16" height="92" width={reduced ? VB_W * 1.06 : inked} />
          </clipPath>
        </defs>
        <g clipPath="url(#ds-sign-clip)" fill="#2458A6">
          <path d={STROKE} />
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
