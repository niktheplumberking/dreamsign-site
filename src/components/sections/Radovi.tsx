// Beat 2 — „Radovi koji govore." Layout executed from Nick's reference (batch 6): editorial
// headline left with a small paragraph right, a meta line, then a CASCADE — cards stepping
// up and to the right, each taller than the last, its caption stepping with it. Layout only;
// the skin, the type and the motion are ours.
//
// REAL CONTENT LAW: every cover is a real screenshot / real brand poster of a real project,
// self-hosted — no mockups, no invented metrics. Copy describes what each site actually is.
//
// batch 46 (owner): the cascade can PIN — the camera locks and scroll turns the row like a
// conveyor: every card steps one seat to the RIGHT, the big right card exits and dissolves,
// the next project enters from the left. Seats now belong to the ROW (not the project), so
// any project can sit anywhere; Bennett & Co joins as the fifth rider. The per-card drift
// rides SPRINGS now — any range re-measure lands as a soft glide, never a jump (his
// "glitching cards" note, home + kontakt).
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react'

import { useWorld, useWorldRange } from '../World'

type Project = {
  name: string
  meta: string
  blurb: string
  href: string
  cover?: string
}

/**
 * Cascade seats in TWO coordinate systems (batch 10 — Nick's PC and MacBook rendered the
 * fixed-pixel row completely differently). Desktop sizes are pure vw, so the composition
 * is IDENTICAL at 1280, 1440 and 1920: widths 18.5/23.5/29.5/40vw (the reference's own
 * proportions), row = 105.5vw after overlaps, justified right with 2vw kept off the right
 * edge. Mobile keeps the px h-scroll. batch 46: seats belong to the ROW, projects rotate
 * through them.
 */
const SEATS = [
  { vw: { w: '18.5vw', t: '25.2vw', d: '9vw' }, px: { w: '230px', t: '340px', d: '90px' } },
  { vw: { w: '23.5vw', t: '28.7vw', d: '6vw' }, px: { w: '270px', t: '380px', d: '60px' } },
  { vw: { w: '29.5vw', t: '33vw', d: '2.8vw' }, px: { w: '310px', t: '420px', d: '28px' } },
  { vw: { w: '40vw', t: '40vw', d: '0vw' }, px: { w: '340px', t: '470px', d: '0px' } },
]

// batch 21 (owner): his order, left to right — Metal Kolor, Pizzdarija, MindxBridge,
// Court Hub. batch 46: Bennett & Co rides too (real project, real poster) — the pinned
// carousel cycles all five through the four seats.
const PROJECTS: Project[] = [
  {
    name: 'Metal Kolor',
    meta: 'Web sajt · Srem',
    blurb: 'Farbara koja snabdeva majstore — katalog, galerija i kontakt.',
    href: 'https://metal-kolor.rs/',
    cover: '/media/radovi/posters/metalkolor-poster.png',
  },
  {
    name: 'Pizzdarija',
    meta: 'Web sajt · Novi Sad',
    blurb: 'Picerija sa picom na drva — meni i porudžbina na dva klika.',
    href: 'https://www.pizzdarija.rs/',
    cover: '/media/radovi/posters/pizzdarija-poster.png',
  },
  {
    // batch 21 (owner): his own project (D67) — platforma + akademija, two live sites
    name: 'MindxBridge',
    meta: 'Platforma + akademija',
    blurb: 'Istraživački inkubator za medicinu — od ideje do objavljenog rada.',
    href: 'https://mindxbridge.com/',
    cover: '/media/radovi/posters/mindxbridge-poster.png',
  },
  {
    // batch 15 (owner): Court Hub — his own past project, credited per his written
    // statement (D64)
    name: 'Court Hub',
    meta: 'E-commerce + brend · UAE',
    blurb: 'Padel brend iz Dubaija — prodavnica, tereni i turniri na jednom mestu.',
    href: 'https://courthub.ae/',
    cover: '/media/radovi/posters/courthub-poster.png',
  },
  {
    name: 'Bennett & Co',
    meta: 'Brend + korporativni sajt',
    blurb: 'Kompletan identitet — od logotipa i vizuala do sajta na sopstvenom domenu.',
    href: 'https://www.bennettndco.com',
    cover: '/media/radovi/posters/bennett-poster.png',
  },
]

