// /usluge — batch 13: Nick's own layout (AI Studio reference, 2026-08-03), our skin.
// Hero: the stacked display block MI SMO / FULL–SERVICE / script „Agencija" with the
// cloud mind-map riding top-right and the reference slider under it. Then the ink trust
// band (REAL facts only — the reference's ISO/SLA/certificate claims are not ours to
// make), then his 320vh blanket-stack of the four services — possible now that the World
// clips with overflow-clip instead of overflow-hidden (sticky lives).
// Faces, palette, sky and motion grammar stay ours; his red → signature blue.
import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react'
import { World, WorldLayer, SeamBridge, Beat, useWorld } from '../components/World'
import LandingCTA from '../components/LandingCTA'
import Ground from '../components/Ground'
import { GlossyPill } from '../components/Nav'
import { MASK } from '../lib/masks'
import { WA_LINK } from '../lib/hooks'
import { bk } from '../lib/content'
import { EditableText } from '../ok/OwnersKey'
import { usePageMeta } from '../lib/meta'
import { PAGE_SCHEMA } from '../lib/schema'

const SkyGap = () => <div aria-hidden style={{ height: 'max(26vh, 310px)' }} />

/* ------------------------------------------------------------------ hero (his block) */

/* batch 25 (owner) — the hand-drawn mind-map is GONE ("like somebody threw them there").
   The metaphor stays, executed with the site's REAL assets: the title says full-service
   agencija, and three pen lines leave from under three DIFFERENT words of it, each landing
   on a real cloud carrying one of the three things we do. */

/** a labelled cloud in the CloudButton's own dress — the real puff, label in its body */
function LabelCloud({ label, className = '', bobDelay = 0, reduced }: {
  label: string; className?: string; bobDelay?: number; reduced: boolean
}) {
  return (
    <motion.div
      aria-hidden
      animate={reduced ? undefined : { y: [0, -7, 0] }}
      transition={{ duration: 5.6, repeat: Infinity, ease: 'easeInOut', delay: bobDelay }}
      className={`absolute ${className}`}
    >
      <img
        src="/media/cloud-puff.webp" alt=""
        className="w-full select-none drop-shadow-[0_10px_24px_rgba(22,50,79,0.20)]"
      />
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center pt-[4%]">
        <span className="max-w-[62%] text-center text-[10.5px] font-semibold uppercase leading-tight tracking-[0.12em] text-ink/85 sm:text-[12px]">
          {label}
        </span>
      </span>
    </motion.div>
  )
}

/** the fan: three lines from three different points under the title, three real clouds */
function CloudFan({ reduced }: { reduced: boolean }) {
  const draw = (i: number) =>
    reduced
      ? {}
      : {
          initial: { pathLength: 0, opacity: 0 },
          animate: { pathLength: 1, opacity: 0.55 },
          transition: { duration: 0.9, delay: 0.5 + i * 0.22, ease: [0.45, 0, 0.25, 1] as const },
        }
  return (
    <div aria-hidden className="relative mt-2 h-[300px] w-full sm:h-[340px] lg:h-[380px]">
      {/* the pen lines — each starts under a DIFFERENT word of the title (his metaphor:
          the title branches into what we do) */}
      <svg
        viewBox="0 0 100 100" preserveAspectRatio="none" fill="none"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <g stroke="#16324F" strokeWidth="1.5" strokeLinecap="round" vectorEffect="non-scaling-stroke">
          <motion.path vectorEffect="non-scaling-stroke" d="M 7 2 C 6 30, 8 42, 11 58" {...draw(0)} />
          <motion.path vectorEffect="non-scaling-stroke" d="M 27 2 C 32 26, 42 40, 49 50" {...draw(1)} />
          <motion.path vectorEffect="non-scaling-stroke" d="M 48 2 C 62 22, 76 34, 83 62" {...draw(2)} />
        </g>
      </svg>
      <LabelCloud reduced={reduced} label="Web dizajn" bobDelay={0}
                  className="left-[1%] top-[52%] w-[168px] sm:w-[200px] lg:w-[236px]" />
      <LabelCloud reduced={reduced} label="SEO" bobDelay={1.1}
                  className="left-[38%] top-[44%] w-[150px] sm:w-[184px] lg:w-[214px]" />
      <LabelCloud reduced={reduced} label="Marketing" bobDelay={0.5}
                  className="left-[71%] top-[56%] w-[160px] sm:w-[196px] lg:w-[226px]" />
    </div>
  )
}

/** the reference slider — REAL references only: the three live projects (the reference
    file's invented testimonials cannot ship; real quotes take these seats the day they
    exist). Two visible slots, arrows, gentle auto-advance. */
