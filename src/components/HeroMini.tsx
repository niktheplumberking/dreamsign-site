// The inner-page sky-hero z-sandwich mini (build-spec sitewide motion law): 60–70vh, the
// page title gradient-clipped between the sky backdrop and the foreground cloud bank —
// REUSING the homepage hero's assets, zero extra credits. Same layer grammar, smaller stage.
// The page's single h1 lives here.
import { motion, useTransform } from 'motion/react'
import { useWorld } from './World'

/** the copy carries its own legibility over the sky — no panel, no scrim (hero grammar) */
export const GLOW = { textShadow: '0 2px 26px rgba(245,249,253,0.95), 0 0 10px rgba(245,249,253,0.85)' }

export default function HeroMini({
  title,
  script,
  scriptAbove,
  sub,
  compact = false,
}: {
  /** the h1 — gradient-clipped Inter Tight 600 */
  title: string
  /** optional Great Vibes answer under the title (part of the same h1, like the homepage) */
  script?: string
  /** optional Great Vibes greeting ABOVE the title (Kontakt: „Dobar dan.") — decorative */
  scriptAbove?: string
  /** optional one supporting line under the title block */
  sub?: string
  /** Kontakt: a slightly shorter stage — the page below is one beat */
  compact?: boolean
}) {
  const { p, reduced, vh } = useWorld()
  const skyY = useTransform(p, [0, vh], ['0%', '8%'])
  const fgY = useTransform(p, [0, vh], ['0%', '15%']) // the bank runs faster than the sky

  return (
    <section
      data-beat="hero"
      className={`relative w-full overflow-hidden z-10 ${compact ? 'h-[58vh] min-h-[420px]' : 'h-[66vh] min-h-[480px]'}`}
    >
      <motion.img
        src="/media/hero-sky-still.webp" alt=""
        className="absolute inset-0 h-[120%] w-full object-cover z-0"
        style={reduced ? undefined : { y: skyY }}
      />

      <div className="relative z-40 flex flex-col items-center px-5 sm:px-6 pt-[24vh] md:pt-[22vh] text-center">
        {scriptAbove && (
          <p
            aria-hidden
            className="font-script font-normal text-accent leading-none text-[clamp(1.9rem,4.6vw,3.4rem)] mb-[0.2em]"
            style={GLOW}
          >
            {scriptAbove}
          </p>
        )}
        <h1 className="leading-none">
          <span
            className="block font-semibold tracking-tight text-[clamp(2.5rem,9vw,7rem)]
                       bg-clip-text text-transparent [text-wrap:balance]"
            style={{
              backgroundImage: 'linear-gradient(to bottom, #16324F 30%, #2E5F9E 100%)',
              // gradient-clip paints only the element's own box — the batch-2 hero scar:
              // padding grows the painted box, margins hand the layout back
              padding: '0.25em 0.1em',
              margin: '-0.25em -0.1em',
            }}
          >
            {title}
          </span>
          {script && (
            <span
              className="block font-script font-normal text-accent
                         text-[clamp(2rem,5.6vw,4.4rem)] mt-[0.06em]"
              style={GLOW}
            >
              {script}
            </span>
          )}
        </h1>
        {sub && (
          <p
            className="mt-5 sm:mt-6 max-w-[46ch] text-balance font-medium text-ink/85
                       text-[clamp(1rem,1.9vw,1.3rem)] leading-relaxed"
            style={GLOW}
          >
            {sub}
          </p>
        )}
      </div>

      {/* the foreground bank closes over the title's base — the mini z-sandwich. Anchored
          to the section's own bottom edge (like the full hero at load), so the section
          never clips the bank mid-cloud into a hard line; the SeamBridge below the mini
          carries the junction, homepage grammar. */}
      <motion.img
        src="/media/hero-bank-fade.webp" alt=""
        className="absolute left-0 right-0 bottom-[-2%] h-[96%] w-full object-cover object-bottom z-30 pointer-events-none select-none"
        style={reduced ? undefined : { y: fgY }}
      />
    </section>
  )
}