const TRUST = [
  { k: 'APR', t: 'Registrovana delatnost', d: 'matični broj 68643627' },
  { k: '§', t: 'Ugovor za svaki projekat', d: 'obim, rok i cena — pismeno' },
  { k: '©', t: 'Sajt je vaše vlasništvo', d: 'kod i sadržaj prelaze na vas' },
  { k: '1:1', t: 'Direktno sa vlasnikom', d: 'bez posrednika, od prvog dana' },
]

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.6, delay: 0.1 * i },
})

/** a trust pill that floats idle and shies away from the cursor (batch 8).
    batch 46: `immediate` animates on MOUNT — in the kontakt hero the whileInView gate
    left the fourth pill invisible on landing. */
function TrustPill({ b, i, reduced, immediate = false }: {
  b: (typeof TRUST)[number]; i: number; reduced: boolean; immediate?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const sx = useSpring(rx, { stiffness: 55, damping: 13, mass: 0.6 })
  const sy = useSpring(ry, { stiffness: 55, damping: 13, mass: 0.6 })

  useEffect(() => {
    if (reduced) return
    const RADIUS = 240 // the pill notices the cursor from here
    const PUSH = 30    // ...and never strays further than this from its seat
    const onMove = (e: MouseEvent) => {
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      const dx = cx - e.clientX
      const dy = cy - e.clientY
      const dist = Math.hypot(dx, dy)
      if (dist > RADIUS || dist === 0) { rx.set(0); ry.set(0); return }
      const f = ((RADIUS - dist) / RADIUS) * PUSH
      rx.set((dx / dist) * f)
      ry.set((dy / dist) * f)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [reduced, rx, ry])

  const entrance = immediate
    ? {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, delay: 0.5 + 0.12 * i },
      }
    : fadeUp(3 + i)

  return (
    <motion.div
      {...entrance}
      // four distinct seats — a shared bottom edge across four glass pills reads as a
      // full-width line to the junction rig (measured 34 in batch 5)
      className={['', 'mt-6', 'mt-11', 'mt-3'][i]}
    >
      {/* idle float on the outer shell, cursor-repel springs on the inner one */}
      <motion.div
        animate={reduced ? undefined : { y: [0, -7, 0] }}
        transition={{ duration: 5.2 + i * 0.7, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
      >
        <motion.div ref={ref} style={reduced ? undefined : { x: sx, y: sy }} className="liquid-glass rounded-[1.5rem] px-5 py-5 text-center">
          <span className="font-script text-accent text-[26px] leading-none" aria-hidden>{b.k}</span>
          <p className="mt-2 font-semibold text-ink text-[14px] leading-snug">{b.t}</p>
          <p className="mt-1 text-[12.5px] text-ink/60">{b.d}</p>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

/** one card of the cascade — content from the project, size from the SEAT it occupies */
function Card({ p, seat, i, drift, still = false }: {
  p: Project; seat: (typeof SEATS)[number]; i: number; drift: unknown; still?: boolean
}) {
  const external = p.href.startsWith('http') && !p.href.includes('wa.me')
  const entrance = still
    ? {}
    : {
        initial: { opacity: 0, y: 46 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-90px' },
        transition: { duration: 0.75, delay: 0.09 * i, ease: [0.22, 1, 0.36, 1] as const },
      }
  return (
    <motion.a
      href={p.href}
      target="_blank"
      rel="noopener"
      // the seat vars feed breakpointed arbitrary classes: px on phones, pure vw on md+.
      // batch 16: phones tilt the cards ±1.15° (the /radovi plate vocabulary) — the dark
      // posters' internal bands aligned across overlapped cards into a full-width step
      // (kill-tested: in-flow content, not a layer)
      className={`group relative block shrink-0 w-[min(48vw,var(--wm))] md:w-[var(--w)] mt-[var(--dm)] md:mt-[var(--d)]
                  ${i % 2 ? 'rotate-[-1.15deg]' : 'rotate-[1.15deg]'} md:rotate-0`}
      style={{
        '--w': seat.vw.w, '--t': seat.vw.t, '--d': seat.vw.d,
        '--wm': seat.px.w, '--tm': seat.px.t, '--dm': seat.px.d,
        y: drift as never,
      } as React.CSSProperties}
      {...entrance}
    >
      <div
        className="relative overflow-hidden rounded-[0.9rem] border border-ink/10 transition-transform duration-500 ease-out group-hover:-translate-y-2 h-[var(--tm)] md:h-[var(--t)]"
      >
        {p.cover ? (
          <img
            src={p.cover}
            alt={`${p.name} — sajt koji smo izradili`}
            loading="lazy"
            // without this the decode lands on the main thread exactly as the card scrolls
            // into view — the worst frame went 11ms → 46ms when these three covers arrived
            decoding="async"
            className="h-full w-full object-cover object-center transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
          />
        ) : (
          // the reference's fourth card is its STRONGEST — a pale ghost vanishes against the
          // sky, so the open slot stands on the deep end of the brand blues with the big D
          <div
            className="flex h-full w-full flex-col items-center justify-center gap-6"
            style={{ background: 'linear-gradient(180deg, #7FB0DF 0%, #A8CEF0 55%, #DCEBF8 100%)' }}
          >
            <img
              src="/media/brand/cloud-d.webp"
              alt=""
              aria-hidden
              className="h-28 w-auto drop-shadow-[0_8px_18px_rgba(22,50,79,0.25)] transition-transform duration-[900ms] ease-out group-hover:scale-[1.08] md:h-36"
            />
            <span className="rounded-full border border-white/70 bg-white/25 px-5 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-ink/80 backdrop-blur-[4px]">
              Slobodno mesto
            </span>
          </div>
        )}
      </div>

      <div className="pt-4">
        <p className="text-[11.5px] uppercase tracking-[0.14em] text-ink/45">{p.meta}</p>
        <p className="mt-1.5 font-semibold text-ink text-[16px] tracking-tight">
          {p.name}
          {external && (
            <span
              aria-hidden
              className="ml-1.5 inline-block text-accent transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5"
            >
              ↗
            </span>
          )}
        </p>
        <p className="mt-1 text-[13px] leading-relaxed text-ink/60 max-w-[26ch]">{p.blurb}</p>
      </div>
    </motion.a>
  )
}

export function TrustPills({ reduced, immediate = false }: { reduced: boolean; immediate?: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 items-start">
      {TRUST.map((b, i) => (
        <TrustPill key={b.t} b={b} i={i} reduced={reduced} immediate={immediate} />
      ))}
    </div>
  )
}

/* batch 45 (owner): trust may be switched off — /kontakt moved the pills into its hero.
   batch 46 (owner): `order` rotates which projects sit where (/kontakt differs from home),
   `pinned` locks the camera and turns the cascade into the conveyor. */
export default function Radovi({ trust = true, order, pinned = false }: {
  trust?: boolean
  order?: number[]
  pinned?: boolean
} = {}) {
  const ref = useRef<HTMLDivElement>(null)
  const runRef = useRef<HTMLDivElement>(null)
  const { p: world, reduced } = useWorld()
  const [enter, exit] = useWorldRange(ref, 1.05, 0.15)
  // the cascade breathes with the descent — back cards drift further than front ones.
  // batch 46: SPRINGS between the world and the cards — a re-measured range lands as a
  // soft glide instead of a jump (his "glitching cards", home + kontakt)
  const d0 = useTransform(world, [enter, exit], [26, -26])
  const d1 = useTransform(world, [enter, exit], [18, -18])
  const d2 = useTransform(world, [enter, exit], [10, -10])
  const d3 = useTransform(world, [enter, exit], [4, -4])
  const s0 = useSpring(d0, { stiffness: 70, damping: 22, mass: 0.5 })
  const s1 = useSpring(d1, { stiffness: 70, damping: 22, mass: 0.5 })
  const s2 = useSpring(d2, { stiffness: 70, damping: 22, mass: 0.5 })
  const s3 = useSpring(d3, { stiffness: 70, damping: 22, mass: 0.5 })
  const drifts = reduced ? [0, 0, 0, 0] : [s0, s1, s2, s3]

  const list = order ? order.map((i) => PROJECTS[i]) : PROJECTS
  const N = list.length

  // the conveyor's position: r advances one step per scroll breath (quantized dwells)
  const [r, setR] = useState(0)
  const { scrollYProgress } = useScroll({ target: runRef, offset: ['start start', 'end end'] })
  useEffect(() => {
    if (!pinned) return
    return scrollYProgress.on('change', (p) => {
      const steps = N // one full cycle: every project takes the big seat once
      setR(Math.min(steps - 1, Math.max(0, Math.floor(p * steps))))
    })
  }, [scrollYProgress, pinned, N])

  const header = (
    <>
      {/* REF 1 MEASURED: THREE stacked headline lines top-left ending in a period, with the
          tiny note top-RIGHT sitting level with the third line. */}
      <div className="grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-end">
        <motion.h2
          {...fadeUp(0)}
          className="font-semibold tracking-tight leading-[1.02] text-[clamp(2.6rem,7.4vw,6rem)]"
        >
          {/* batch 15 (owner): „Radovi koji" one row, „govore." underneath grown to the
              upper row's width. batch 19: the brand ramp, never flat ink (colour law). */}
          <span className="ink-gradient block whitespace-nowrap">Radovi koji</span>
          <span className="block font-script font-normal text-accent text-[1.62em] leading-[0.9]">govore.</span>
        </motion.h2>
        <motion.p
          {...fadeUp(1)}
          className="max-w-[34ch] text-[13.5px] leading-relaxed text-ink/60 md:justify-self-end md:pb-[1.6rem]"
        >
          Svaki sajt gradimo sa jednim zadatkom — da posetioca pretvori u upit. Otvorite bilo
          koji i vidite sami.
        </motion.p>
      </div>

      <motion.div
        {...fadeUp(2)}
        className="mt-12 flex items-baseline justify-between text-[11.5px] uppercase tracking-[0.16em] text-ink/45"
      >
        <span>Projekti</span>
      </motion.div>
    </>
  )

  /* THE CASCADE (batch 10, fluid) — smallest → biggest, left to right, overlapping
     rightward. On md+ everything is vw; phones keep the px h-scroll. */
  const staticRow = (
    <div className="relative left-1/2 mt-5 w-screen -translate-x-1/2 overflow-x-auto md:overflow-visible pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex items-start pr-4 md:justify-end md:pr-[2vw]">
        {list.slice(0, 4).map((p, i) => (
          <div
            key={p.name}
            className={`relative ${i === 0 ? '-ml-[74px] md:ml-0' : '-ml-8 md:-ml-[2vw]'}`}
            style={{ zIndex: 10 + i * 10 }}
          >
            <Card p={p} seat={SEATS[i]} i={i} drift={drifts[i]} />
          </div>
        ))}
      </div>
    </div>
  )

  /* batch 46 (owner): THE CONVEYOR — the camera locks; each scroll breath sends every
     card one seat to the RIGHT: the big right card exits and dissolves, the next project
     enters small from the left. FLIP layout animations carry seat-to-seat travel. */
  const seatProject = (s: number) => list[(((s - r) % N) + N) % N]
  const pinnedRow = (
    <div className="relative left-1/2 mt-5 w-screen -translate-x-1/2 pb-2">
      <div className="flex items-start pr-4 md:justify-end md:pr-[2vw]">
        <AnimatePresence mode="popLayout" initial={false}>
          {[0, 1, 2, 3].map((s) => {
            const p = seatProject(s)
            return (
              <motion.div
                key={p.name}
                layout
                initial={{ opacity: 0, x: -160, scale: 0.92 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 200, scale: 0.96 }}
                transition={{ duration: 0.65, ease: [0.3, 0, 0.2, 1] }}
                className={`relative ${s === 0 ? '-ml-[74px] md:ml-0' : '-ml-8 md:-ml-[2vw]'}`}
                style={{ zIndex: 10 + s * 10 }}
              >
                <Card p={p} seat={SEATS[s]} i={s} drift={drifts[s]} still />
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )

  if (pinned && !reduced) {
    return (
      <div ref={ref} className="relative mx-auto max-w-6xl px-5 sm:px-6 py-16 md:py-28">
        {header}
        {/* the runway: one dwell per project — every rider takes the big seat once */}
        <div ref={runRef} className="relative w-full" style={{ height: `${N * 62 + 100}vh` }}>
          <div className="sticky top-0 flex h-screen w-full flex-col justify-center">
            {pinnedRow}
          </div>
        </div>
        {trust && (
          <div className="mt-2 md:mt-6">
            <TrustPills reduced={reduced} />
          </div>
        )}
      </div>
    )
  }

  return (
    <div ref={ref} className="relative mx-auto max-w-6xl px-5 sm:px-6 py-16 md:py-28">
      {header}
      {staticRow}
      {trust && (
        <div className="mt-14 md:mt-20">
          <TrustPills reduced={reduced} />
        </div>
      )}
    </div>
  )
}
