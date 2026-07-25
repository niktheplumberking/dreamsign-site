// Scene 6 — „Sletanje". The descent lands: the plain in sight, then the Galaxy white-fade
// settles the page onto paper, where the pen signs and the WhatsApp button waits.
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { useReducedMotionSafe, WA_LINK } from '../../lib/hooks'

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.6, delay: 0.15 * i },
})

export default function Finale() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotionSafe()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '-8%'])

  return (
    <section ref={ref} className="relative z-[50] -mt-[20vh] overflow-hidden">
      {/* the land in sight */}
      <motion.img
        src="/media/landing-plain.webp" alt=""
        className="absolute inset-0 h-[120%] w-full object-cover object-center"
        style={reduced ? undefined : { y: bgY }}
      />
      {/* Galaxy white-fade — the page touches paper */}
      <div className="absolute inset-x-0 bottom-0 h-[420px] bg-gradient-to-b from-transparent via-[#FDFEFFcc] to-[#F5F9FD]" />

      <div className="relative mx-auto max-w-3xl px-5 sm:px-6 pt-[46vh] pb-24 text-center">
        <motion.h2 {...fadeUp(0)} className="font-semibold tracking-tight text-ink text-2xl md:text-[40px]">
          Dva klika do razgovora.
        </motion.h2>
        <motion.p {...fadeUp(1)} aria-hidden className="mt-3 font-script text-accent leading-tight text-[clamp(2.6rem,6vw,4rem)]"
                  style={{ textShadow: '0 1px 0 currentColor' }}>
          Potpišite svoj san
        </motion.p>
        {/* the pen signs — once, when the moment arrives */}
        <svg viewBox="0 0 520 54" fill="none" className="mx-auto -mt-1 w-[min(72%,420px)]" aria-hidden>
          <motion.path
            d="M14 36 C 120 52, 300 48, 380 22 C 420 10, 460 26, 506 14"
            stroke="#2458A6" strokeWidth="3.5" strokeLinecap="round"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
        <motion.div {...fadeUp(2)}>
          <a href={WA_LINK} target="_blank" rel="noopener"
             className="cta-glow mt-9 inline-block rounded-full bg-accent text-bg font-medium text-[17px] px-10 py-4">
            Započnite razgovor
          </a>
        </motion.div>
        <motion.p {...fadeUp(3)} className="mt-5 text-[13.5px] font-medium text-ink/50">
          ili pozovite <a href="tel:+381637736963" className="text-accent/80 hover:text-accent">+381 63 773 6963</a>
        </motion.p>
      </div>
    </section>
  )
}
