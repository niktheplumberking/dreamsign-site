// GALAXY HOME STRUCTURAL REPLICA — Section 2: Hero (full viewport, 4 parallax layers).
// Exact offsets/values from the prompt; assets/palette/content are the only swaps.
// L1 sky (z-0, y 0→8%) · L2 title (z-10, clamp(3rem,14vw,14rem), gradient clip, blend) ·
// L3 subtexts (z-20, exact positions) · L4 foreground cloud-bank = "building" (z-30, same y).
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { useReducedMotionSafe } from '../../lib/hooks'

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotionSafe()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '8%'])

  return (
    <section ref={ref} className="relative h-screen w-full overflow-hidden z-10">
      {/* Layer 1 (z-0) — sky background */}
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

      {/* Layer 2 (z-10) — title text, gradient-clipped, blended into the layers */}
      <div className="relative z-10 flex justify-center pt-[22vh] md:pt-32 lg:pt-36">
        <div
          aria-hidden
          className="text-[clamp(3rem,14vw,14rem)] font-semibold leading-none whitespace-nowrap bg-clip-text text-transparent mix-blend-multiply select-none"
          style={{ backgroundImage: 'linear-gradient(to bottom, #16324F, #6FA5D8)' }}
        >
          Dream<span className="font-script font-normal">Sign</span>
        </div>
      </div>

      {/* Layer 3 (z-20) — subtexts at exact positions */}
      <p className="hidden md:block absolute z-20 left-6 top-[200px] md:left-12 md:top-[320px] lg:left-24 text-lg md:text-[22px] md:leading-6 font-medium text-ink/70 mix-blend-multiply">
        Iznad oblaka
      </p>
      <p className="hidden md:block absolute z-20 right-6 top-[200px] md:right-12 md:top-[320px] lg:right-24 text-lg md:text-[22px] md:leading-6 font-medium text-ink">
        Snovi postaju realnost.
      </p>

      {/* Layer 4 (z-30) — the cloud bank, our "building": full-bleed, same parallax */}
      <motion.img
        src="/media/hero-cloud-fg-frame.webp" alt=""
        className="absolute inset-0 h-[120%] w-full object-cover object-bottom z-30 pointer-events-none select-none"
        style={reduced ? undefined : { y: bgY }}
      />
    </section>
  )
}
