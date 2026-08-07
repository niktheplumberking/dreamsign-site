// /usluge — batch 13: Nick's own layout (AI Studio reference, 2026-08-03), our skin.
// Hero: the stacked display block MI SMO / FULL–SERVICE / script „Agencija" with the
// cloud mind-map riding top-right and the reference slider under it. Then the ink trust
// band (REAL facts only — the reference's ISO/SLA/certificate claims are not ours to
// make), then his 320vh blanket-stack of the four services — possible now that the World
// clips with overflow-clip instead of overflow-hidden (sticky lives).
// Faces, palette, sky and motion grammar stay ours; his red → signature blue.
import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence, type MotionValue } from 'motion/react'
import { World, WorldLayer, SeamBridge, Beat, useWorld } from '../components/World'
import LandingCTA from '../components/LandingCTA'
import SveONama from '../components/SveONama'
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

/* batch 28 (owner): the hero reverted 1/1 to its pre-change state — his order ("revert
   how it was before we started doing any changes on hero section... then I will give you
   better instructions"). The mind-map below is the ORIGINAL, restored verbatim. */

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
      {/* batch 31 (owner): a new dress, same seats — THREE SEPARATE pen lines, each
          from its OWN origin on the title's side (his rule: never one shared point),
          and the clouds carry body now: a sky-gradient fill, a soft ink shadow and the
          pale-ink contour of our asset law instead of flat white outlines. */}
      <svg viewBox="0 0 500 240" fill="none" className="h-auto w-full overflow-visible">
        <defs>
          <linearGradient id="cm-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.92" />
            <stop offset="1" stopColor="#E7F1FB" stopOpacity="0.95" />
          </linearGradient>
          <filter id="cm-shadow" x="-20%" y="-20%" width="140%" height="160%">
            <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#16324F" floodOpacity="0.16" />
          </filter>
        </defs>
        <g stroke="#16324F" strokeWidth="1.6" strokeLinecap="round" opacity="0.45">
          <path d="M 2 58 C 42 46, 84 39, 126 34" />
          <path d="M 0 132 C 100 122, 204 94, 308 64" />
          <path d="M 12 205 C 82 201, 162 189, 240 174" />
        </g>
        {[
          { t: 'translate(115, 12)', label: '1. Web dizajn', w: 140, tx: 70 },
          { t: 'translate(300, 38)', label: '2. SEO', w: 140, tx: 70 },
          { t: 'translate(230, 148)', label: '3. Marketing', w: 160, tx: 80 },
        ].map((c) => (
          <g key={c.label} transform={c.t} filter="url(#cm-shadow)">
            <path
              d={c.w === 160
                ? 'M 20 40 C 8 40 2 28 12 18 C 8 5 30 -3 50 5 C 68 -5 102 -5 120 5 C 136 -3 158 5 152 18 C 166 28 158 40 142 40 Z'
                : 'M 20 40 C 8 40 2 28 12 18 C 8 5 28 -3 44 5 C 58 -5 88 -5 102 5 C 116 -3 134 5 130 18 C 142 28 136 40 122 40 Z'}
              fill="url(#cm-fill)" stroke="#16324F" strokeOpacity="0.5" strokeWidth="1.8"
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
  // batch 26 (owner): ONE CONNECTED TRAIN — every step, both visible cards slide LEFT
  // together: the left card leaves the stage, the right card takes the left seat, the
  // next card enters from the right. (His words: "same effect on both reviews always.")
  const N = REFERENCE.length
  const [idx, setIdx] = useState(0)
  const next = useCallback(() => setIdx((v) => v + 1), [])
  const prev = useCallback(() => setIdx((v) => v - 1), [])
  useEffect(() => {
    if (reduced) return
    const t = setInterval(next, 7000)
    return () => clearInterval(t)
  }, [next, reduced])

  // one card-width (incl. gap) measured live — transforms animate in px, no calc strings
  const viewRef = useRef<HTMLDivElement>(null)
  const [slotW, setSlotW] = useState(0)
  useEffect(() => {
    const measure = () => {
      const el = viewRef.current
      if (!el) return
      const two = window.matchMedia('(min-width: 768px)').matches
      setSlotW(two ? (el.clientWidth - 16) / 2 + 16 : el.clientWidth + 16)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const mod = (v: number, m: number) => ((v % m) + m) % m
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
    <div className="z-20 mt-6 flex w-full items-center gap-2 sm:mt-7 sm:gap-4">
      <Btn onClick={prev} label="Prethodna referenca">‹</Btn>
      <div ref={viewRef} className="relative h-[112px] flex-1 overflow-hidden py-1">
        {REFERENCE.map((r, i) => {
          // seat 0 = left stage, 1 = right stage, N-1 = just off-left, rest park off-right
          const s = mod(i - mod(idx, N), N)
          const off = s === N - 1 ? -1 : s
          return (
            <motion.div
              key={r.name}
              className="absolute left-0 top-1 w-full md:w-[calc(50%-8px)]"
              initial={false}
              animate={{ x: off * slotW }}
              transition={{ duration: reduced || !slotW ? 0 : 0.75, ease: [0.3, 0, 0.2, 1] }}
            >
              <ReferenceCard r={r} />
            </motion.div>
          )
        })}
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
    // overflow-CLIP, not hidden: the stack's sticky pin lives inside this section now,
    // and hidden would disarm it (the World wrapper's own batch-13 lesson)
    <section data-beat="hero" className="relative z-10 w-full overflow-clip">
      {/* the sky dissolves in SECTION space before the overflow cut — the separator line
          Nick circled under the hero can never exist (the radovi batch-20 grammar) */}
      {/* the ORIGINAL image framing back (his order — the sea and its clouds live again).
          h-SCREEN, not inset-0: the section is a mega-beat now (band + stack live in it),
          and a full-section img had stretched the sky 4x — THAT was what "deleted" the
          sea from the first fold. The foot keeps its dissolve so no separator line. */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 z-0 h-screen overflow-hidden"
        style={{
          WebkitMaskImage: 'linear-gradient(to bottom, black 86%, transparent 99%)',
          maskImage: 'linear-gradient(to bottom, black 86%, transparent 99%)',
        }}
      >
        <motion.img
          src="/media/hero-sky-still.webp" alt=""
          className="absolute inset-0 h-[120%] w-full object-cover"
          style={{ objectPosition: '50% 42%', ...(reduced ? {} : { y: skyY }) }}
        />
      </div>
      {/* batch 30 (owner): the whole block rides LOWER — his red line seats the review
          cards' bottom edge on the crest's foam (supersedes the batch-26 clearance) */}
      <div className="relative flex min-h-screen w-full flex-col justify-end px-4 pb-[23.5vh] pt-28 sm:px-10 lg:px-16">

      <div className="relative z-20 mx-auto flex w-full max-w-7xl flex-col items-center justify-end">
        <CloudMap />

        {/* batch 19: the glow moved OFF the h1 — inherited onto the gradient-clipped rows
            it painted a glyph-shaped white halo OVER the ramp (text paints after
            background) and frosted them silver. The script span carries its own glow.
            batch 29 (owner): the DUET — „MI SMO VAŠA" primary over „full-service
            agencija" in the quill, the two rows width-matched (sizes tuned by browser
            measurement, both in vw so the match holds at every viewport). */}
        <h1 className="flex w-full flex-col items-start text-left">
          <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                       transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                       className={`${row} whitespace-nowrap text-[12.5vw] sm:text-[10vw] md:text-[8.5vw] xl:text-[7.8rem]`}>
            Mi smo vaša
          </motion.span>
          {/* batch 31 (owner): TRUE alignment — items-BASELINE, so the subtitle's text
              sits on the script row's own baseline (batch 30 aligned box bottoms while
              pb-4 lifted the text 16px off them; his line was never met). The subtitle
              comes UP to the row; the pb crutches are gone. */}
          <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                       transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                       className="mt-1 flex w-full flex-col items-start justify-between gap-6 sm:mt-2 lg:flex-row lg:items-baseline lg:gap-12">
            <span className="block whitespace-nowrap font-script font-normal normal-case tracking-normal text-accent
                             leading-[1.02] text-[13.9vw] sm:text-[11.1vw] md:text-[9.5vw] xl:text-[8.63rem]"
                  style={{ textShadow: '0 2px 22px rgba(245,249,253,0.85)' }}>
              full-service agencija
            </span>
            <span className="block max-w-xs text-left text-xs font-medium normal-case leading-relaxed tracking-normal text-ink/85 sm:max-w-sm sm:text-sm lg:text-base xl:max-w-md"
                  style={{ textShadow: '0 2px 22px rgba(245,249,253,0.85)' }}>
              <EditableText k="usluge-uvod">
                {bk('usluge-uvod', 'Dizajn, izrada, brendiranje i briga — jedan tim, jedan potpis.')}
              </EditableText>
            </span>
          </motion.span>
        </h1>

        {/* batch 31 (owner): the title returns to its ORIGINAL height — the batch-30
            block lowering (3.5vh) stays only below this spacer, so the cards keep his
            red-line seat while the h1 rides back up */}
        <div aria-hidden className="h-[3.5vh] w-full" />

        {/* the reviews — the train slider he approved, in the original seat, riding
            clear of the sea */}
        <Slider reduced={reduced} />
      </div>
      </div>

      {/* batch 26/27: band AND stack live INSIDE the hero beat — every razor edge (the
          band's, the surface's) is mid-beat and never scanned, so the band sits tight
          under the sea and the stack tight under the band (his no-empty-gap order).
          z-10: the content rides ABOVE the world layers below (the Beat grammar). */}
      <div className="relative z-10">
        <div aria-hidden style={{ height: 'max(4vh, 44px)' }} />
        <TrustBand />
        <div aria-hidden style={{ height: 'max(10vh, 120px)' }} />
        <ServicesStack />
        <SkyGap />
      </div>

      {/* batch 32 (owner): HIS fix, exactly — the SAME background image that paints the
          zone below the 04 box, duplicated as a TOP layer (z-20) at ~55% opacity across
          the foot line. Above and below the boundary are now the same pixels, so no tone
          step can exist. Masked so it has no edges of its own; its upper wisps thin to
          nothing before the CTA pill's worst-case seat. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-[90px] z-20 h-[360px] select-none overflow-hidden"
        style={{
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 38%, black 82%, transparent 100%)',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 38%, black 82%, transparent 100%)',
          opacity: 0.52,
        }}
      >
        <img
          src="/media/B3-square-sky.webp" alt="" loading="eager"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: '50% 68%' }}
        />
      </div>

      {/* the world through this stretch: B3's quiet sky behind the stack + THE cloud
          hovering the band→stack breath, parallax as everywhere. The last two straddle
          the section's END — across the o-nama boundary — so the eye leaves this beat
          on cloud, never on a tone step (his arrows, batch 28). */}
      <WorldLayer
        src="/media/B3-square-sky.webp" eager
        box="top-[100vh] -bottom-[10vh]"
        imgClass="absolute inset-0 h-[120%] w-full object-cover object-center"
        y={['0%', '-9%']} base={0.8} mask={MASK.sky}
      />
      <WorldLayer
        src="/media/cloud-real.webp" eager
        box="top-[105vh] h-[80vh]"
        imgClass="absolute left-[-10%] top-[6%] w-[38%] h-auto max-w-none"
        y={['0%', '-11%']} base={0.9} float={{ px: 8, sec: 10 }}
      />
      <WorldLayer
        src="/media/cloud-real.webp" eager
        box="top-[125vh] h-[80vh]"
        imgClass="absolute right-[-8%] top-[10%] w-[34%] h-auto max-w-none scale-x-[-1]"
        y={['0%', '-8%']} base={0.8} float={{ px: 7, sec: 12, delay: 1.2 }}
      />
      {/* batch 30 (owner): the bank-soft blanket is GONE — he circled it; its internal
          flat shadow WAS the line (an image's own horizon reads as a separator no matter
          how it is masked). The centre field is now a FIELD OF THE CLOUD — the real
          cumulus he loves, staggered across the width and depth like the hero sea. */}
      <WorldLayer
        src="/media/cloud-real.webp" eager
        box="-bottom-[6vh] h-[70vh]"
        imgClass="absolute left-[24%] top-[22%] w-[46%] h-auto max-w-none"
        y={['0%', '-9%']} base={0.95} float={{ px: 8, sec: 11 }}
      />
      <WorldLayer
        src="/media/cloud-real.webp" eager
        box="-bottom-[14vh] h-[64vh]"
        imgClass="absolute left-[2%] top-[38%] w-[34%] h-auto max-w-none scale-x-[-1]"
        y={['0%', '-7%']} base={0.85} float={{ px: 7, sec: 13, delay: 0.8 }}
      />
      <WorldLayer
        src="/media/cloud-real.webp" eager
        box="-bottom-[10vh] h-[60vh]"
        imgClass="absolute right-[6%] top-[30%] w-[30%] h-auto max-w-none"
        y={['0%', '-11%']} base={0.8} float={{ px: 6, sec: 9, delay: 1.5 }}
      />
      <WorldLayer
        src="/media/cloud-real.webp" eager
        box="-bottom-[26vh] h-[60vh]"
        imgClass="absolute left-[-8%] top-[16%] w-[36%] h-auto max-w-none"
        y={['0%', '-10%']} base={0.85}
      />
      <WorldLayer
        src="/media/cloud-real.webp" eager
        box="-bottom-[38vh] h-[60vh]"
        imgClass="absolute right-[-10%] top-[30%] w-[32%] h-auto max-w-none scale-x-[-1]"
        y={['0%', '-7%']} base={0.75}
      />
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
  // batch 27 (owner): the ORIGINAL look 1/1 (solid ink, shadow-inner, hard edges) — only
  // the position changed. THE LOOP IS EXACT NOW, measured: the keyframe slides -50%, so
  // each half must be one full period INCLUDING its trailing gap — the flat track had 11
  // gaps for 12 items, leaving every wrap 40px short (the "glitch after a few times").
  // Two self-padded halves make period === translation, to the pixel, forever.
  return (
    <div className="relative w-full overflow-hidden bg-ink py-8 text-tint shadow-inner sm:py-12">
      <div aria-hidden className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-20 bg-gradient-to-r from-ink to-transparent sm:w-40" />
      <div aria-hidden className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-20 bg-gradient-to-l from-ink to-transparent sm:w-40" />
      <div className="flex w-max animate-marquee items-center will-change-transform" style={{ transform: 'translateZ(0)' }}>
        {[0, 1].map((half) => (
          <div key={half} className="flex items-center gap-12 pr-12 sm:gap-16 sm:pr-16 lg:gap-20 lg:pr-20">
            {BADGES.map((b, i) => (
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
    <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-8 sm:py-5 lg:px-12 [@media(max-height:860px)]:py-3!">
      <div className="grid w-full grid-cols-12 items-start gap-2 sm:gap-6 lg:gap-8">
        <div className="col-span-4 lg:col-span-3">
          {/* batch 28 (owner): MUCH bigger, with real depth — a white top-light and a deep
              soft ink shadow lift the numeral off the surface (plain text, so text-shadow
              is safe; the Safari clipped-text law does not apply here) */}
          <span
            className="select-none text-6xl font-normal leading-none tracking-tight text-ink/90 sm:text-8xl lg:text-[clamp(88px,13vh,132px)]"
            style={{ textShadow: '0 2px 0 rgba(255,255,255,0.65), 0 14px 34px rgba(22,50,79,0.30)' }}
            aria-hidden
          >
            {s.n}
          </span>
        </div>
        <div className="col-span-8 flex flex-col pt-1 sm:pt-3 lg:col-span-9">
          <button onClick={onOpen} className="group/title flex w-full cursor-pointer items-center justify-between text-left" aria-expanded={active}>
            {/* batch 19: brand ramp (colour law) — the hover dim moved to opacity, since
                a colour change would repaint solid ink over the clipped gradient */}
            <h2 className="ink-gradient text-xl font-semibold uppercase tracking-tight transition-opacity group-hover/title:opacity-75 sm:text-3xl lg:text-[clamp(28px,4.6vh,44px)]">
              {s.title}
            </h2>
            <span aria-hidden className={`ml-4 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-ink/30 text-lg transition-all sm:h-10 sm:w-10 ${active ? 'rotate-45' : ''}`}>
              +
            </span>
          </button>
          <AnimatePresence initial={false}>
            {active && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                // batch 27: the push must feel like the old blankets — longer, softer
                transition={{ duration: 0.55, ease: [0.3, 0, 0.2, 1] }}
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
    // batch 30 (owner): 420vh — "the user should scroll MUCH more for 01 to close and
    // 02 to open"; every card now owns ~70-90vh of scroll instead of ~45, so there is
    // time to read. The last card is still open by 78% — no dead scroll trailing it.
    // batch 27 (owner): the OLD dress exactly — the base blanket whose top melts into the
    // sky across 90px and runs solid to the stage foot, full width, big numerals, the
    // sheet edges (border + upward shadow) between rows. Only the MECHANICS are new:
    // the camera locks, the active row's body expands in place, every other row shows
    // its title bar — nothing ever covers anything.
    <div ref={ref} className="relative h-[420vh] w-full">
      {/* batch 29: on SHORT viewports (≤860px tall) the head and row paddings tighten —
          the content had outgrown the pinned frame by ~35px there, leaving the CTA pill
          half-clipped at the stage foot in the released state. Taller screens unchanged. */}
      <div className="sticky top-0 flex h-screen w-full flex-col overflow-hidden pt-16 sm:pt-20 [@media(max-height:860px)]:pt-12!">
        {/* batch 29 (owner): the blanket's FOOT dissolves like its head — solid to 100%
            put a full-width razor at the stage's resting edge the moment the pin
            released (his four arrows). The fade lives in stage space, so the edge
            cannot exist at any scroll position; the world's sky breathes through. */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: `linear-gradient(to bottom, transparent 0%, ${CARD_BG} 90px, ${CARD_BG} calc(100% - 22vh), rgba(239,246,252,0) 100%)` }}
        />
        {/* batch 32 (owner): THE HALF CUT — every sheet from 02 on rides UP over the
            previous one and covers its lower half (his red line through 03's middle).
            Each overlapping sheet carries its own plate: solid through the overlap
            band, dissolving below it so no plate ever draws a bottom edge anywhere.
            The accordion mechanics (lock, one active, bodies push down) are untouched. */}
        <div className="relative flex min-h-0 flex-1 flex-col justify-start pt-4 sm:pt-6">
          {SERVICES.map((_, i) => (
            <div
              key={i}
              className={`relative ${i > 0
                ? 'border-t border-ink/25 shadow-[0_-12px_28px_rgba(22,50,79,0.07)] -mt-12 sm:-mt-16 lg:-mt-[max(64px,8vh)] [@media(max-height:860px)]:-mt-14!'
                : ''}`}
              style={{
                zIndex: i + 1,
                ...(i > 0
                  ? { background: `linear-gradient(to bottom, ${CARD_BG} 0px, ${CARD_BG} 110px, rgba(239,246,252,0) 250px)` }
                  : {}),
              }}
            >
              <StackCard i={i} active={active === i} onOpen={() => jump(i)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------- the process wheel (his revolver, b32) */

/* REAL process only — these are the pipeline's own client-facing stages; no invented
   claims, no prices (factory law). */
const PROCESS = [
  { n: '01', t: 'Upoznavanje', d: 'Prvi razgovor — cilj, obim i rok. Bez obaveza i bez žargona.' },
  { n: '02', t: 'Ponuda i ugovor', d: 'Sve pismeno: šta se radi, do kada i za koliko. Bez skrivenih troškova.' },
  { n: '03', t: 'Pravac dizajna', d: 'Prvo početna strana — izgled odobravate pre nego što gradimo ostatak.' },
  { n: '04', t: 'Izrada sajta', d: 'Sekcija po sekcija, uz pregled napretka uživo tokom cele izrade.' },
  { n: '05', t: 'Provere', d: 'Brzina, SEO, telefon i svaki klik — proveravamo sve pre lansiranja.' },
  { n: '06', t: 'Lansiranje i briga', d: 'Sajt kreće da radi za vas — a mi ostajemo uz njega i posle.' },
]

const WHEEL_STEP = 26 // degrees between seats on the arc

/** one number riding the wheel: seat at 3 o'clock (θ=0), passed steps rotate up-left
    and leave the viewport on the left — his revolver. All motion values, no re-render. */
function WheelNumber({ i, rot, R, cx, fontPx }: {
  i: number; rot: MotionValue<number>; R: number; cx: number; fontPx: number
}) {
  const rad = (d: number) => (d * Math.PI) / 180
  const th = (v: number) => v - i * WHEEL_STEP
  const numR = R * 1.19
  const x = useTransform(rot, v => cx + numR * Math.cos(rad(th(v))))
  const y = useTransform(rot, v => -numR * Math.sin(rad(th(v))))
  const dotX = useTransform(rot, v => cx + R * Math.cos(rad(th(v))))
  const dotY = useTransform(rot, v => -R * Math.sin(rad(th(v))))
  const tilt = useTransform(rot, v => -th(v) * 0.8)
  const op = useTransform(rot, v => {
    const a = Math.abs(th(v))
    if (a > 78) return 0
    return a < 5 ? 1 : Math.max(0.16, 0.3 - a / 400)
  })
  const dotOp = useTransform(rot, v => (Math.abs(th(v)) > 78 ? 0 : Math.abs(th(v)) < 5 ? 0.9 : 0.35))
  const scale = useTransform(rot, v => 1.45 - Math.min(Math.abs(th(v)) / WHEEL_STEP, 1) * 0.55)
  return (
    <>
      <motion.span
        aria-hidden
        className="absolute select-none font-bold leading-none tracking-tight text-ink"
        style={{ x, y, rotate: tilt, opacity: op, scale, fontSize: fontPx, translateX: '-50%', translateY: '-50%' }}
      >
        {PROCESS[i].n}
      </motion.span>
      <motion.span
        aria-hidden
        className="absolute h-2 w-2 rounded-full bg-ink"
        style={{ x: dotX, y: dotY, opacity: dotOp, translateX: '-50%', translateY: '-50%' }}
      />
    </>
  )
}

/** the pinned wheel: a half circle off the LEFT edge (the circle from the about
    section, moved here on his order), six numbered seats, scroll turns the cylinder —
    one step per breath, the active step's words at the seat's right. */
function ProcessWheel() {
  const ref = useRef<HTMLDivElement>(null)
  const { reduced } = useWorld()
  const [k, setK] = useState(0)
  const [dim, setDim] = useState({ R: 300, cx: 24, fontPx: 64 })
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const N = PROCESS.length
  // the revolver CLICK: the cylinder dwells on each seat (~55% of its window) and turns
  // between dwells — piecewise stops, so a resting scroll never parks between numbers
  const stops: number[] = [], angles: number[] = []
  const seg = (0.92 - 0.08) / (N - 1)
  for (let j = 0; j < N; j++) {
    const c = 0.08 + j * seg
    stops.push(Math.max(0.08, c - seg * 0.28), Math.min(0.92, c + seg * 0.28))
    angles.push(j * WHEEL_STEP, j * WHEEL_STEP)
  }
  const rot = useTransform(scrollYProgress, stops, angles, { clamp: true })

  useEffect(() => rot.on('change', v => {
    setK(Math.min(N - 1, Math.max(0, Math.round(v / WHEEL_STEP))))
  }), [rot, N])

  useEffect(() => {
    const m = () => {
      const R = Math.max(112, Math.min(window.innerHeight * 0.4, window.innerWidth * 0.3))
      setDim({ R, cx: 24, fontPx: Math.max(30, R * 0.2) })
    }
    m()
    window.addEventListener('resize', m)
    return () => window.removeEventListener('resize', m)
  }, [])

  if (reduced) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col gap-10 px-6 py-24">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-ink/60">Naš proces</p>
        {PROCESS.map(s => (
          <div key={s.n} className="flex items-baseline gap-6">
            <span className="text-4xl font-bold text-ink/30">{s.n}</span>
            <div>
              <h3 className="text-xl font-semibold text-ink">{s.t}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink/70">{s.d}</p>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const { R, cx, fontPx } = dim
  const textLeft = cx + R * 1.38 + 28
  return (
    <div ref={ref} className="relative h-[340vh] w-full">
      {/* the whole six-step process, for readers and crawlers — the wheel itself is
          decorative motion (aria-hidden numbers, one visible text at a time) */}
      <ul className="sr-only">
        {PROCESS.map(s => (
          <li key={s.n}>{s.n} — {s.t}: {s.d}</li>
        ))}
      </ul>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* weather rides INSIDE the pin — a runway layer would scroll past the stage */}
        <motion.img
          aria-hidden src="/media/cloud-real.webp" alt="" loading="eager"
          className="pointer-events-none absolute right-[-7%] top-[12%] w-[30%] max-w-none select-none opacity-80"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.img
          aria-hidden src="/media/cloud-real.webp" alt="" loading="eager"
          className="pointer-events-none absolute right-[16%] bottom-[6%] w-[24%] max-w-none select-none opacity-60 scale-x-[-1]"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 1.4 }}
        />
        <p className="absolute inset-x-0 top-24 text-center text-xs font-semibold uppercase tracking-[0.3em] text-ink/60 sm:top-28">
          Naš proces
        </p>

        {/* wheel space: local (0,0) = left edge, mid-height */}
        <div aria-hidden className="absolute left-0 top-1/2">
          {/* the thin circle — the about section's ring, reseated (his order) */}
          <div
            className="absolute rounded-full border border-ink/25"
            style={{ width: 2 * R, height: 2 * R, left: cx - R, top: -R }}
          />
          <span className="absolute h-1.5 w-1.5 rounded-full bg-ink/40" style={{ left: cx - 3, top: -3 }} />
          {PROCESS.map((_, i) => (
            <WheelNumber key={i} i={i} rot={rot} R={R} cx={cx} fontPx={fontPx} />
          ))}
        </div>

        {/* the active step's words, at the seat's right — swap per step */}
        <div
          className="absolute top-1/2 -translate-y-1/2 pr-4"
          style={{ left: textLeft, maxWidth: `min(28rem, calc(100vw - ${Math.round(textLeft)}px - 1rem))` }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={k}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.35, ease: [0.3, 0, 0.2, 1] }}
            >
              <h3 className="ink-gradient text-xl font-semibold uppercase tracking-tight sm:text-2xl lg:text-3xl">
                {PROCESS[k].t}
              </h3>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink/75 sm:text-base">
                {PROCESS[k].d}
              </p>
            </motion.div>
          </AnimatePresence>
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

          {/* batch 32 (owner): NAŠ PROCES — the revolver wheel between the stack and
              KO SMO MI (his Pinterest references): six steps on a half circle off the
              left edge, the camera locks, scroll turns the cylinder. */}
          <Beat name="proces" layers={
            <WorldLayer
              src="/media/cloud-real.webp" eager
              box="top-[20vh] h-[70vh]"
              imgClass="absolute right-[-8%] top-[20%] w-[30%] h-auto max-w-none scale-x-[-1]"
              y={['0%', '-9%']} base={0.75} float={{ px: 7, sec: 11 }}
            />
          }>
            <ProcessWheel />
            <div aria-hidden style={{ height: '16vh' }} />
          </Beat>

          {/* batch 28 (owner): the about composition joins /usluge — the same layout, sea
              layer and grammar as /radovi, seated between the stack and the finale so the
              page closes exactly like the portfolio (his order; the FAQ deliberately
              absent). Batch 29 (owner): its OWN words — „KO SMO MI" and two new text
              blocks — so the two pages rhyme without repeating. */}
          <Beat name="o-nama" layers={
            <>
              <WorldLayer
                src="/media/B7-vertical-sea.webp"
                box="-top-[30vh] -bottom-[36vh]"
                imgClass="absolute inset-0 h-[128%] w-full object-cover object-center"
                y={['0%', '-10%']} base={0.55} mask={MASK.sea}
              />
              <WorldLayer
                src="/media/cloud-real.webp" eager
                box="-top-[10vh] -bottom-[10vh]"
                imgClass="absolute right-[-6%] top-[8%] w-[34%] h-auto max-w-none scale-x-[-1]"
                y={['0%', '-12%']} base={0.8}
              />
            </>
          }>
            <SveONama
              circle={false}
              wordTop="KO"
              wordFloat="SMO"
              wordBottom="MI"
              para1="DreamSign je full-service agencija za dizajn i izradu sajtova. Od prve skice do lansiranja sve nastaje pod jednim krovom i jednim potpisom — direktno, bez posrednika, sa ljudima koji vaš projekat zaista grade."
              para2="Verujemo u pismen dogovor, fiksan rok i sajt koji na kraju pripada vama. Tako se gradi poverenje — i radovi kojima se s ponosom potpisujemo."
            />
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
