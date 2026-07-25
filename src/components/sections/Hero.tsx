// Scene 1 — „Iznad oblaka" · M7 z-sandwich hero (total-spec.md, Galaxy Home grammar, own world).
// Layers: sky video z-0 → giant cloud wordmark z-10 → side floats z-20 → foreground bank z-30 → content z-40.
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { useReducedMotionSafe, WA_LINK } from '../../lib/hooks'
import { EASE_B } from '../../lib/motion'

export default function Hero({ started }: { started: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotionSafe()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '8%'])

  const stagger = (i: number) => ({
    initial: { opacity: 0, y: 24, filter: 'blur(4px)' },
    animate: started ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {},
    transition: { duration: 0.7, delay: 0.15 * i, ease: EASE_B },
  })

  return (
    <section ref={ref} className="relative h-screen w-full overflow-hidden" id="vrh">
      {/* z-0 — the living sky */}
      {reduced ? (
        <img src="/media/hero-sky-poster.jpg" alt="" className="absolute inset-0 h-[120%] w-full object-cover z-0" />
      ) : (
        <motion.video
          src="/media/hero-sky-loop.mp4" poster="/media/hero-sky-poster.jpg"
          autoPlay muted loop playsInline preload="metadata"
          className="absolute inset-0 h-[120%] w-full object-cover z-0"
          style={{ y: bgY }}
        />
      )}

      {/* z-10 — the giant cloud-built wordmark, INSIDE the world */}
      <div aria-hidden className="absolute inset-x-0 top-[18vh] md:top-[13vh] z-10 flex items-start justify-center select-none pointer-events-none">
        <div className="flex items-center">
          <img src="/media/brand/cloud-dream.webp" alt="" className="w-[min(78vw,340px)] md:w-[min(44vw,600px)] h-auto" />
          <span
            className="font-script text-accent leading-none -ml-[0.10em] translate-y-[0.09em] text-[clamp(3.4rem,10.5vw,9.5rem)]"
            style={{ textShadow: '0 2px 0 currentColor' }}
          >
            Sign
          </span>
        </div>
      </div>

      {/* z-20 — floating side lines */}
      <motion.p {...stagger(2)} className="hidden md:block absolute left-12 lg:left-24 top-[46vh] z-20 text-[19px] font-medium text-ink/60">
        Iznad oblaka
      </motion.p>
      <motion.p {...stagger(2)} className="hidden md:block absolute right-12 lg:right-24 top-[46vh] z-20 text-[19px] font-medium text-ink/80">
        Snovi postaju realnost.
      </motion.p>

      {/* z-30 — the foreground cloud bank drifts OVER the wordmark's lower edge */}
      <motion.img
        src="/media/hero-cloud-foreground.webp" alt=""
        className="absolute bottom-[-14%] left-[-4%] w-[108%] max-w-none z-30 pointer-events-none select-none"
        style={reduced ? undefined : { y: bgY }}
      />

      {/* z-40 — the selling content */}
      <div className="absolute inset-x-0 bottom-0 z-40 flex flex-col items-center text-center px-6 pb-[9vh]">
        <motion.h1 {...stagger(0)} className="font-semibold tracking-[-0.02em] leading-[1.04] text-ink text-[clamp(1.85rem,3.6vw,2.9rem)] max-w-3xl [text-wrap:balance]">
          Pravimo sajtove koji pretvaraju posetioce u kupce.
        </motion.h1>
        <motion.p {...stagger(1)} className="mt-4 text-[17px] leading-relaxed text-ink/75 max-w-xl">
          Mi pretvaramo vaše poslovne snove u realnost, a na vama je da potpisujete ugovore.
        </motion.p>
        <motion.div {...stagger(2)}>
          <a href={WA_LINK} target="_blank" rel="noopener"
             className="cta-glow mt-7 inline-block rounded-full bg-accent text-bg font-medium text-[17px] px-9 py-3.5">
            Započnite razgovor
          </a>
        </motion.div>
      </div>
    </section>
  )
}
