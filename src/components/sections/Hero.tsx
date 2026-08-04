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
import { bk } from '../../lib/content'
import { EditableText } from '../../ok/OwnersKey'
import { WA_LINK } from '../../lib/hooks'
import CloudButton from '../CloudButton'

import { TRUST_ROW } from '../../lib/trust'

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

      {/* Layer 2 (z-10) — the Galaxy Home centrepiece geometry (batch 4): one giant
          gradient-clipped line in the primary face, with the script answering underneath —
          the same primary/script duet as the logo. Still ONE h1: the search engine reads
          "Izrada sajtova koji prodaju" whole; the fonts split it for humans. */}
      {/* batch 5: lowered — halfway between the old seat (17/15vh) and a true vertical
          centre. batch 6: z-40, ABOVE the foreground bank (z-30), so the supporting line
          reads on top of the cloud instead of being swallowed by it. */}
      <div className="relative z-40 flex flex-col items-center px-5 sm:px-6 pt-[23vh] md:pt-[21vh] text-center">
        <h1 className="leading-none">
          {/* gradient-clip paints only the element's own box, and j/y descend past it —
              the batch-2 hero scar. Padding grows the painted box; margins hand it back. */}
          <span
            className="block whitespace-nowrap font-semibold tracking-tight
                       text-[clamp(2.6rem,9vw,7.5rem)] bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(to bottom, #16324F 30%, #2E5F9E 100%)',
              padding: '0.25em 0.1em',
              margin: '-0.25em -0.1em',
            }}
          >
            <EditableText k="hero-naslov">{bk('hero-naslov', 'Izrada sajtova')}</EditableText>
          </span>
          <span
            aria-hidden={false}
            // batch 15: grown to fill the primary line's width (owner's note), from 7vw
            className="block font-script font-normal text-accent
                       text-[clamp(3.1rem,10.6vw,8.4rem)] mt-[0.02em] leading-[0.95]"
            style={GLOW}
          >
            <EditableText k="hero-naslov-script">{bk('hero-naslov-script', 'koji prodaju')}</EditableText>
          </span>
        </h1>
        <p
          className="mt-6 sm:mt-7 max-w-[46ch] text-balance font-medium text-ink/85
                     text-[clamp(1rem,1.9vw,1.35rem)] leading-relaxed"
          style={GLOW}
        >
          <EditableText k="hero-podnaslov">
            {bk('hero-podnaslov', 'Moderni sajtovi za firme širom Balkana — sa ugovorom, jasnim rokom i bez skrivenih troškova.')}
          </EditableText>
        </p>

        {/* batch 15/16 — the cloud CTA; its gap to the subtitle mirrors the subtitle's own
            gap to „koji prodaju" (the puff carries ~26px of transparent air on top, so the
            margin compensates to make the VISIBLE gaps read equal) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          // batch 17: seated lower into the bank, inside Nick's red box
          className="mt-6 flex flex-col items-center sm:mt-9"
        >
          <CloudButton label="Započnite razgovor" href={WA_LINK} reduced={reduced} />
          {/* phones: the facts stay in flow under the cloud — at the hero's base they
              collided with the next beat's overlapping headline */}
          <ul className="mt-1 flex max-w-[20rem] flex-wrap items-center justify-center gap-x-3 gap-y-1 px-2 sm:hidden" style={GLOW}>
            {TRUST_ROW.map((t, i) => (
              <li key={t} className="flex items-center gap-x-3">
                <span className="whitespace-nowrap text-[10.5px] font-semibold uppercase tracking-[0.1em] text-ink">{t}</span>
                {i < TRUST_ROW.length - 1 && <span aria-hidden className="h-1 w-1 shrink-0 rounded-full bg-ink/40" />}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* batch 16 — the four true facts ride the hero's base line (Nick's two yellow
          rules): one centred row, small quiet dots between them, homepage-slider style */}
      <motion.ul
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.75 }}
        className="absolute inset-x-0 bottom-[4.5vh] z-40 hidden flex-wrap items-center justify-center
                   gap-x-4 gap-y-1.5 px-4 sm:flex sm:gap-x-5"
        style={GLOW}
      >
        {TRUST_ROW.map((t, i) => (
          <li key={t} className="flex items-center gap-x-4 sm:gap-x-5">
            <span
              className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.12em] text-ink sm:text-[12.5px]"
              style={{ textShadow: '0 1px 14px rgba(255,255,255,0.98), 0 0 5px rgba(255,255,255,0.9)' }}
            >
              {t}
            </span>
            {i < TRUST_ROW.length - 1 && (
              <span aria-hidden className="h-1 w-1 shrink-0 rounded-full bg-ink/40" />
            )}
          </li>
        ))}
      </motion.ul>

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