const REFERENCE = [
  { thumb: '/media/radovi/bennett.webp', name: 'Bennett & Co', line: 'Kompletan identitet i korporativni sajt.', href: 'https://www.bennettndco.com', label: 'bennettndco.com' },
  { thumb: '/media/radovi/metalkolor.webp', name: 'Metal Kolor', line: 'Katalog, galerija i kontakt za majstore Srema.', href: 'https://metal-kolor.rs/', label: 'metal-kolor.rs' },
  { thumb: '/media/radovi/pizzdarija.webp', name: 'Pizzdarija', line: 'Meni i porudžbina na dva klika, Novi Sad.', href: 'https://www.pizzdarija.rs/', label: 'pizzdarija.rs' },
  { thumb: '/media/brand/cloud-d.webp', name: 'Vaš projekat', line: 'Sledeći rad kojim se hvalimo može biti vaš.', href: WA_LINK, label: 'Započnite razgovor' },
]

function ReferenceCard({ r }: { r: (typeof REFERENCE)[number] }) {
  return (
    <a
      href={r.href} target="_blank" rel="noopener"
      className="liquid-glass flex w-full items-start gap-4 rounded-2xl p-4 text-left transition-transform hover:scale-[1.01] sm:p-5"
    >
      <img src={r.thumb} alt={r.name} className="h-12 w-12 shrink-0 rounded-full border border-ink/15 object-cover object-top bg-white" />
      <span className="flex min-h-[2.5rem] flex-col">
        <span className="text-[13px] font-semibold text-ink sm:text-sm">{r.name}</span>
        <span className="mt-0.5 text-xs font-medium leading-relaxed text-ink/70 sm:text-[13px]">{r.line}</span>
        <span className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">{r.label} ↗</span>
      </span>
    </a>
  )
}

function Slider({ reduced }: { reduced: boolean }) {
  // batch 25 (owner): ONE slot changes at a time (alternating), and it SLIDES — no fade.
  // `n` counts steps in either direction; each parity owns one slot, so exactly one card
  // key changes per step and only that card animates.
  const [n, setN] = useState(0)
  const next = useCallback(() => setN((v) => v + 1), [])
  const prev = useCallback(() => setN((v) => v - 1), [])
  useEffect(() => {
    if (reduced) return
    const t = setInterval(next, 7000)
    return () => clearInterval(t)
  }, [next, reduced])

  const mod = (v: number, m: number) => ((v % m) + m) % m
  const a = REFERENCE[mod(0 + 2 * Math.ceil(n / 2), REFERENCE.length)]
  const b = REFERENCE[mod(1 + 2 * Math.floor(n / 2), REFERENCE.length)]
  const Btn = ({ onClick, label, children }: { onClick: () => void; label: string; children: React.ReactNode }) => (
    <button
      onClick={onClick} aria-label={label}
      className="z-30 grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full border border-ink/20
                 bg-white/60 text-ink shadow-sm backdrop-blur-md transition-all hover:scale-105 hover:bg-white sm:h-11 sm:w-11"
    >
      {children}
    </button>
  )

  return (
    <div className="z-20 mt-8 flex w-full items-center gap-2 sm:mt-10 sm:gap-4 lg:mt-12">
      <Btn onClick={prev} label="Prethodna referenca">‹</Btn>
      <div className="flex-1 overflow-hidden py-1">
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
          <div className="relative min-h-[105px] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div key={a.name} initial={{ x: '112%' }} animate={{ x: 0 }} exit={{ x: '-112%' }}
                          transition={{ duration: reduced ? 0 : 0.75, ease: [0.3, 0, 0.2, 1] }}>
                <ReferenceCard r={a} />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="relative hidden min-h-[105px] overflow-hidden md:block">
            <AnimatePresence mode="wait">
              <motion.div key={b.name} initial={{ x: '112%' }} animate={{ x: 0 }} exit={{ x: '-112%' }}
                          transition={{ duration: reduced ? 0 : 0.75, ease: [0.3, 0, 0.2, 1] }}>
                <ReferenceCard r={b} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      <Btn onClick={next} label="Sledeća referenca">›</Btn>
    </div>
  )
}

