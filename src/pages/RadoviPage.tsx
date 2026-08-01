// /radovi — the portfolio as proof of results, not pictures (story-map). Build-spec law:
// hero mini („Radovi" / script „rezultati") → intro char-rise → M08 slide-over chain, each
// project a tall wrapper whose sticky plate the next one rises over, M5 parallax inside the
// frames → daylight landing CTA. Same descent, in miniature: starts high, lands on paper.
// Content = the three real sites (loaded and read before writing, batch 6) + the honest
// open slot. No invented figures anywhere (real-content law).
import { useRef } from 'react'
import { motion, useTransform } from 'motion/react'
import { World, WorldLayer, SeamBridge, Beat, useWorld, useWorldRange } from '../components/World'
import HeroMini from '../components/HeroMini'
import CharRise from '../components/CharRise'
import LandingCTA from '../components/LandingCTA'
import Ground from '../components/Ground'
import { MASK } from '../lib/masks'
import { WA_LINK } from '../lib/hooks'
import { usePageMeta } from '../lib/meta'
import { PAGE_SCHEMA } from '../lib/schema'

type Projekat = {
  name: string
  meta: string
  blurb: string
  href: string
  cover?: string
  /** the link label — external sites get their address, the open slot gets the CTA */
  linkLabel: string
}

const PROJEKTI: Projekat[] = [
  {
    name: 'Bennett & Co',
    meta: 'Brend + sajt · SAD',
    blurb: 'Studio za web dizajn — kompletan identitet i korporativni sajt.',
    href: 'https://www.bennettndco.com',
    cover: '/media/radovi/bennett.webp',
    linkLabel: 'bennettndco.com',
  },
  {
    name: 'Metal Kolor',
    meta: 'Web sajt · Srem',
    blurb: 'Farbara koja snabdeva majstore — katalog, galerija i kontakt.',
    href: 'https://metal-kolor.rs/',
    cover: '/media/radovi/metalkolor.webp',
    linkLabel: 'metal-kolor.rs',
  },
  {
    name: 'Pizzdarija',
    meta: 'Web sajt · Novi Sad',
    blurb: 'Picerija sa picom na drva — meni i porudžbina na dva klika.',
    href: 'https://www.pizzdarija.rs/',
    cover: '/media/radovi/pizzdarija.webp',
    linkLabel: 'pizzdarija.rs',
  },
  {
    name: 'Vaš projekat',
    meta: 'Slobodno mesto',
    blurb: 'Sledeći rad kojim se hvalimo može biti vaš — javite se.',
    href: WA_LINK,
    linkLabel: 'Započnite razgovor',
  },
]

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.6, delay: 0.12 * i },
})

/** one plate of the chain, in the descent's own flow. STICKY IS IMPOSSIBLE HERE and that
    is not a style choice: the World wrapper's overflow-hidden (which the masked layers
    require) disarms position:sticky on every descendant — the same physics that made the
    homepage descent replace the M08 pin grammar. The plates flow, the covers pan (M5),
    the editorial sides alternate. Logged as deviation D56. */
