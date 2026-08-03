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

const SkyGap = () => <div aria-hidden style={{ height: 'max(44vh, 500px)' }} />

/* ------------------------------------------------------------------ hero (his block) */

/** the mind-map: three outlined clouds — OUR real services — tied by thin pen lines to
    one origin. Geometry from the reference SVG; stroke and faces ours. */
function CloudMap() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="pointer-events-none absolute right-0 z-10 w-[230px] sm:w-[340px] md:w-[420px] lg:w-[480px]
                 top-[-160px] sm:top-[-40px] md:top-[-56px] lg:top-[-76px]"
      aria-hidden
    >
      <svg viewBox="0 0 500 240" fill="none" className="h-auto w-full overflow-visible">
        <g stroke="#16324F" strokeWidth="1.6" strokeLinecap="round" opacity="0.6">
          <path d="M 10 140 C 40 70, 85 45, 120 40" />
          <path d="M 10 140 C 110 115, 200 85, 305 68" />
          <path d="M 10 140 C 90 165, 175 180, 235 175" />
        </g>
        {[
          { t: 'translate(115, 12)', label: '1. Web dizajn', w: 140, tx: 70 },
          { t: 'translate(300, 38)', label: '2. SEO', w: 140, tx: 70 },
          { t: 'translate(230, 148)', label: '3. Marketing', w: 160, tx: 80 },
        ].map((c) => (
          <g key={c.label} transform={c.t}>
            <path
              d={c.w === 160
                ? 'M 20 40 C 8 40 2 28 12 18 C 8 5 30 -3 50 5 C 68 -5 102 -5 120 5 C 136 -3 158 5 152 18 C 166 28 158 40 142 40 Z'
                : 'M 20 40 C 8 40 2 28 12 18 C 8 5 28 -3 44 5 C 58 -5 88 -5 102 5 C 116 -3 134 5 130 18 C 142 28 136 40 122 40 Z'}
              fill="rgba(255,255,255,0.6)" stroke="#16324F" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round"
            />
            <text x={c.tx} y="22" textAnchor="middle" dominantBaseline="middle"
                  fill="#16324F" fontSize="13" fontWeight="600" fontFamily="'Inter Tight', system-ui, sans-serif">
              {c.label}
            </text>
          </g>
        ))}
      </svg>
    </motion.div>
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
  const [idx, setIdx] = useState(0)
  const next = useCallback(() => setIdx((i) => (i + 1) % REFERENCE.length), [])
  const prev = useCallback(() => setIdx((i) => (i - 1 + REFERENCE.length) % REFERENCE.length), [])
  useEffect(() => {
    if (reduced) return
    const t = setInterval(next, 7500)
    return () => clearInterval(t)
  }, [next, reduced])

  const a = REFERENCE[idx]
  const b = REFERENCE[(idx + 1) % REFERENCE.length]
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
              <motion.div key={a.name} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }}
                          transition={{ duration: reduced ? 0 : 0.9, ease: [0.16, 1, 0.3, 1] }}>
                <ReferenceCard r={a} />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="relative hidden min-h-[105px] overflow-hidden md:block">
            <AnimatePresence mode="wait">
              <motion.div key={b.name} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }}
                          transition={{ duration: reduced ? 0 : 0.9, ease: [0.16, 1, 0.3, 1] }}>
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

  const row = 'block font-semibold uppercase leading-[0.88] tracking-tight text-ink'
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

      <div className="relative z-20 mx-auto flex w-full max-w-7xl flex-col items-center justify-end">
        <CloudMap />

        <h1 className="flex w-full flex-col items-start text-left"
            style={{ textShadow: '0 2px 22px rgba(245,249,253,0.85)' }}>
          <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                       transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                       className={`${row} text-[13vw] sm:text-[10.5vw] md:text-[9vw] xl:text-[8.2rem]`}>
            Mi smo
          </motion.span>
          <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                       transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                       className={`${row} whitespace-nowrap text-[12.5vw] sm:text-[10vw] md:text-[8.5vw] xl:text-[7.8rem]`}>
            Full–service
          </motion.span>
          <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                       transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                       className="mt-1 flex w-full flex-col items-start justify-between gap-6 sm:mt-2 lg:flex-row lg:items-end lg:gap-12">
            {/* the reference sets this row in a second face — ours is the quill */}
            <span className="block font-script font-normal normal-case leading-none tracking-normal text-accent
                             text-[13vw] sm:text-[10.5vw] md:text-[9vw] xl:text-[8.2rem]">
              agencija
            </span>
            <span className="block max-w-xs pb-1 text-left text-xs font-medium normal-case leading-relaxed tracking-normal text-ink/85 sm:max-w-sm sm:text-sm lg:pb-4 lg:text-base xl:max-w-md">
              <EditableText k="usluge-uvod">
                {bk('usluge-uvod', 'Dizajn, izrada, brendiranje i briga — jedan tim, jedan potpis.')}
              </EditableText>
            </span>
          </motion.span>
        </h1>

        <Slider reduced={reduced} />
      </div>
      </div>
      {/* trailing sky inside the hero beat — the slider's bottom edge never meets a scan */}
      <div aria-hidden style={{ height: 'max(34vh, 380px)' }} />
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
  const items = [...BADGES, ...BADGES, ...BADGES]
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
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-8 lg:px-12">
      <div className="grid w-full grid-cols-12 items-start gap-2 sm:gap-6 lg:gap-8">
        <div className="col-span-4 lg:col-span-3">
          <span className="select-none text-6xl font-normal leading-none tracking-tight text-ink/90 sm:text-8xl lg:text-[110px]" aria-hidden>
            {s.n}
          </span>
        </div>
        <div className="col-span-8 flex flex-col pt-1 sm:pt-3 lg:col-span-9">
          <button onClick={onOpen} className="group/title flex w-full cursor-pointer items-center justify-between text-left" aria-expanded={active}>
            <h2 className="text-xl font-semibold uppercase tracking-tight text-ink transition-colors group-hover/title:text-ink/75 sm:text-3xl lg:text-5xl">
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