function UslugeHero() {
  const { p, reduced, vh } = useWorld()
  const skyY = useTransform(p, [0, vh], ['0%', '8%'])

  // batch 19: the brand ramp, never flat ink (colour law)
  const row = 'ink-gradient block font-semibold uppercase leading-[0.88] tracking-tight'
  return (
    // the reference composition fills the FIRST screen (justify-end inside an h-screen
    // block); the trailing sky lives inside this beat so the hero's own bottom edge —
    // where the slider cards sit by design — stays outside the junction scan band
    <section data-beat="hero" className="relative z-10 w-full overflow-hidden">
      <motion.img
        src="/media/hero-sky-still.webp" alt=""
        className="absolute inset-0 z-0 h-[120%] w-full object-cover"
        style={reduced ? undefined : { y: skyY }}
      />
      <div className="relative flex min-h-screen w-full flex-col justify-end px-4 pb-12 pt-28 sm:px-10 sm:pb-16 lg:px-16 lg:pb-20">

      <div className="relative z-20 mx-auto flex w-full max-w-7xl flex-col items-start justify-end">
        {/* batch 25 (owner): the duet turned around — the quill opens quietly, the primary
            carries the whole claim in ONE voice (no more lone script word closing it) */}
        <h1 className="flex w-full flex-col items-start text-left">
          <motion.span
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="block -rotate-2 font-script font-normal normal-case leading-none tracking-normal text-accent
                       text-[clamp(2.2rem,5.4vw,4.4rem)]"
            style={{ textShadow: '0 2px 22px rgba(245,249,253,0.85)' }}
          >
            Mi smo
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className={`${row} mt-2 whitespace-nowrap text-[8.6vw] sm:text-[7.4vw] xl:text-[6.8rem]`}
          >
            Full–service agencija
          </motion.span>
        </h1>

        <motion.span
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 block max-w-xs text-left text-xs font-medium leading-relaxed text-ink/85 sm:max-w-sm sm:text-sm lg:text-base xl:max-w-md"
          style={{ textShadow: '0 2px 22px rgba(245,249,253,0.85)' }}
        >
          <EditableText k="usluge-uvod">
            {bk('usluge-uvod', 'Dizajn, izrada, brendiranje i briga — jedan tim, jedan potpis.')}
          </EditableText>
        </motion.span>

        {/* the three things we do, hanging off the title's own words */}
        <CloudFan reduced={reduced} />

        <Slider reduced={reduced} />
      </div>
      </div>
      {/* trailing sky inside the hero beat — the slider's bottom edge never meets a scan;
          batch 25: trimmed to the junction-law floor so the trust band rides higher */}
      <div aria-hidden style={{ height: 'max(26vh, 310px)' }} />
    </section>
  )
}

/* --------------------------------------------------- the ink trust band (REAL facts) */

const BADGES = [
  { g: 'M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z', t: 'Registrovana delatnost', s: 'APR · matični broj 68643627' },
  { g: 'M6 3h9l4 4v14H6V3z M14 3v5h5', t: 'Ugovor za svaki projekat', s: 'obim, rok i cena — pismeno' },
  { g: 'M12 2a5 5 0 015 5c0 2-1 3.5-2.5 4.3V13l1.5 1.5-1.5 1.5 1.5 1.5-2 2.5h-4v-7.2A5 5 0 0112 2z', t: 'Sajt je vaše vlasništvo', s: 'kod i sadržaj prelaze na vas' },
  { g: 'M12 4a4 4 0 110 8 4 4 0 010-8z M4 21c1-4 4-6 8-6s7 2 8 6', t: 'Direktno sa vlasnikom', s: 'bez posrednika, od prvog dana' },
  { g: 'M12 3a9 9 0 110 18 9 9 0 010-18z M12 7v5l3 3', t: 'Fiksan rok', s: 'dogovoren i potpisan pre početka' },
  { g: 'M4 12h16 M4 12c0-4 3.5-7 8-7s8 3 8 7-3.5 7-8 7-8-3-8-7z M9 12h6', t: 'Bez skrivenih troškova', s: 'cena poznata pre početka' },
]

function TrustBand() {
  // EXACTLY two copies: the marquee keyframe slides -50%, so the loop is seamless only
  // when the track is two identical halves — three copies made it jump at the reset
  // (Nick's "glitch", batch 25)
  const items = [...BADGES, ...BADGES]
  return (
    <div className="relative w-full overflow-hidden bg-ink py-8 text-tint shadow-inner sm:py-12">
      <div aria-hidden className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-20 bg-gradient-to-r from-ink to-transparent sm:w-40" />
      <div aria-hidden className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-20 bg-gradient-to-l from-ink to-transparent sm:w-40" />
      <div className="flex w-max animate-marquee items-center gap-12 sm:gap-16 lg:gap-20">
        {items.map((b, i) => (
          <div key={i} className="flex shrink-0 items-center gap-10 sm:gap-14">
            <div className="flex items-center gap-4">
              <svg viewBox="0 0 24 24" className="h-7 w-7 shrink-0 sm:h-9 sm:w-9" fill="none"
                   stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d={b.g} />
              </svg>
              <div className="flex flex-col text-left">
                <span className="whitespace-nowrap text-base font-bold uppercase tracking-wider sm:text-lg lg:text-xl">{b.t}</span>
                <span className="whitespace-nowrap text-xs font-medium normal-case text-tint/75 sm:text-sm">{b.s}</span>
              </div>
            </div>
            <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-full bg-tint/35" />
          </div>
        ))}
      </div>
    </div>
  )
}

