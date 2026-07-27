// GALAXY HOME STRUCTURE — Hero: 4 parallax layers, driven by the ONE world scroll progress.
// L1 sky video (poster fallback) · L2 the CLOUD wordmark blended into the sky ·
// L3 side subtexts · L4 the foreground cloud bank drifting over the wordmark's base.
import { motion, useTransform } from 'motion/react'
import { useWorld } from '../World'

export default function Hero() {
  const { p, reduced, vh } = useWorld()
  const skyY = useTransform(p, [0, vh], ['0%', '8%'])
  const fgY = useTransform(p, [0, vh], ['0%', '15%']) // the bank runs faster than the sky

  return (
    <section data-beat="hero" className="relative h-screen w-full overflow-hidden z-10">
      {/* Layer 1 (z-0) — the sky. A still frame of styleframe 1B, not the loop: the loop's
          6s cut snapped back visibly. It keeps the parallax drift, so the hero still breathes. */}
      <motion.img
        src="/media/hero-sky-still.webp" alt=""
        className="absolute inset-0 h-[120%] w-full object-cover z-0"
        style={reduced ? undefined : { y: skyY }}
      />

      {/* Layer 2 (z-10) — the wordmark: cloud-built "Dream" + hand-signed "Sign", one word.
          Sits low enough that the foreground bank (z-30) closes over its base. */}
      <div className="relative z-10 flex justify-center pt-[27vh] md:pt-[25vh] lg:pt-[25vh]">
        <div
          aria-hidden
          className="flex items-baseline whitespace-nowrap select-none leading-none text-[clamp(3.6rem,14vw,14rem)]"
        >
          <img
            src="/media/brand/cloud-dream.webp" alt=""
            className="h-[0.74em] w-auto max-w-none"
            style={{ mixBlendMode: 'hard-light', filter: 'drop-shadow(0 2px 7px rgba(22,50,79,0.20))' }}
          />
          {/* `background-clip: text` paints the gradient only where the element's own box
              reaches — and Great Vibes throws the S's flag above it and the g's tail below.
              Those parts were getting no paint at all, which read as the letters being cut.
              The padding grows the painted box; the equal negative margins keep the layout
              and the baseline exactly where they were. */}
          <span
            className="font-script font-normal text-[1.12em] ml-[-0.11em] bg-clip-text text-transparent mix-blend-multiply"
            style={{
              backgroundImage: 'linear-gradient(to bottom, #16324F, #6FA5D8)',
              lineHeight: 1,
              paddingTop: '0.5em',
              paddingBottom: '0.5em',
              marginTop: '-0.5em',
              marginBottom: '-0.5em',
            }}
          >
            Sign
          </span>
        </div>
      </div>

      {/* Layer 3 (z-20) — subtexts at their exact positions */}
      <p className="hidden md:block absolute z-20 left-6 top-[200px] md:left-12 md:top-[500px] lg:left-24 text-lg md:text-[22px] md:leading-6 font-medium text-ink/70 mix-blend-multiply">
        Iznad oblaka
      </p>
      <p className="hidden md:block absolute z-20 right-6 top-[200px] md:right-12 md:top-[500px] lg:right-24 text-lg md:text-[22px] md:leading-6 font-medium text-ink">
        Snovi postaju realnost.
      </p>

      {/* Layer 4 (z-30) — the cloud bank, our "building": drifts over the wordmark's base.
          Top alpha ramp baked into the asset: at narrow crops its frame edge was a hard line. */}
      <motion.img
        src="/media/hero-bank-fade.webp" alt=""
        className="absolute left-0 right-0 -top-[8%] h-[126%] w-full object-cover object-bottom z-30 pointer-events-none select-none"
        style={reduced ? undefined : { y: fgY }}
      />
    </section>
  )
}