function ServicesStack() {
  const ref = useRef<HTMLDivElement>(null)
  const { reduced } = useWorld()
  const [active, setActive] = useState(0)
  // reading the scroll, never driving it — the TextFill precedent
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  useEffect(() => scrollYProgress.on('change', (p) => {
    setActive(p < 0.20 ? 0 : p < 0.52 ? 1 : p < 0.84 ? 2 : 3)
  }), [scrollYProgress])

  const y2 = useTransform(scrollYProgress, [0.02, 0.32], ['0vh', '-52vh'])
  const y3 = useTransform(scrollYProgress, [0.35, 0.65], ['0vh', '-68vh'])
  const y4 = useTransform(scrollYProgress, [0.68, 0.98], ['0vh', '-84vh'])

  const jump = (i: number) => {
    if (!ref.current) return
    const targets = [0.0, 0.33, 0.66, 0.99]
    const top = ref.current.offsetTop + targets[i] * (ref.current.offsetHeight - window.innerHeight)
    window.scrollTo({ top, behavior: 'smooth' })
  }

  // reduced motion (or no JS-driven pin): the four cards as a plain stacked list
  if (reduced) {
    return (
      <div className="flex flex-col gap-14 py-10">
        {SERVICES.map((_, i) => <StackCard key={i} i={i} active onOpen={() => {}} />)}
      </div>
    )
  }

  return (
    <div ref={ref} className="relative h-[320vh] w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* 01 — the base blanket; its top dissolves into the sky (no razor at the seam) */}
        <div className="absolute inset-0 z-10 flex flex-col justify-start pt-16 sm:pt-20"
             style={{ background: `linear-gradient(to bottom, transparent 0%, ${CARD_BG} 90px, ${CARD_BG} 100%)` }}>
          <StackCard i={0} active={active === 0} onOpen={() => jump(0)} />
        </div>
        {[
          { y: y2, top: 'top-[52vh]', z: 'z-20', i: 1 },
          { y: y3, top: 'top-[68vh]', z: 'z-30', i: 2 },
          { y: y4, top: 'top-[84vh]', z: 'z-40', i: 3 },
        ].map(({ y, top, z, i }) => (
          <motion.div
            key={i} style={{ y, background: CARD_BG }}
            className={`absolute left-0 right-0 bottom-0 ${top} ${z} flex flex-col justify-start border-t border-ink/25 pt-6
                        shadow-[0_-12px_28px_rgba(22,50,79,0.07)]`}
          >
            <StackCard i={i} active={active === i} onOpen={() => jump(i)} />
          </motion.div>
        ))}
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

          <Beat name="poverenje" layers={
            <WorldLayer
              src="/media/B3-square-sky.webp" eager
              box="-top-[26vh] -bottom-[26vh]"
              imgClass="absolute inset-0 h-[126%] w-full object-cover object-center"
              y={['0%', '-9%']} base={0.8} mask={MASK.sky}
            />
          }>
            <SkyGap />
            <TrustBand />
            <SkyGap />
          </Beat>

          <Beat name="usluge-stack" layers={
            <WorldLayer
              src="/media/bank-soft.webp"
              box="-top-[8vh] -bottom-[8vh]"
              imgClass="absolute left-[-16%] top-[2%] w-[46%] h-auto max-w-none"
              y={['0%', '-10%']} base={0.5} float={{ px: 8, sec: 10 }}
            />
          }>
            <ServicesStack />
            <SkyGap />
          </Beat>

          <Ground>
            <Beat name="finale">
              <div className="pt-[24vh]">
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
