// Scene 4 — Radovi teaser. M08 slide-over: Usluge's stage waits pinned while this world
// rises over it (Galaxy negative-overlap grammar). Honest empty-state — real content law.
import { motion } from 'motion/react'
import { WA_LINK } from '../../lib/hooks'

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.6, delay: 0.15 * i },
})

export default function Radovi() {
  return (
    <div className="relative z-[45] -mt-[100vh] min-h-screen rounded-t-[2.5rem] bg-bg shadow-[0_-24px_60px_rgba(22,50,79,0.10)] overflow-hidden">
      {/* the brand ticker breathes behind (marquee mechanic, 60s linear) */}
      <div aria-hidden className="pointer-events-none select-none absolute top-10 left-0 flex w-max opacity-[0.05] animate-[dsmarquee_60s_linear_infinite]">
        <span className="font-script text-accent text-[11rem] leading-none whitespace-nowrap pr-24">DreamSign DreamSign DreamSign</span>
        <span className="font-script text-accent text-[11rem] leading-none whitespace-nowrap pr-24">DreamSign DreamSign DreamSign</span>
      </div>
      <style>{`@keyframes dsmarquee { to { transform: translateX(-50%); } }`}</style>

      <div className="relative mx-auto max-w-5xl px-5 sm:px-6 py-24 md:py-32 text-center">
        <motion.h2 {...fadeUp(0)} className="font-semibold tracking-tight text-ink text-2xl md:text-[40px] md:leading-[44px]">
          Rezultati se vide.
        </motion.h2>
        <motion.p {...fadeUp(1)} className="mt-4 text-[17px] text-ink/70 max-w-xl mx-auto">
          Svaki sajt koji izgradimo ima jedan zadatak — da nekome dovede kupce.
        </motion.p>
        <motion.div {...fadeUp(2)} className="mt-12 mx-auto max-w-2xl rounded-[1.75rem] border border-mist/70 bg-tint/50 px-8 py-14">
          <img src="/media/brand/cloud-d.webp" alt="" className="mx-auto h-20 w-auto opacity-80" />
          <p className="mt-6 font-semibold text-ink text-xl">Prvi radovi upravo stižu.</p>
          <p className="mt-2 text-[15px] text-ink/65 max-w-md mx-auto">
            Vaš projekat može biti među njima — i biti prvi kojim se hvalimo.
          </p>
          <a href={WA_LINK} target="_blank" rel="noopener"
             className="mt-8 inline-block rounded-full border border-accent/50 text-accent font-medium text-[15px] px-7 py-3 transition-colors hover:bg-accent hover:text-bg">
            Budite prvi — javite se
          </a>
        </motion.div>
      </div>
    </div>
  )
}