/* -------------------------------------- the blanket stack (his pin, our services) */

const SERVICES = [
  {
    n: '01', title: 'Izrada sajtova', sub: 'Sajtovi po meri koji prodaju',
    paras: [
      'Dizajniramo i gradimo sajt od nule — brz, prilagođen telefonu i posložen da vodi posetioca ka razgovoru, ne samo da postoji.',
      'Sve što posetilac vidi je vaše: sadržaj pišemo zajedno, dizajn nastaje za vaš posao, a posle lansiranja tekstove i slike menjate sami.',
    ],
    caps: ['Dizajn i izrada po meri', 'Prilagođen telefonu', 'Brz i siguran', 'Samostalno uređivanje'],
  },
  {
    n: '02', title: 'SEO i pozicioniranje', sub: 'Da vas nađu ljudi koji već traže',
    paras: [
      'Sajt koji niko ne nađe ne prodaje. Sređujemo tehnički SEO, sadržaj i lokalnu vidljivost, da vas Google prikaže ljudima koji već traže vašu uslugu.',
    ],
    caps: ['Tehnički SEO', 'Lokalna vidljivost', 'Sadržaj i ključne reči', 'Mesečni izveštaji'],
  },
  {
    n: '03', title: 'Oglašavanje i kampanje', sub: 'Budžet tamo gde donosi pozive',
    paras: [
      'Vodimo Google i Meta kampanje sa jednim ciljem: da svaki dinar budžeta ide tamo gde stvarno donosi upite i pozive.',
    ],
    caps: ['Google oglasi', 'Meta (Facebook i Instagram)', 'Praćenje konverzija', 'Jasni izveštaji'],
  },
  {
    n: '04', title: 'Održavanje i podrška', sub: 'Sajt ostaje brz, siguran i aktuelan',
    paras: [
      'Posle lansiranja sajt ne ostaje sam: redovna ažuriranja, bezbednosne kopije i podrška direktno od vlasnika — a kada projekat traži, dolazimo i lično.',
    ],
    caps: ['Redovna ažuriranja', 'Bezbednosne kopije', 'Podrška 1:1', 'Dolazimo lično'],
  },
]

/** the card surface sits a breath under the sky's local tone — the blanket occludes what
    it covers without ever drawing a razor against the world */
const CARD_BG = '#EFF6FC'

