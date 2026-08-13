// /radovi — batch 13: Nick built the layout himself (AI Studio reference, 2026-08-03) and
// the factory executes it 1/1: hero (script into giant RADOVI + name/role row), three
// project sections in three different frame geometries (bento 5/7 · full-bleed strip ·
// edge columns 25/50/25), the SVE O NAMA composition (HIS COPY, VERBATIM, LOCKED), and
// the FAQ split. Skin, faces, world and motion stay ours; his navy → our ink, his red →
// our signature blue. Every tile is a REAL capture of the live client sites.
//
// JUNCTION LAW: the ink frames are content plates mid-beat. Every beat boundary is padded
// with ≥320px of open sky on each side (SkyGap), so the seams the rig scans stay seams.
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useTransform } from 'motion/react'
import type { MotionValue } from 'motion/react'
import { World, WorldLayer, SeamBridge, Beat, useWorld, useWorldRange } from '../components/World'
import PageHero from '../components/PageHero'
import CloudButton from '../components/CloudButton'
import LandingCTA from '../components/LandingCTA'
import SveONama from '../components/SveONama'
import FaqSekcija from '../components/FaqSekcija'
import Ground from '../components/Ground'
import { MASK } from '../lib/masks'
import { WA_LINK } from '../lib/hooks'
import { bk } from '../lib/content'
import { usePageMeta } from '../lib/meta'
import { PAGE_SCHEMA } from '../lib/schema'

/* ---------------------------------------------------------------- shared pieces */

/** batch 18 — text columns drift gently against the scroll (M5 whisper parallax on the
    world's one progress value; still transforms only, off under reduced motion) */
