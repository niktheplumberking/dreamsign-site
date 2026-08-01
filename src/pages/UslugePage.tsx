// /usluge — every service sold with a real sentence, transparency without prices
// (story-map; NO PRICES is the owner's law — the process section replaces any pricing
// table). Build-spec: hero mini → M4 accordion → M6 pin & scrub process (the stroke draws
// the connector step 3→4) → garancije T6 char-variant → daylight landing CTA.
import { useRef } from 'react'
import { motion, useTransform } from 'motion/react'
import { World, WorldLayer, SeamBridge, Beat, useWorld, useWorldRange } from '../components/World'
import HeroMini from '../components/HeroMini'
import CharRise from '../components/CharRise'
import CharFill from '../components/CharFill'
import LandingCTA from '../components/LandingCTA'
import Ground from '../components/Ground'
import Usluge from '../components/sections/Usluge'
import { MASK } from '../lib/masks'
import { usePageMeta } from '../lib/meta'
import { PAGE_SCHEMA } from '../lib/schema'

/** the four steps, verbatim from the story map — the customer's real sequence */
const KORACI = [
  { n: '1', t: 'Javite se', d: 'dva klika.' },
  { n: '2', t: 'Upoznajemo vaš posao', d: 'i dolazimo lično.' },
  { n: '3', t: 'Potpis i plan', d: 'obim, rok i cena — pismeno.' },
  { n: '4', t: 'Gradimo, lansiramo', d: 'vodimo vas do sna.' },
]

/** The process as a DESCENT (not a pin: the World wrapper's overflow-hidden — which the
    masked layers require — disarms position:sticky on every descendant; the same physics
    that made the homepage replace the pin grammar. Deviation D57). The pen — the brand's
    protagonist — draws one continuous line down through the four steps as the visitor
    scrolls; the steps alternate sides of it and the line ends in the rising flick where
    step 4 hands over to the signature. The scrub reads the world's one progress value. */
function Proces() {
  const ref = useRef<HTMLDivElement>(null)
  const { p: world, reduced } = useWorld()
  const [enter, exit] = useWorldRange(ref, 0.78, -1.15)
  const drawn = useTransform(world, [enter, exit], [0, 1], { clamp: true })

  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-6">
      <CharRise
        as="h2"
        text="Kako radimo"
        className="text-center font-semibold tracking-tight text-ink text-[clamp(1.9rem,4.2vw,3.1rem)]"
      />
      <p className="mt-3 text-center text-[15.5px] text-ink/60 max-w-[52ch] mx-auto">
        Svaki projekat je jedinstven — zato nema cenovnika: ponuda stiže posle prvog razgovora.
      </p>

      <div ref={ref} className="relative mx-auto mt-14 max-w-3xl md:mt-20">
        {/* the pen line, drawn by the scroll — meanders between the steps' sides */}
        {/* own compositor layer: the per-frame pathLength repaint otherwise invalidates a
            layer it shares with the huge masked sea/flourish images and re-rasters them
            all (measured 127-174ms against the 50ms law; isolated, the page runs at 8ms) */}
        <svg
          viewBox="0 0 100 880" preserveAspectRatio="none" aria-hidden
          className="absolute left-1/2 top-0 hidden h-full w-[220px] -translate-x-1/2 md:block"
          style={{ transform: 'translateZ(0)', willChange: 'transform' }}
        >
          <motion.path
            d="M 50 6 C 20 90, 82 160, 62 240 C 44 316, 22 372, 44 460 C 64 540, 30 600, 48 680 C 62 744, 40 790, 72 830 C 84 846, 92 852, 98 854"
            stroke="#2458A6" strokeWidth="2.6" strokeLinecap="round" fill="none" opacity="0.85"
            vectorEffect="non-scaling-stroke"
            style={{ pathLength: reduced ? 1 : drawn }}
          />
        </svg>

        <div className="grid gap-14 md:gap-[4.5rem]">
          {KORACI.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className={`relative flex items-start gap-5 md:w-[46%] ${
                i % 2 === 1 ? 'md:ml-auto md:text-left' : ''
              }`}
            >
              <span className="font-semibold tabular-nums leading-none text-accent/30 text-5xl md:text-[clamp(3.5rem,6vw,5rem)]" aria-hidden>
                0{step.n}
              </span>
              <div>
                <h3 className="font-semibold text-ink text-lg md:text-[22px] leading-snug">{step.t}</h3>
                <p className="mt-1 text-[15px] md:text-[15.5px] text-ink/65 max-w-[30ch]">{step.d}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function UslugePage() {
  usePageMeta({
    title: 'Usluge — Izrada web sajtova i dizajn | DreamSign',
    description:
      'Izrada premium sajtova, redizajn, brendiranje i održavanje — uz ugovor i garancije. Svaki projekat je jedinstven: ponuda posle prvog razgovora.',
    path: '/usluge',
    ogImage: '/media/og-usluge.jpg',
    schema: PAGE_SCHEMA('Usluge', '/usluge'),
  })

  return (
    <main>
      <World>
        <HeroMini title="Usluge" script="sve pod jednim krovom" />

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
            <div className="mx-auto max-w-4xl px-5 sm:px-6 pt-[24vh] pb-10 md:pb-14 text-center">
              <CharRise
                as="h2"
                text="Dizajn, izrada, brendiranje i briga — jedan tim, jedan potpis."
                className="font-semibold tracking-tight text-ink text-[clamp(1.7rem,3.8vw,2.9rem)] leading-[1.15]"
              />
            </div>
          </Beat>

          <Beat name="usluge" layers={
            <WorldLayer
              src="/media/B2-vertical-flourish.webp"
              box="-top-[20vh] -bottom-[24vh]"
              imgClass="absolute right-[-14%] top-0 h-full w-auto max-w-none object-contain md:right-[-6%]"
              y={['0%', '-7%']} mask={MASK.flourish}
              opacity={{ range: [0.08, 0.2, 0.4], values: [0, 0.28, 0.08] }}
            />
          }>
            <Usluge />
          </Beat>

          <Beat name="proces" layers={
            <WorldLayer
              src="/media/bank-soft.webp"
              box="-top-[8vh] -bottom-[8vh]"
              imgClass="absolute left-[-16%] top-[8%] w-[46%] h-auto max-w-none"
              y={['0%', '-10%']} base={0.5} float={{ px: 8, sec: 10 }}
            />
          }>
            <div className="pt-10 md:pt-16">
              <Proces />
            </div>
          </Beat>

          <Beat name="garancije" layers={
            <WorldLayer
              src="/media/B7-vertical-sea.webp"
              box="-top-[30vh] -bottom-[44vh]"
              imgClass="absolute inset-0 h-[128%] w-full object-cover object-center"
              y={['0%', '-10%']} base={0.9} mask={MASK.sea}
            />
          }>
            <div className="pt-16 md:pt-24">
              <CharFill
                text="Ugovor pre početka. Garancije u pisanom obliku. Nikad skriveni troškovi."
                accentWord="Garancije"
              />
            </div>
          </Beat>

          <Ground>
            <Beat name="finale">
              <div className="pt-[26vh]">
                <LandingCTA
                  lead="Svaki projekat je jedinstven — ponuda stiže posle prvog razgovora."
                  script="Potpišite svoj san"
                  clipId="ds-sign-usluge"
                />
              </div>
            </Beat>
          </Ground>
        </div>
      </World>
    </main>
  )
}