function StackCard({ i, active, onOpen }: { i: number; active: boolean; onOpen: () => void }) {
  const s = SERVICES[i]
  return (
    <div className="w-full px-5 py-4 sm:px-8 sm:py-5 lg:px-10">
      <div className="grid w-full grid-cols-12 items-start gap-3 sm:gap-6 lg:gap-8">
        <div className="col-span-2 lg:col-span-2">
          <span className="select-none text-3xl font-normal leading-none tracking-tight text-accent/90 sm:text-5xl lg:text-6xl" aria-hidden>
            {s.n}
          </span>
        </div>
        <div className="col-span-10 flex flex-col pt-0.5 sm:pt-1 lg:col-span-10">
          <button onClick={onOpen} className="group/title flex w-full cursor-pointer items-center justify-between text-left" aria-expanded={active}>
            {/* batch 19: brand ramp (colour law) — the hover dim moved to opacity, since
                a colour change would repaint solid ink over the clipped gradient */}
            <h2 className="ink-gradient text-lg font-semibold uppercase tracking-tight transition-opacity group-hover/title:opacity-75 sm:text-2xl lg:text-4xl">
              {s.title}
            </h2>
            <span aria-hidden className={`ml-4 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-ink/30 text-lg transition-all sm:h-10 sm:w-10 ${active ? 'rotate-45' : ''}`}>
              +
            </span>
          </button>
          <AnimatePresence>
            {active && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="max-w-2xl space-y-3 pt-3 sm:space-y-4 sm:pt-4">
                  <span className="inline-block text-xs font-semibold uppercase tracking-wider text-ink/70 sm:text-sm">{s.sub}</span>
                  {s.paras.map((p) => (
                    <p key={p.slice(0, 16)} className="text-xs leading-relaxed text-ink/85 sm:text-sm lg:text-base">{p}</p>
                  ))}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {s.caps.map((c) => (
                      <span key={c} className="rounded-full border border-ink/15 bg-white/60 px-3 py-1 text-[11px] font-medium text-ink sm:text-xs">
                        {c}
                      </span>
                    ))}
                  </div>
                  <div className="pt-2">
                    <GlossyPill href={WA_LINK} className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider">
                      Započnite razgovor
                    </GlossyPill>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

/* batch 25 (owner) — THE STACK, rebuilt as a pinned ACCORDION. The blankets that rose
   and COVERED the previous card (and the nav's background, and 01's button) are gone.
   One surface, four rows, always all four titles visible: the active row's body expands
   in place and pushes the rows below it down — exactly "the previous number shows only
   its title, like 03 and 04 do". Nothing is absolute, so it cannot glitch across
   viewports; the scrub picks the active row, the titles are also buttons. */
function ServicesStack() {
  const ref = useRef<HTMLDivElement>(null)
  const { reduced } = useWorld()
  const [active, setActive] = useState(0)
  // reading the scroll, never driving it — the TextFill precedent
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  useEffect(() => scrollYProgress.on('change', (p) => {
    setActive(p < 0.22 ? 0 : p < 0.5 ? 1 : p < 0.78 ? 2 : 3)
  }), [scrollYProgress])

  const jump = (i: number) => {
    if (!ref.current) return
    const targets = [0.06, 0.32, 0.6, 0.88]
    const top = ref.current.offsetTop + targets[i] * (ref.current.offsetHeight - window.innerHeight)
    window.scrollTo({ top, behavior: 'smooth' })
  }

  // reduced motion (or no JS-driven pin): the four cards as a plain stacked list
  if (reduced) {
    return (
      <div className="flex flex-col gap-10 py-10">
        {SERVICES.map((_, i) => <StackCard key={i} i={i} active onOpen={() => {}} />)}
      </div>
    )
  }

  return (
    // 260vh: the last card is open by 78% of the runway — no dead scroll trailing it
    <div ref={ref} className="relative h-[260vh] w-full">
      <div className="sticky top-0 flex h-screen w-full flex-col justify-center overflow-hidden px-3 pt-14 sm:px-6 sm:pt-16">
        <div
          className="mx-auto w-full max-w-6xl overflow-hidden rounded-[1.8rem] border border-white/70
                     shadow-[0_18px_50px_rgba(22,50,79,0.10)]"
          style={{ background: CARD_BG }}
        >
          {SERVICES.map((_, i) => (
            <div key={i} className={i > 0 ? 'border-t border-ink/15' : ''}>
              <StackCard i={i} active={active === i} onOpen={() => jump(i)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------- the page */

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
        <UslugeHero />

        <div className="relative z-20">
          <SeamBridge className="-top-[10vh] h-[50vh]" />

          {/* batch 25 (owner): ONE beat carries the band AND the stack — no boundary
              between them, so the band→stack air shrinks to a breath (his note) while
              both outer boundaries keep their ≥300px of junction-law sky. THE cloud
              hovers through the gap. */}
          <Beat name="usluge" layers={
            <>
              <WorldLayer
                src="/media/B3-square-sky.webp" eager
                box="-top-[26vh] -bottom-[26vh]"
                imgClass="absolute inset-0 h-[126%] w-full object-cover object-center"
                y={['0%', '-9%']} base={0.8} mask={MASK.sky}
              />
              <WorldLayer
                src="/media/cloud-real.webp" eager
                box="-top-[8vh] -bottom-[8vh]"
                imgClass="absolute left-[-10%] top-[10%] w-[38%] h-auto max-w-none"
                y={['0%', '-11%']} base={0.9} float={{ px: 8, sec: 10 }}
              />
              <WorldLayer
                src="/media/cloud-real.webp" eager
                box="-top-[8vh] -bottom-[8vh]"
                imgClass="absolute right-[-8%] top-[22%] w-[34%] h-auto max-w-none scale-x-[-1]"
                y={['0%', '-8%']} base={0.8} float={{ px: 7, sec: 12, delay: 1.2 }}
              />
            </>
          }>
            <SkyGap />
            <TrustBand />
            {/* the closed gap — a breath, alive with the hovering clouds above */}
            <div aria-hidden style={{ height: 'max(16vh, 190px)' }} />
            <ServicesStack />
            <SkyGap />
          </Beat>

          <Ground>
            <Beat name="finale">
              <div className="pt-[10vh]">
                <LandingCTA
                  lead={bk('usluge-cta', 'Svaki projekat je jedinstven — ponuda stiže posle prvog razgovora.')}
                  leadK="usluge-cta"
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