function Drift({ children, amp = 16, className = '' }: { children: React.ReactNode; amp?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { p: world, reduced } = useWorld()
  const [enter, exit] = useWorldRange(ref, 1.0, 0.1)
  const y = useTransform(world, [enter, exit], [amp, -amp])
  return (
    <motion.div ref={ref} style={reduced ? undefined : { y }} className={className}>
      {children}
    </motion.div>
  )
}

/** batch 18 — a peeking cloud breaking a frame's straight edge (never a bare ruler line).
    batch 19: the layer is the caller's choice (z-0 behind the frame, z-20 riding on top).
    batch 21: the asset is the caller's choice too — the corner clouds wear the two NEW
    fluffy watercolour clouds (owner's variety note) while the old seats keep bank-soft. */
function CornerCloud({ className, src = '/media/bank-soft.webp' }: { className: string; src?: string }) {
  // batch 41 (owner): the corner clouds FLOAT in place now — a slow idle bob, off under
  // reduced motion like all weather
  const { reduced } = useWorld()
  return (
    <motion.img
      src={src} alt="" aria-hidden decoding="async" loading="lazy"
      className={`pointer-events-none absolute max-w-none select-none ${className}`}
      animate={reduced ? undefined : { y: [0, -7, 0] }}
      transition={reduced ? undefined : { duration: 7.5, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

/** batch 18 — the shelf of clouds the Metal Kolor cards stand on: pure sky behind, big
    soft banks drifting between the world and the cards */
function CloudShelf({ children }: { children: React.ReactNode }) {
  const { reduced } = useWorld()
  const float = (sec: number, delay = 0) =>
    reduced ? {} : { animate: { y: [0, -10, 0] }, transition: { duration: sec, repeat: Infinity, ease: 'easeInOut' as const, delay } }
  return (
    <div className="relative w-full px-3 sm:px-4 lg:px-6">
      {/* batch 19 (owner): lighter — the storybook cloud read too dark behind the cards;
          lower opacity lets the world sky through, the brightness lift washes the shading */}
      <img
        src="/media/hero-cloud-foreground.webp" alt="" aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 w-[115%] max-w-none -translate-x-1/2 -translate-y-[42%] select-none opacity-60"
        style={{ filter: 'brightness(1.14)' }}
      />
      <motion.img
        src="/media/bank-soft.webp" alt="" aria-hidden {...float(9, 0.6)}
        className="pointer-events-none absolute -left-[10%] -top-[16%] w-[46%] max-w-none select-none opacity-80"
      />
      <motion.img
        src="/media/bank-soft.webp" alt="" aria-hidden {...float(10, 1.4)}
        className="pointer-events-none absolute -bottom-[18%] -right-[8%] w-[42%] max-w-none select-none opacity-75 scale-x-[-1]"
      />
      <div className="relative grid grid-cols-1 gap-4 py-8 md:grid-cols-3 sm:gap-5 lg:py-10">
        {children}
      </div>
    </div>
  )
}

/* batch 21 (owner) — the references that rotate under the invitation. REAL-CONTENT LAW:
   these are TRUE one-line project references in our own words, attributed to the PROJECT,
   never invented quotes from invented people (the D62 rule). The seats become client
   quotes verbatim the day Nick sends real ones. */
const REFERENCES = [
  { t: 'Tri linije posla — prodavnica, tereni i turniri — pod jednim digitalnim krovom.', s: 'Court Hub · Dubai' },
  { t: 'Meni, priča i porudžbina na dva klika — sajt u duhu lokala.', s: 'Pizzdarija · Novi Sad' },
  { t: 'Katalog, galerija i kontakt — mušterija za dva klika nađe ono po šta je došla.', s: 'Metal Kolor · Srem' },
  { t: 'Od ideje do objavljenog naučnog rada — platforma i akademija na jednom mestu.', s: 'MindxBridge · platforma + akademija' },
]

/** the auto-rotating reference line — crossfade + rise, ~4.5s per seat, still under
    reduced motion (first reference only) */
function ReferenceRotator() {
  const { reduced } = useWorld()
  const [i, setI] = useState(0)
  useEffect(() => {
    if (reduced) return
    const id = setInterval(() => setI((v) => (v + 1) % REFERENCES.length), 4500)
    return () => clearInterval(id)
  }, [reduced])
  // batch 24 (owner): NO box — the white card read as an empty blob mid-rotation (the
  // crossfade left it blank for a second). The reference lives directly on the sky in
  // the world's own vocabulary: quill mark, the line, a glass chip for the project —
  // and every seat is ALWAYS painted (absolute stack, opacity swap; never an empty beat).
  return (
    <div className="relative mt-7 flex w-full max-w-md flex-col items-center">
      <span
        aria-hidden
        className="font-script text-[2.4rem] leading-none text-accent"
        style={{ textShadow: '0 2px 16px rgba(245,249,253,0.9)' }}
      >
        „
      </span>
      <div className="relative mt-1 h-[104px] w-full sm:h-[96px]">
        {REFERENCES.map((r, d) => (
          <motion.figure
            key={d}
            initial={false}
            animate={reduced ? { opacity: d === 0 ? 1 : 0 } : { opacity: d === i ? 1 : 0, y: d === i ? 0 : 8 }}
            // the outgoing line leaves FIRST, the incoming waits its turn — two quotes may
            // never superimpose (and the stage is never empty long enough to read blank)
            transition={
              d === i
                ? { duration: 0.5, delay: 0.28, ease: [0.16, 1, 0.3, 1] }
                : { duration: 0.24, ease: 'easeOut' }
            }
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-start gap-3 text-center"
          >
            <blockquote
              className="text-[15px] font-medium leading-relaxed text-ink/90 sm:text-[16px]"
              style={{ textShadow: '0 1px 14px rgba(245,249,253,0.9)' }}
            >
              {r.t}
            </blockquote>
            <figcaption className="liquid-glass rounded-full px-4 py-1.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-accent sm:text-[10.5px]">
              {r.s}
            </figcaption>
          </motion.figure>
        ))}
      </div>
      {/* the seat dots — quiet, clickable */}
      <div className="pointer-events-auto mt-1 flex gap-2">
        {REFERENCES.map((_, d) => (
          <button
            key={d}
            type="button"
            aria-label={`Referenca ${d + 1}`}
            onClick={() => setI(d)}
            className={`h-1.5 w-1.5 cursor-pointer rounded-full transition-colors duration-300 ${
              d === i ? 'bg-accent' : 'bg-ink/25 hover:bg-ink/45'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

/** batch 19/21 (owner) — the invitation: the hero's own duet grammar („Postanite i vi" in
    the primary, „deo našeg uspeha!" in the quill), the cloud button, and the rotating
    references underneath */
function MiniCTA() {
  const { reduced } = useWorld()
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 flex flex-col items-center px-5 text-center"
    >
      {/* batch 57: presentational — the invitation is rendered twice (plain flow + the
          pinned swap), so the beat's single heading for it lives in TreciBlok. Classes
          untouched; only the tag changed. */}
      <div aria-hidden className="leading-none">
        <span className="ink-gradient block whitespace-nowrap font-semibold tracking-tight text-[clamp(2.1rem,4.4vw,4rem)]">
          Postanite i vi
        </span>
        <span
          className="mt-[0.04em] block whitespace-nowrap font-script font-normal leading-[0.95] text-accent text-[clamp(2.4rem,5.1vw,4.7rem)]"
          style={{ textShadow: '0 2px 20px rgba(245,249,253,0.9)' }}
        >
          deo našeg uspeha!
        </span>
      </div>
      <CloudButton label="Započnite razgovor" href={WA_LINK} reduced={reduced} className="mt-3" />
      <ReferenceRotator />
    </motion.div>
  )
}

/** the tilted script word above the giant headline — batch 23 (owner's exact rule): drop
    a vertical line from the rotated word's CENTRE and it lands on the title text's
    TOP-LEFT corner, with no ink overlapping the title. It anchors to the WORD's real box
    (rendered inside GiantH2), so the seat is identical on all three projects and at
    every width. The outer span owns the seat (Tailwind translates), the inner motion
    span owns the entrance — framer overwrites `transform`, so they may never share. */
function TiltScript({ word }: { word: string }) {
  return (
    <span
      aria-hidden
      // batch 24/25: lowered again — the word rides just above the title's cap, close but
      // never touching
      // batch 53 follow-up (owner): REVERTED to the original seat and it stays there. His
      // rule, verbatim: the word's centre sits on the LEFT EDGE of „PROJEKAT" — which is
      // exactly left-0 of the word's own wrapper plus a half-width translate. I had nudged
      // it right to keep it off the viewport edge; he never asked for that. Do not move it.
      className="pointer-events-none absolute left-0 top-0 z-20 block -translate-x-1/2 -translate-y-[64%]"
    >
      <motion.span
        initial={{ opacity: 0, scale: 0.85, rotate: -16, y: 15 }}
        whileInView={{ opacity: 1, scale: 1, rotate: -12, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="block font-script font-normal normal-case leading-none tracking-normal text-accent
                   text-[clamp(2.2rem,4.5vw,3.9rem)]"
        style={{ textShadow: '0 2px 16px rgba(245,249,253,0.85)' }}
      >
        {word}
      </motion.span>
    </span>
  )
}

/** the giant condensed section headline, ink gradient (the homepage h1's own ramp).
    batch 23: `tilt` renders the script word INSIDE, anchored to the title text's own
    inline box — the only anchor that tracks the glyphs at every width and alignment. */
function GiantH2({ children, tilt, align = 'center', as = 'h2' }: {
  children: React.ReactNode; tilt?: string; align?: 'center' | 'left'
  /** batch 57: „Treći" renders TWICE (the plain flow and the pinned swap are both in the
      DOM, CSS picks one), so its copies pass `as="div"` and the beat carries one sr-only
      heading instead. Prvi and Drugi are rendered once and stay real headings. */
  as?: 'h2' | 'div'
}) {
  const Tag = as === 'div' ? motion.div : motion.h2
  return (
    <Tag
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, delay: 0.15 }}
      // whitespace-nowrap + a wider-than-container box: bg-clip-text paints NOTHING outside
      // the element, so a word wider than its box loses letters (the first cut showed
      // "PROJEK" — Inter Tight is wider than the reference's condensed face)
      className={`giant-ramp w-[115%] max-w-none whitespace-nowrap pt-6 font-semibold uppercase tracking-tight leading-[0.85]
                  text-[clamp(3rem,7.6vw,7.4rem)]
                  ${align === 'left' ? 'text-center lg:text-left' : 'text-center'}`}
      // NO filter here, ever: Safari refuses to paint background-clip:text when the same
      // element carries a filter — „PROJEKAT" was INVISIBLE on Nick's MacBook (batch 25).
      // batch 51: the gradient itself moved to .giant-ramp — it carries the -webkit- prefix
      // iOS needs, and below md it paints solid ink instead of clipping (his iPhone showed
      // „Prvi" but no „PROJEKAT" at all).
      style={{
        padding: '0.18em 0.05em',
        margin: '-0.12em calc(-7.5% - 0.05em)',
      }}
    >
      <span className="relative">
        {children}
        {tilt && <TiltScript word={tilt} />}
      </span>
    </Tag>
  )
}

/** one bento tile: a real capture of the live site, panning gently on the world's scroll */
function Tile({ src, alt, href, className = '', delay = 0 }: {
  src: string; alt: string; href: string; className?: string; delay?: number
}) {
  return (
    <motion.a
      href={href} target="_blank" rel="noopener"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay }}
      className={`group relative block overflow-hidden rounded-2xl border border-white/70 bg-white shadow-md ${className}`}
    >
      <img
        src={src} alt={alt} decoding="async" loading="lazy"
        className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
      />
    </motion.a>
  )
}

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7, delay: 0.12 * i },
})

/** the paragraph + meta/link line each project carries (the live-links law); batch 15:
    an optional „Pročitaj više" expander — the case story (problem → rešenje → efekat)
    grows downward, and because the text column is vertically centred, the giant title
    above visibly RISES to make room, exactly the push the owner described */
function ProjectCopy({ text, meta, href, label, href2, label2, align = 'center', more }: {
  text: string; meta: string; href: string; label: string; align?: 'center' | 'left'
  /** batch 19: a project that shipped as TWO live sites carries both links */
  href2?: string; label2?: string
  more?: { problem: string; fix: string; effect: string }
}) {
  const [openMore, setOpenMore] = useState(false)
  const alignCls = align === 'left' ? 'text-center lg:text-left' : 'text-center'
  return (
    <>
      <motion.p
        {...fadeUp(2)}
        className={`max-w-lg text-[16px] font-medium leading-relaxed text-ink/75 sm:text-lg lg:text-xl ${alignCls}`}
      >
        {text}
      </motion.p>
      <motion.p
        {...fadeUp(3)}
        className={`mt-5 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ink/55 ${alignCls}`}
      >
        {meta} ·{' '}
        <a href={href} target="_blank" rel="noopener" className="text-accent transition-colors hover:text-ink inline-block py-2.5 -my-2">
          {label} ↗
        </a>
        {href2 && label2 && (
          <>
            {' '}·{' '}
            <a href={href2} target="_blank" rel="noopener" className="text-accent transition-colors hover:text-ink inline-block py-2.5 -my-2">
              {label2} ↗
            </a>
          </>
        )}
      </motion.p>
      {more && (
        <>
          <motion.button
            {...fadeUp(4)}
            type="button"
            onClick={() => setOpenMore(!openMore)}
            aria-expanded={openMore}
            className="group/m mt-5 inline-flex cursor-pointer items-center gap-2 rounded-full border border-accent/40
                       px-5 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-accent
                       transition-colors duration-300 hover:border-accent hover:bg-white/50"
          >
            {openMore ? 'Zatvori' : 'Pročitaj više'}
            <span aria-hidden className={`transition-transform duration-300 ${openMore ? 'rotate-45' : ''}`}>+</span>
          </motion.button>
          <AnimatePresence initial={false}>
            {openMore && (
              <motion.div
                key="story"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="w-full overflow-hidden"
              >
                <dl className={`max-w-lg space-y-3 pt-5 text-[14px] leading-relaxed text-ink/75 ${align === 'left' ? 'text-left' : 'text-left'}`}>
                  <div>
                    <dt className="text-[12px] font-semibold uppercase tracking-[0.16em] text-ink/50">Problem</dt>
                    <dd className="mt-0.5">{more.problem}</dd>
                  </div>
                  <div>
                    <dt className="text-[12px] font-semibold uppercase tracking-[0.16em] text-ink/50">Rešenje</dt>
                    <dd className="mt-0.5">{more.fix}</dd>
                  </div>
                  <div>
                    <dt className="text-[12px] font-semibold uppercase tracking-[0.16em] text-accent/80">Efekat</dt>
                    <dd className="mt-0.5">{more.effect}</dd>
                  </div>
                </dl>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </>
  )
}

/* ------------------------------------------- project 1 · Court Hub (5/7 bento) —
   batch 14: Nick's own past project ("we legally can take credits for it", 2026-08-03) */

function ProjekatPrvi() {
  return (
    <div className="grid w-full grid-cols-1 items-center lg:grid-cols-12">
      {/* LEFT 5: centred text block, tilted script above the giant word */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 py-12 text-center sm:px-10 lg:col-span-5 lg:px-14">
        <Drift amp={18} className="relative flex w-full max-w-lg flex-col items-center justify-center">
          <GiantH2 tilt="Prvi">Projekat</GiantH2>
          <div className="mt-6">
            <ProjectCopy
              text="Premium padel brend iz Dubaija — prodavnica opreme, izgradnja terena i turniri, sve pod jednim digitalnim krovom, građeno za publiku koja traži vrhunsko."
              meta="Court Hub — e-commerce + brend · UAE"
              href="https://courthub.ae/" label="courthub.ae"
              more={{
                problem: 'Tri linije posla — prodavnica, izgradnja terena i turniri — živele su razdvojeno, bez jednog mesta koje priča celu priču brenda.',
                fix: 'Jedan sajt spaja sve tri: e-commerce prodavnica u AED, konfigurator terena sa upitom za ponudu i turnirska zajednica, dvojezično za publiku Emirata.',
                effect: 'Svaki kanal sada vodi ka istom digitalnom domu — kupac, investitor i igrač stižu do svog cilja u par klikova, a brend nastupa kao jedna celina.',
              }}
            />
          </div>
        </Drift>
      </div>

      {/* RIGHT 7: the ink-framed bento — 2 columns (22/50/28 + 48/52), reference geometry */}
      <div className="relative flex items-center p-4 sm:p-6 lg:col-span-7 lg:p-8 lg:pl-0">
        <CornerCloud className="z-0 -right-[6%] -top-[4%] w-[38%] opacity-90" />
        <CornerCloud className="z-0 -bottom-[6%] left-[2%] w-[30%] opacity-80 scale-x-[-1]" />
        <div className="relative z-10 grid h-[560px] w-full transform-gpu grid-cols-2 gap-3 overflow-hidden rounded-3xl bg-ink p-3 shadow-xl sm:h-[640px] sm:gap-4 sm:p-4 lg:h-[700px] lg:p-5">
          <div className="flex h-full flex-col gap-3 sm:gap-4">
            <Tile src="/media/radovi/bento/courthub-1.jpg" alt="Court Hub — vrh sajta" href="https://courthub.ae/" className="h-[22%]" />
            <Tile src="/media/radovi/bento/courthub-2.jpg" alt="Court Hub — brojke i usluge" href="https://courthub.ae/" className="h-[50%]" delay={0.1} />
            {/* the accent tile: the project's name on our ink ground (reference: accent block) */}
            <motion.a
              {...fadeUp(2)}
              href="https://courthub.ae/" target="_blank" rel="noopener"
              className="group relative flex h-[28%] flex-col items-center justify-center gap-1.5 overflow-hidden rounded-2xl border border-white/30 shadow-md"
              style={{ background: 'linear-gradient(135deg, #22385A 0%, #16324F 100%)' }}
            >
              <span className="text-2xl font-bold uppercase tracking-[0.18em] text-white/95 transition-transform duration-300 group-hover:scale-105 sm:text-3xl">
                Court&nbsp;Hub
              </span>
              <span className="text-[12px] font-semibold uppercase tracking-[0.2em] text-white/60">
                Dubai · UAE
              </span>
            </motion.a>
          </div>
          <div className="flex h-full flex-col gap-3 sm:gap-4">
            <Tile src="/media/radovi/bento/courthub-3.jpg" alt="Court Hub — izgradnja terena" href="https://courthub.ae/" className="h-[48%]" delay={0.15} />
            <Tile src="/media/radovi/bento/courthub-4.jpg" alt="Court Hub — prodavnica" href="https://courthub.ae/" className="h-[52%]" delay={0.25} />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------ project 2 · MindxBridge (full-bleed strip) —
   batch 19 (owner): his own project, two live sites (mindxbridge.com + .academy),
   credited per his written statement 2026-08-04. Metal Kolor stays in the homepage
   cascade; this seat now shows the research platform + its academy. */

function ProjekatDrugi() {
  return (
    <div className="flex w-full flex-col gap-5 sm:gap-7">
      {/* TOP: title left / paragraph right (6/6, reference geometry) */}
      <div className="mx-auto w-full max-w-[1400px] px-6 sm:px-10 lg:px-14">
        <div className="grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-12">
          {/* batch 23 (owner): the pl-14 indent is GONE — it pushed the title right until
              the T fell off the column's edge; back left where it lived before */}
          <div className="relative flex flex-col items-center text-center lg:col-span-6 lg:items-start lg:text-left">
            <Drift amp={18} className="relative flex w-full max-w-lg flex-col items-center lg:items-start">
              <GiantH2 tilt="Drugi" align="left">Projekat</GiantH2>
            </Drift>
          </div>
          <Drift amp={10} className="flex flex-col items-center lg:col-span-6 lg:items-start lg:justify-self-end">
            <ProjectCopy
              align="left"
              text="Istraživački inkubator za medicinu — platforma koja studente i lekare vodi od ideje do objavljenog naučnog rada, uz mentorstvo i jasan tok. Uz nju stoji i akademija: kursevi kliničkog istraživanja i primene veštačke inteligencije u medicini."
              meta="MindxBridge — platforma + akademija"
              href="https://mindxbridge.com/" label="mindxbridge.com"
              href2="https://mindxbridge.academy/" label2="mindxbridge.academy"
            />
          </Drift>
        </div>
      </div>

      {/* BOTTOM (batch 18, owner): NO plate at all — the three cards float ON the world's
          own sky, with big soft clouds drifting behind them. There is nothing to clash
          with the one-world background and no plate edge that could ever read as a line —
          the fix that ALWAYS holds, because the background here IS the background. */}
      <CloudShelf>
        <Tile src="/media/radovi/bento/mindxbridge-1.jpg" alt="MindxBridge — vrh platforme" href="https://mindxbridge.com/" className="relative h-[320px] md:h-[380px] lg:h-[430px]" />
        <Tile src="/media/radovi/bento/mindxbridge-2.jpg" alt="MindxBridge — usluge i tok istraživanja" href="https://mindxbridge.com/" className="relative h-[320px] md:h-[380px] lg:h-[430px]" delay={0.15} />
        <Tile src="/media/radovi/bento/mindxbridge-3.jpg" alt="MindxBridge Academy — kursevi" href="https://mindxbridge.academy/" className="relative h-[320px] md:h-[380px] lg:h-[430px]" delay={0.3} />
      </CloudShelf>
    </div>
  )
}

/* ------------------------------- project 3 · Pizzdarija (edge columns, 25/50/25) */

function EdgeColumn({ side, shots }: { side: 'left' | 'right'; shots: [string, string, string] }) {
  const r = side === 'left' ? 'rounded-r-xl lg:rounded-r-2xl' : 'rounded-l-xl lg:rounded-l-2xl'
  const frame = side === 'left' ? 'lg:rounded-r-3xl pr-3 lg:pr-4 pl-0' : 'lg:rounded-l-3xl pl-3 lg:pl-4 pr-0'
  const x = side === 'left' ? -20 : 20
  return (
    <div className="relative flex h-full min-h-[420px] w-full items-center lg:col-span-3 lg:min-h-[640px]">
      {/* the anchor box wears the FRAME's exact height (max-h cap included) so the corner
          cloud centres on the frame's real corner — anchored to the full-height column it
          floated ~60px above the ink (the frame centres inside the column) */}
      <div className="relative my-auto h-full max-h-[780px] w-full">
        {/* batch 19/20/21 (owner, screenshots): the corner clouds ride the TOP layer at
            full opacity over the frame corners — batch 21 gives each side its OWN new
            fluffy watercolour cloud and nudges both slightly up and onto their frame,
            the direction of his arrows. Left 25°, right −30°. */}
        {/* batch 22: vertical overhang eased to 38% — the cloud still rides its corner but
            its crown always fits inside the centred stage's top gap (no more half clouds
            under the lock, his screenshot 4) */}
        {/* batch 23 (owner): the two clouds SWAPPED seats — each keeps its rotation.
            batch 41 (owner): MUCH smaller and BEHIND the content boxes (z-0 under the
            z-10 frames), floating in place. */}
        <CornerCloud
          src={side === 'left' ? '/media/cloud-corner-r.webp' : '/media/cloud-corner-l.webp'}
          className={
            side === 'left'
              ? 'right-0 top-0 z-0 w-[26%] translate-x-[34%] -translate-y-[34%] rotate-[25deg]'
              : 'left-0 top-0 z-0 w-[30%] -translate-x-[34%] -translate-y-[34%] rotate-[-30deg]'
          }
        />
        {/* fixed tile heights below lg: an unconstrained h-full chain resolves from the IMAGE
            intrinsic size — lazy tiles measured 240px short and every beat below drifted 498px */}
        <div className={`relative z-10 flex h-full w-full transform-gpu flex-col justify-between gap-3 overflow-hidden bg-ink p-3 py-3 shadow-xl sm:gap-4 sm:p-4 ${frame}`}>
        {shots.map((src, i) => (
          <motion.a
            key={src}
            href="https://www.pizzdarija.rs/" target="_blank" rel="noopener"
            initial={{ opacity: 0, x }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
            className={`group block w-full overflow-hidden bg-white/10 ${r} ${i === 1 ? 'h-[320px] lg:h-auto lg:min-h-[200px] lg:flex-1' : 'h-[120px] sm:h-[150px] lg:h-[160px]'}`}
          >
            <img src={src} alt="Pizzdarija — prikaz sajta" decoding="async" loading="lazy"
                 className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
          </motion.a>
        ))}
        </div>
      </div>
    </div>
  )
}

const TRECI_SHOTS = {
  left: ['/media/radovi/bento/pizzdarija-1.jpg', '/media/radovi/bento/pizzdarija-2.jpg', '/media/radovi/bento/pizzdarija-3.jpg'] as [string, string, string],
  right: ['/media/radovi/bento/pizzdarija-4.jpg', '/media/radovi/bento/pizzdarija-5.jpg', '/media/radovi/bento/pizzdarija-6.jpg'] as [string, string, string],
}

/** the centre column's content — shared by the plain flow and the pinned scene */
function TreciSadrzaj() {
  return (
    <Drift amp={18} className="relative flex w-full max-w-lg flex-col items-center justify-center">
      <GiantH2 tilt="Treći" as="div">Projekat</GiantH2>
      <div className="mt-6">
        <ProjectCopy
          text="Picerija sa picom na drva iz Novog Sada — meni, priča i porudžbina na dva klika, u duhu lokala koji miriše na vatru."
          meta="Pizzdarija — web sajt · Novi Sad"
          href="https://www.pizzdarija.rs/" label="pizzdarija.rs"
          more={{
            problem: 'Priča o testu od 72h i pici na drva nije imala digitalni dom — meni je živeo po slikama, a porudžbina je tražila telefonski poziv.',
            fix: 'Sajt u duhu lokala: meni sa cenama, priča o vatri i fermentaciji, i porudžbina svedena na dva klika — sa telefona, gde gosti i jesu.',
            effect: 'Gost od prvog dodira do porudžbine stiže bez zvanja i čekanja, a lokal ima izlog koji radi i kad je pećnica ugašena.',
          }}
        />
      </div>
    </Drift>
  )
}

function ProjekatTreci() {
  return (
    <div className="grid w-full grid-cols-1 items-stretch lg:grid-cols-12">
      {/* batch 51 (owner): on lg the two columns flank the text — left, words, right. When
          the grid folds to one column the LEFT column lands ABOVE the words, so the phone
          showed Pizzdarija's plates twice: once before the text and once after. Below lg
          the left column is dropped — the reader meets the third project's words first and
          its plates once, underneath (his exact instruction). Desktop is untouched. */}
      <div className="hidden lg:contents">
        <EdgeColumn side="left" shots={TRECI_SHOTS.left} />
      </div>

      <div className="relative z-10 my-auto flex flex-col items-center justify-center px-6 py-12 text-center sm:px-10 lg:col-span-6 lg:px-14">
        <TreciSadrzaj />
      </div>

      <EdgeColumn side="right" shots={TRECI_SHOTS.right} />
    </div>
  )
}

/* ------------------------------------------- THE SWAP (batch 20, owner's big goal):
   Treći Projekat pins for 180vh of scroll. As the visitor scrolls, the invitation rises
   from below and pushes the project's text out the top; the Pizzdarija frames slide off
   to their sides and OUR baby-blue panels take their exact seats — „this can be your
   next success". Local useScroll READS the pin's slice (the TextFill / blanket-stack
   precedent — never a second driver). Reduced motion and <lg keep the plain flow. */

/** a brand panel wearing the EdgeColumn's exact geometry, on the baby blues.
    batch 21 (owner, blue lines): split into THIRDS by two quiet separator lines — six
    boxes across the two panels, seats for future client images; the brand content keeps
    the middle third. */
function BrandPanel({ side, textOpacity }: { side: 'left' | 'right'; textOpacity: MotionValue<number> }) {
  const frame = side === 'left' ? 'rounded-r-3xl' : 'rounded-l-3xl'
  // batch 22/23 (owner): every third carries a PLATE — a lighter inset surface that reads
  // as an empty image seat; the separator rules are gone (his batch-23 note), the plates
  // alone carry the three-box read
  const plate = 'm-3 flex flex-1 flex-col items-center justify-center gap-5 rounded-2xl border border-white/70 bg-white/40 px-5 shadow-[inset_0_2px_12px_rgba(22,50,79,0.07)]'
  return (
    <div className="relative flex h-full w-full items-center">
      <div
        className={`flex h-full max-h-[780px] w-full flex-col overflow-hidden
                    border border-white/70 text-center shadow-xl ${frame}`}
        style={{ background: 'linear-gradient(180deg, #A8CEF0 0%, #C9DFF4 55%, #DCEBF8 100%)' }}
      >
        {/* box 1 — a plated seat for a client image */}
        <div className={plate} />
        {/* box 2 — the brand's own seat, on its plate */}
        <div className={plate}>
          {side === 'left' ? (
            <img src="/media/brand/cloud-d.webp" alt="" aria-hidden
                 className="h-16 w-auto drop-shadow-[0_8px_18px_rgba(22,50,79,0.25)] lg:h-20" />
          ) : (
            <p aria-hidden className="leading-none">
              <span className="align-baseline font-semibold tracking-tight text-ink text-3xl lg:text-4xl">Dream</span>
              <span className="align-baseline font-script font-normal text-accent text-4xl lg:text-5xl">Sign</span>
            </p>
          )}
          <motion.div style={{ opacity: textOpacity }} className="flex flex-col items-center gap-2">
            <span
              className="font-script font-normal leading-tight text-accent text-[clamp(1.9rem,2.4vw,2.6rem)]"
              style={{ textShadow: '0 2px 14px rgba(245,249,253,0.8)' }}
            >
              {side === 'left' ? 'Ovo može biti' : 'Vi ste'}
            </span>
            <span className="ink-gradient font-semibold uppercase tracking-[0.14em] text-[clamp(0.95rem,1.3vw,1.25rem)]">
              {side === 'left' ? 'vaš sledeći uspeh' : 'naš sledeći rezultat'}
            </span>
          </motion.div>
        </div>
        {/* box 3 — a plated seat for a client image */}
        <div className={plate} />
      </div>
    </div>
  )
}

/** the pin's runway, in viewports — the scene scrubs over (RUNWAY_VH − 100)vh of scroll */
const RUNWAY_VH = 280

function TreciScena() {
  const ref = useRef<HTMLDivElement>(null)
  // driven by the WORLD's one progress value, not a local useScroll: the target-based
  // scroll reader went NON-MONOTONIC over this runway's tail (t rose to ~0.86 at 4550px
  // then fell back to 0.62 by the release point — measured, reproducible on fresh loads),
  // so the panel text faded back out exactly when it mattered. useWorldRange slices the
  // proven driver instead: enter = runway top at viewport top, exit = runway consumed.
  const { p: world } = useWorld()
  const [enter, exit] = useWorldRange(ref, 0, -(RUNWAY_VH / 100 - 1))
  const t = useTransform(world, [enter, exit], [0, 1], { clamp: true })

  // the choreography: project out ↑ and frames out ↔ first; the invitation rides up
  // through the vacated centre; our panels arrive and are SEATED before the CTA lands
  const oldY = useTransform(t, [0.06, 0.62], ['0vh', '-118vh'])
  const oldLeftX = useTransform(t, [0.08, 0.56], ['0%', '-140%'])
  const oldRightX = useTransform(t, [0.08, 0.56], ['0%', '140%'])
  const ctaY = useTransform(t, [0.14, 0.78], ['114vh', '0vh'])
  const inLeftX = useTransform(t, [0.34, 0.74], ['-140%', '0%'])
  const inRightX = useTransform(t, [0.34, 0.74], ['140%', '0%'])
  const inText = useTransform(t, [0.62, 0.9], [0, 1])

  // batch 22 (owner): the side columns wear an EXPLICIT height and self-centre, so the
  // locked viewport shows equal sky above and below them at every window size — and the
  // corner clouds' overhang always fits inside the top gap (nothing to clip).
  const COL_H = 'h-[min(720px,calc(100vh-9rem))]'

  return (
    <div ref={ref} className="relative w-full" style={{ height: `${RUNWAY_VH}vh` }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="grid h-full w-full grid-cols-12 items-center">
          {/* the outgoing act. The column wrappers carry padding + negative margins that
              cancel in layout but GROW the composited layer's bounds — Safari rasterised
              the moving layer at the column box and rectangular-clipped the corner cloud
              overhang (Nick's MacBook, batch 21); Chrome never showed it. Margins stay
              SYMMETRIC vertically so the centring holds true. */}
          <motion.div style={{ x: oldLeftX }} className={`col-span-3 col-start-1 row-start-1 self-center transform-gpu ${COL_H} -my-24 py-24 -mr-28 pr-28 box-content`}>
            <EdgeColumn side="left" shots={TRECI_SHOTS.left} />
          </motion.div>
          <motion.div
            style={{ y: oldY }}
            className="col-span-6 col-start-4 row-start-1 flex h-full transform-gpu flex-col items-center justify-center px-6 text-center lg:px-14"
          >
            <TreciSadrzaj />
          </motion.div>
          <motion.div style={{ x: oldRightX }} className={`col-span-3 col-start-10 row-start-1 self-center transform-gpu ${COL_H} -my-24 py-24 -ml-28 pl-28 box-content`}>
            <EdgeColumn side="right" shots={TRECI_SHOTS.right} />
          </motion.div>

          {/* the incoming act */}
          <motion.div style={{ x: inLeftX }} className={`z-10 col-span-3 col-start-1 row-start-1 self-center transform-gpu ${COL_H}`}>
            <BrandPanel side="left" textOpacity={inText} />
          </motion.div>
          <motion.div
            style={{ y: ctaY }}
            className="z-10 col-span-6 col-start-4 row-start-1 flex h-full transform-gpu items-center justify-center"
          >
            <MiniCTA />
          </motion.div>
          <motion.div style={{ x: inRightX }} className={`z-10 col-span-3 col-start-10 row-start-1 self-center transform-gpu ${COL_H}`}>
            <BrandPanel side="right" textOpacity={inText} />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

/** the chooser: the pinned swap on lg with motion; the plain flow on phones and under
    reduced motion (the ServicesStack rule) */
function TreciBlok() {
  const { reduced } = useWorld()
  const flow = (
    <>
      <ProjekatTreci />
      <div aria-hidden style={{ height: 'max(10vh, 110px)' }} />
      <MiniCTA />
    </>
  )
  // batch 57 (Stage-6 gate finding): under reduced motion only the flow exists, so nothing
  // is duplicated and no stand-in heading is needed — but the flow's own copies are now
  // presentational, so the two headings ride along here in every case.
  const headings = (
    <>
      <h2 className="sr-only">Projekat Treći</h2>
      <h2 className="sr-only">Postanite i vi deo našeg uspeha!</h2>
    </>
  )
  if (reduced) return <>{headings}{flow}</>
  return (
    <>
      {/* Both trees below are ALWAYS in the DOM — CSS decides which one is seen — so the
          heading elements had to leave them: a crawler was reading „Projekat Treći" and the
          invitation twice each. One heading apiece, outside the twins, always present. */}
      {headings}
      <div className="lg:hidden">{flow}</div>
      <div className="hidden lg:block">
        <TreciScena />
      </div>
    </>
  )
}

/* FAQ (5/7) — extracted to components/FaqSekcija (batch 44): /kontakt carries the
   same section; this page renders it unchanged. */

/* -------------------------------------------------------------------- the page */

export default function RadoviPage() {
  usePageMeta({
    title: 'Radovi — DreamSign | Sajtovi koji donose rezultate',
    description:
      'Izabrani projekti: sajtovi koje smo dizajnirali i izgradili — i rezultati koje su doneli. Pogledajte radove, pa nam pišite na WhatsApp za vaš.',
    path: '/radovi',
    ogImage: '/media/og-radovi.jpg',
    schema: PAGE_SCHEMA('Radovi', '/radovi'),
  })

  return (
    <main>
      <World>
        {/* batch 19 (owner): the duet reads „Pogledajte neke od / naših najboljih radova" —
            row 1 primary, row 2 script. Long rows need their own clamps: the homepage
            sizes overflow past ~16 characters (both rows are nowrap). */}
        <PageHero
          flip
          trust
          script="Pogledajte neke od"
          title="naših najboljih radova"
          primarySize="text-[10.5vw] sm:text-[clamp(1.9rem,6.6vw,5.4rem)]"
          scriptSize="text-[12vw] sm:text-[clamp(2.2rem,8.2vw,6.8rem)]"
          sub="Izabrani projekti koje smo dizajnirali i izgradili — otvorite bilo koji i vidite sami."
          more={{ label: 'Pogledajte više', targetId: 'prvi-projekat' }}
        />

        <div className="pointer-events-none relative z-20 -mt-[18vh]">
          <SeamBridge className="top-0 h-[62vh]" />

          {/* batch 19 — the hero-overlap band lives OUTSIDE the beat: the beat's content
              box is pointer-events-auto, and when its leading sky spacer straddled the
              hero it swallowed the cloud CTA's lower 70% (probed). This click-transparent
              spacer is exactly the wrapper's negative margin, so the beat now begins at
              the hero's true bottom edge — same pixels, honest hitboxes. */}
          <div aria-hidden style={{ height: '18vh' }} />

          {/* batch 20 (owner's red line) — transitional cloud texture ACROSS the seam:
              two quiet banks straddle the hero's bottom edge (18vh in wrapper space) so
              the eye crosses on cloud, never on a tone step. Static on purpose — the
              b18 jank scar was seven floating layers. Seated below the trust row. */}
          <img
            src="/media/bank-soft.webp" alt="" aria-hidden
            className="pointer-events-none absolute left-[-14%] top-[14.5vh] z-10 w-[44%] max-w-none select-none opacity-70"
          />
          <img
            src="/media/bank-soft.webp" alt="" aria-hidden
            className="pointer-events-none absolute right-[-12%] top-[17.5vh] z-10 w-[38%] max-w-none select-none opacity-60 scale-x-[-1]"
          />

          {/* batch 14: the three projects are ONE story beat — no internal seams to guard,
              so the air between projects shrinks to a breath (his note: gaps too big).
              Only the beat's outer boundaries keep the ≥300px sky the junction law needs. */}
          <Beat name="projekti" layers={
            <>
              <WorldLayer
                src="/media/B3-square-sky.webp" eager
                box="-top-[30vh] -bottom-[30vh]"
                imgClass="absolute inset-0 h-[126%] w-full object-cover object-center"
                y={['0%', '-9%']} base={0.85} mask={MASK.sky}
              />
              {/* batch 24 (owner): THE cloud — the realistic cumulus he circled, extracted
                  from B3 and seated through the world; every seat rides the parallax */}
              <WorldLayer
                src="/media/cloud-real.webp" eager
                box="-top-[6vh] -bottom-[8vh]"
                imgClass="absolute left-[-10%] top-[30%] w-[42%] h-auto max-w-none"
                y={['0%', '-10%']} base={0.9} float={{ px: 9, sec: 10 }}
              />
              <WorldLayer
                src="/media/cloud-real.webp" eager
                box="-top-[6vh] -bottom-[8vh]"
                imgClass="absolute right-[-8%] top-[52%] w-[38%] h-auto max-w-none scale-x-[-1]"
                y={['0%', '-8%']} base={0.85} float={{ px: 7, sec: 11, delay: 1.4 }}
              />
              <WorldLayer
                src="/media/cloud-real.webp" eager
                box="-top-[6vh] -bottom-[8vh]"
                imgClass="absolute left-[6%] top-[76%] w-[30%] h-auto max-w-none"
                y={['0%', '-13%']} base={0.75}
              />
            </>
          }>
            {/* the beat opens on a breath of sky (minus the 18vh that moved outside it) —
                the portfolio line sits close under the hero, where Nick drew its box */}
            <div aria-hidden style={{ height: 'calc(max(24vh, 300px) - 18vh)' }} />

            {/* batch 19 (owner): „NAŠ PORTFOLIO" fills the blue-boxed air under the hero,
                riding its own parallax — centred and stroke-thin per row, so the junction
                rig's full-width median never sees it */}
            <Drift amp={30} className="relative z-10 flex justify-center px-5">
              {/* no filter on clipped text — the Safari invisibility bug (batch 25) */}
              <h2
                className="ink-gradient whitespace-nowrap text-center font-semibold uppercase tracking-tight
                           leading-none text-[clamp(2.6rem,8.6vw,7.6rem)]"
              >
                Naš portfolio
              </h2>
            </Drift>
            {/* batch 51 (owner): „NAŠ PORTFOLIO" sat a whole screen above the first
                project on a phone — the breath is halved there; md+ keeps 16vh/190px */}
            <div aria-hidden className="h-[70px] md:h-[max(16vh,190px)]" />

            <div id="prvi-projekat">
              <ProjekatPrvi />
            </div>
            <div aria-hidden style={{ height: 'max(12vh, 140px)' }} />
            <ProjekatDrugi />
            <div aria-hidden style={{ height: 'max(12vh, 140px)' }} />
            {/* batch 20: Treći + the invitation became THE SWAP — a pinned scene on lg
                (flow preserved on phones/reduced); the beat boundary keeps its ≥300px
                of sky below it */}
            <TreciBlok />
            {/* batch 51 (owner): the breath before SVE O NAMA was a whole screen on a
                phone — halved there, kept at 26vh/310px from md up */}
            <div aria-hidden className="h-[200px] md:h-[max(26vh,310px)]" />
          </Beat>

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
            <SveONama />
          </Beat>

          <Beat name="faq" layers={
            <WorldLayer
              src="/media/cloud-real.webp" eager
              box="-top-[8vh] -bottom-[8vh]"
              imgClass="absolute left-[-8%] top-[12%] w-[36%] h-auto max-w-none"
              y={['0%', '-11%']} base={0.8} float={{ px: 8, sec: 12, delay: 0.8 }}
            />
          }>
            {/* batch 51 (owner): same on the other side of SVE O NAMA — the phone walked a
                full empty screen between „NAMA" and „Česta pitanja" */}
            <div aria-hidden className="h-[200px] md:h-[max(26vh,310px)]" />
            <FaqSekcija />
            <div aria-hidden style={{ height: 'max(26vh, 310px)' }} />
          </Beat>

          <Ground>
            <Beat name="finale">
              <div className="pt-[10vh]">
                <LandingCTA
                  script={bk('radovi-cta', 'Sledeći rezultat može biti vaš.')}
                  scriptK="radovi-cta"
                  clipId="ds-sign-radovi"
                />
              </div>
            </Beat>
          </Ground>
        </div>
      </World>
    </main>
  )
}