function Plate({ p, i }: { p: Projekat; i: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { p: world, reduced } = useWorld()
  const [enter, exit] = useWorldRange(ref, 1.05, 0.0)
  // M5 — the cover pans inside its frame while the plate is on stage
  const panY = useTransform(world, [enter, exit], ['0%', '-10%'])
  const flip = i % 2 === 1 // editorial asymmetry: text/image sides alternate

  return (
    <div ref={ref} className="relative">
      <div className="flex items-center py-10 md:py-[9vh]">
        <div
          className={`mx-auto grid w-full max-w-6xl items-center gap-8 px-5 sm:px-6 md:gap-14
                      md:grid-cols-[3fr_2fr] ${flip ? 'md:[direction:rtl]' : ''}`}
        >
          {/* the cover — hard rounded frame, hairline border (batch 8: no vignette on cards) */}
          <motion.a
            {...fadeUp(0)}
            href={p.href} target="_blank" rel="noopener"
            className={`group block [direction:ltr] overflow-hidden rounded-[1.25rem] border border-ink/10
                       shadow-[0_18px_60px_rgba(22,50,79,0.14)]
                       ${i % 2 ? 'rotate-[-1.15deg]' : 'rotate-[1.15deg]'} md:rotate-0`}
            aria-label={`${p.name} — otvorite sajt`}
          >
            {p.cover ? (
              <div className="relative h-[54vw] max-h-[430px] md:h-[64vh] md:max-h-[620px] overflow-hidden">
                <motion.img
                  src={p.cover}
                  alt={`${p.name} — prikaz sajta`}
                  decoding="async" loading={i === 0 ? 'eager' : 'lazy'}
                  className="absolute inset-0 h-[118%] w-full object-cover object-top
                             transition-transform duration-700 group-hover:scale-[1.025]"
                  style={reduced ? undefined : { y: panY }}
                />
              </div>
            ) : (
              /* the open slot — the strongest plate, not a pale ghost (batch 7 law) */
              <div
                className="relative flex h-[54vw] max-h-[430px] md:h-[64vh] md:max-h-[620px] items-center justify-center"
                style={{ background: 'linear-gradient(160deg, #7FB0DF 0%, #A8CEF0 55%, #DCEBF8 100%)' }}
              >
                <img
                  src="/media/brand/cloud-d.webp" alt="" aria-hidden
                  className="w-[38%] max-w-[240px] opacity-95 drop-shadow-[0_14px_40px_rgba(22,50,79,0.25)]"
                />
                <span className="liquid-glass absolute bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-5 py-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-ink/80">
                  Slobodno mesto
                </span>
              </div>
            )}
          </motion.a>

          {/* the words */}
          <div className="[direction:ltr]">
            <motion.p {...fadeUp(1)} className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ink/55">
              {String(i + 1).padStart(2, '0')} · {p.meta}
            </motion.p>
            <motion.h2 {...fadeUp(2)} className="mt-2 font-semibold tracking-tight text-ink text-[clamp(2rem,4.6vw,3.4rem)] leading-[1.02]">
              {p.name}
            </motion.h2>
            <motion.p {...fadeUp(3)} className="mt-4 max-w-[36ch] text-[16.5px] leading-relaxed text-ink/70">
              {p.blurb}
            </motion.p>
            <motion.p {...fadeUp(4)} className="mt-6">
              <a
                href={p.href} target="_blank" rel="noopener"
                className="group/l relative inline-flex items-center gap-2 pb-1.5
                           text-[13.5px] font-semibold uppercase tracking-[0.14em] text-accent
                           transition-colors duration-300 hover:text-ink"
              >
                {p.linkLabel}
                <span aria-hidden className="transition-transform duration-300 group-hover/l:translate-x-1 group-hover/l:-translate-y-0.5">↗</span>
                {/* the underline is desktop-only: on a phone this link spans >50% of the
                    pixel columns and ANY 1px rule under it — solid or faded — reads as a
                    section line to the junction rig (measured 120 solid, 18 faded) */}
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 hidden h-px md:block"
                  style={{
                    background:
                      'linear-gradient(to right, transparent, rgba(36,88,166,0.65) 22%, rgba(36,88,166,0.65) 78%, transparent)',
                  }}
                />
              </a>
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RadoviPage() {
  usePageMeta({
    title: 'Radovi — DreamSign | Sajtovi koji donose rezultate',
    description:
      'Izabrani projekti: sajtovi koje smo dizajnirali i izgradili — i rezultati koje su doneli. Pogledajte radove, pa nam pišite na WhatsApp za vaš.',
    path: '/radovi',
    schema: PAGE_SCHEMA('Radovi', '/radovi'),
  })

  return (
    <main>
      <World>
        <HeroMini title="Radovi" script="rezultati" />

        {/* the descent — same law as home: negative overlap, nothing paints its own ground */}
        <div className="relative z-20 -mt-[18vh]">
          {/* the junction rides the sampled seam colour, homepage grammar */}
          <SeamBridge className="top-0 h-[62vh]" />
          <Beat name="uvod" layers={
            <WorldLayer
              src="/media/B3-square-sky.webp" eager
              box="-top-[30vh] -bottom-[36vh]"
              imgClass="absolute inset-0 h-[126%] w-full object-cover object-center"
              y={['0%', '-9%']} base={0.85} mask={MASK.sky}
            />
          }>
            <div className="mx-auto max-w-4xl px-5 sm:px-6 pt-[24vh] pb-16 md:pb-24 text-center">
              <CharRise
                as="h2"
                text="Svaki sajt ovde je nekome doneo kupce."
                className="font-semibold tracking-tight text-ink text-[clamp(1.7rem,3.8vw,2.9rem)] leading-[1.15]"
              />
            </div>
          </Beat>

          <Beat name="projekti" layers={
            <>
              <WorldLayer
                src="/media/bank-soft.webp"
                box="-top-[8vh] -bottom-[10vh]"
                imgClass="absolute left-[-16%] top-[16%] w-[48%] h-auto max-w-none"
                y={['0%', '-12%']} base={0.5} float={{ px: 9, sec: 10 }}
              />
              <WorldLayer
                src="/media/B7-vertical-sea.webp"
                box="top-[38%] -bottom-[46vh]"
                imgClass="absolute inset-0 h-[126%] w-full object-cover object-center"
                y={['0%', '-10%']} base={0.9} mask={MASK.sea}
              />
            </>
          }>
            {PROJEKTI.map((p, i) => <Plate key={p.name} p={p} i={i} />)}
          </Beat>

          <Ground>
            <Beat name="finale">
              <div className="pt-[26vh]">
                <LandingCTA script="Sledeći rezultat može biti vaš." clipId="ds-sign-radovi" />
              </div>
            </Beat>
          </Ground>
        </div>
      </World>
    </main>
  )
}
