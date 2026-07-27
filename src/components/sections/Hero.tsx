// GALAXY HOME STRUCTURE — Hero: parallax layers driven by the ONE world scroll progress.
// L1 sky · L2 the page's h1 and its one supporting line · L3 the foreground cloud bank.
//
// Batch 3: the cloud "DreamSign" wordmark is gone from the hero. It was beautiful and it was
// also the largest thing on the page saying nothing a search engine can rank — the brand is
// carried by the nav, the entrance and the footer instead. What sits here now is the h1, and
// it is deliberately short: the primary term ("izrada sajtova") plus what the visitor gets.
// The two floating side lines are gone too — they were absolutely positioned, `hidden` below
// md, and said nothing concrete; their job is done by one centred line nobody can miss.
import { motion, useTransform } from 'motion/react'
import { useWorld } from '../World'

/** the copy carries its own legibility over the sky — no panel, no scrim */
const GLOW = { textShadow: '0 2px 26px rgba(245,249,253,0.95), 0 0 10px rgba(245,249,253,0.85)' }

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

      {/* Layer 2 (z-10) — what the page is about, in as few words as it can be said.
          Sits high enough that the foreground bank never climbs over the type. */}
      <div className="relative z-10 flex flex-col items-center px-5 sm:px-6 pt-[19vh] md:pt-[18vh] text-center">
        <h1
          className="max-w-[16ch] text-balance font-semibold tracking-tight text-ink leading-[1.02]
                     text-[clamp(2.7rem,8.2vw,6.4rem)]"
          style={GLOW}
        >
          Izrada sajtova koji prodaju
        </h1>
        <p
          className="mt-5 sm:mt-6 max-w-[46ch] text-balance font-medium text-ink/85
                     text-[clamp(1rem,1.9vw,1.35rem)] leading-relaxed"
          style={GLOW}
        >
          Moderni sajtovi za firme u Srbiji — sa ugovorom, jasnim rokom i bez skrivenih troškova.
        </p>
      </div>

      {/* Layer 3 (z-30) — the cloud bank, our "building". Top alpha ramp baked into the asset:
          at narrow crops its frame edge was a hard line. */}
      <motion.img
        src="/media/hero-bank-fade.webp" alt=""
        className="absolute left-0 right-0 -top-[8%] h-[126%] w-full object-cover object-bottom z-30 pointer-events-none select-none"
        style={reduced ? undefined : { y: fgY }}
      />
    </section>
  )
}
