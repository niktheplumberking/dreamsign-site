// Beat 2 — „Radovi koji govore." Layout executed from Nick's reference (batch 6): editorial
// headline left with a small paragraph right, a meta line, then a CASCADE — cards stepping
// up and to the right, each taller than the last, its caption stepping with it. Layout only;
// the skin, the type and the motion are ours.
//
// REAL CONTENT LAW: every cover is a real screenshot / real brand poster of a real project,
// self-hosted — no mockups, no invented metrics. Copy describes what each site actually is.
//
// batch 49 (owner): the pinned conveyor is rebuilt as a RAIL — see THE RAIL below. The old
// AnimatePresence + FLIP state machine is gone: it reacted to scroll with its own timeline,
// so a fast scroll stacked several flights on top of each other and cards crossed the row.
import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react'
import type { MotionValue } from 'motion/react'

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
 * fixed-pixel row completely differently). Desktop sizes are pure vw, so the composition is
 * IDENTICAL at 1280, 1440 and 1920; phones keep the px h-scroll.
 * batch 49 (owner): one ASPECT for every seat (11:10) and one shared caption line — the
 * cards used to carry four different crops and four ragged caption heights, which is what
 * made the row read like a pile instead of a designed cascade. Sizes are now the rail's own
 * ladder (0.72 · 0.85 · 0.94 · 1.0 of the biggest), so home and kontakt speak one language.
 */
const CARD_A = 1.1 // every cover is width × 1.1 — one crop, one rhythm
const LADDER = [0.72, 0.85, 0.94, 1.0]
// 29vw × the ladder, less the three 2vw overlaps, spans 95.8vw — so the row is centred with
// ~2vw of sky on BOTH sides, the same margin the rail keeps. (The old row was justified
// right and left a 380px hole on the left of /kontakt — his note, twice.)
const SEATS = LADDER.map((k) => ({ vw: `${+(29 * k).toFixed(2)}vw` }))

// batch 21 (owner): his order, left to right — Metal Kolor, Pizzdarija, MindxBridge,
// Court Hub. batch 46: Bennett & Co rides too (real project, real poster) — the pinned
// carousel cycles all five through the four seats.
// batch 49: covers are WebP now (the five PNGs weighed 6.5MB; the same art weighs 0.5MB),
// and Metal Kolor wears a new poster — the flat primary-colour vector fought every other
// card in the row and the whole sky world around it.
const PROJECTS: Project[] = [
  {
    name: 'Metal Kolor',
    meta: 'Web sajt · Srem',
    blurb: 'Farbara koja snabdeva majstore — katalog, galerija i kontakt.',
    href: 'https://metal-kolor.rs/',
    cover: '/media/radovi/posters/metalkolor-poster.webp',
  },
  {
    name: 'Pizzdarija',
    meta: 'Web sajt · Novi Sad',
    blurb: 'Picerija sa picom na drva — meni i porudžbina na dva klika.',
    href: 'https://www.pizzdarija.rs/',
    cover: '/media/radovi/posters/pizzdarija-poster.webp',
  },
  {
    // batch 21 (owner): his own project (D67) — platforma + akademija, two live sites
    name: 'MindxBridge',
    meta: 'Platforma + akademija',
    blurb: 'Istraživački inkubator za medicinu — od ideje do objavljenog rada.',
    href: 'https://mindxbridge.com/',
    cover: '/media/radovi/posters/mindxbridge-poster.webp',
  },
  {
    // batch 15 (owner): Court Hub — his own past project, credited per his written
    // statement (D64)
    name: 'Court Hub',
    meta: 'E-commerce + brend · UAE',
    blurb: 'Padel brend iz Dubaija — prodavnica, tereni i turniri na jednom mestu.',
    href: 'https://courthub.ae/',
    cover: '/media/radovi/posters/courthub-poster.webp',
  },
  {
    name: 'Bennett & Co',
    meta: 'Brend + korporativni sajt',
    blurb: 'Kompletan identitet — od logotipa i vizuala do sajta na sopstvenom domenu.',
    href: 'https://www.bennettndco.com',
    cover: '/media/radovi/posters/bennett-poster.webp',
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

/** the cover art — shared by the cascade and the rail so both crop identically */
function Cover({ p }: { p: Project }) {
  return p.cover ? (
    <img
      src={p.cover}
      alt={`${p.name} — sajt koji smo izradili`}
      loading="lazy"
      // without this the decode lands on the main thread exactly as the card scrolls
      // into view — the worst frame went 11ms → 46ms when these three covers arrived
      decoding="async"
      className="h-full w-full object-cover object-center transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
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
  )
}

/** the caption block — fixed height so every card in a row shares one caption line */
function Caption({ p }: { p: Project }) {
  const external = p.href.startsWith('http') && !p.href.includes('wa.me')
  return (
    <div className="min-h-[96px] pt-4">
      {/* batch 50: 12px is the floor for real text on a phone (the audit's readability
          rule) — these label lines used to sit at 11.5 */}
      <p className="text-[12px] uppercase tracking-[0.14em] text-ink/45">{p.meta}</p>
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
  )
}

/** one card of the in-flow cascade — content from the project, size from the SEAT.
    batch 51 (owner): `still` kills the entrance. In the phone carriage the cards to the
    right sit OUTSIDE the viewport horizontally, so their whileInView gate never fired —
    they were invisible until a swipe dragged them in, and then they popped. A horizontal
    carriage has no "in view" to wait for: its cards are simply there. */
function Card({ p, seat, i, drift, still = false }: {
  p: Project; seat: (typeof SEATS)[number]; i: number; drift: unknown; still?: boolean
}) {
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
      // batch 50 (owner, mobile audit): on a phone the row is a SNAP CARRIAGE — one card
      // per swipe, 78vw wide, no overlap and no tilt. The overlapped px cascade put every
      // caption underneath its neighbour's card (his „things that don't make sense on
      // mobile"); md+ keeps the vw cascade untouched.
      className="group relative block shrink-0 w-[78vw] snap-center md:w-[var(--w)] md:snap-align-none"
      style={{
        '--w': seat.vw,
        y: drift as never,
      } as React.CSSProperties}
      {...entrance}
    >
      <div
        className="relative overflow-hidden rounded-[0.9rem] border border-ink/10 transition-transform duration-500 ease-out group-hover:-translate-y-2"
        style={{ aspectRatio: `1 / ${CARD_A}` }}
      >
        <Cover p={p} />
      </div>
      <Caption p={p} />
    </motion.a>
  )
}

/* ── THE RAIL ────────────────────────────────────────────────────────────────
   batch 49 (owner): "use a completely new approach for the motion".

   The conveyor is now a pure FUNCTION OF SCROLL. Every rider's seat is
   seat(j) = wrap(j + track(scroll)) and its x / scale / opacity / z are read
   straight off that number — there is no animation timeline, no enter/exit
   state, nothing in flight. A fast scroll is simply a bigger argument, so
   flights can never stack, no dissolving ghost can cross the row, and because
   z-order is monotonic in the seat a card can never pass in front of the one
   to its right. `track` holds each rider still for the first half of every
   scroll breath and glides it one seat over the second half (smoothstep), so
   the row still reads as deliberate steps rather than a constant slide.
   Cost per frame: one translate + one scale + one opacity per card. No layout.
─────────────────────────────────────────────────────────────────────────────*/
const DWELL = 0.46            // share of each breath the row stands still
const NAV_SKY = 148           // sky kept clear under the floating nav pill
const CAP_H = 128             // the caption line below the cards
/** scales at seats -1 … 4 (index = seat + 1); -1 and 4 are the wings */
const RAIL_K = [0.58, ...LADDER, 1.02]

type Rail = { W: number; imgH: number; top: number; height: number; x: number[] }

function measureRail(vw: number, vh: number): Rail {
  const avail = Math.max(220, vh - NAV_SKY - CAP_H - 44)
  const W = Math.min(vw * 0.29, avail / CARD_A)     // the biggest card's width
  const w = RAIL_K.map((k) => W * k)
  const M = Math.max(28, vw * 0.02)                 // margin off each viewport edge
  const span = vw - 2 * M
  const sum = w[1] + w[2] + w[3] + w[4]             // the four visible seats
  const d = Math.min(0.05 * W, Math.max(-0.11 * W, (span - sum) / 3)) // gap (−) = overlap
  const total = sum + 3 * d
  const x = [0, (vw - total) / 2, 0, 0, 0, 0]       // the row is always centred
  for (let i = 1; i < 4; i++) x[i + 1] = x[i] + w[i] + d
  x[0] = x[1] - w[0] - d - 0.14 * W                 // the wings, off both edges
  x[5] = x[4] + w[4] + d + 0.14 * W
  const imgH = W * CARD_A
  const top = Math.max(NAV_SKY, (vh - imgH - CAP_H) / 2)
  return { W, imgH, top, height: top + imgH + CAP_H, x }
}

const smoothstep = (t: number) => { const c = Math.min(1, Math.max(0, t)); return c * c * (3 - 2 * c) }

/** where the row stands at scroll p: integer = parked, fraction = gliding */
function track(p: number, N: number) {
  const u = Math.min(N, Math.max(0, p)) * N
  const i = Math.floor(u)
  const f = u - i
  return i + (f <= DWELL ? 0 : smoothstep((f - DWELL) / (1 - DWELL)))
}

/** one rider: reads its own seat off the scroll and paints itself there */
function RailCard({ p, j, N, prog, railV, rail }: {
  p: Project; j: number; N: number
  prog: MotionValue<number>; railV: MotionValue<number>; rail: Rail
}) {
  // seat, wrapped into [-1, N-1): one card waits in the left wing, one dissolves right
  const seat = useTransform<number, number>([prog, railV], ([v]) => {
    const s = j + track(v, N)
    return ((s + 1) % N + N) % N - 1
  })
  const at = (s: number, pick: (i: number) => number) => {
    const u = Math.min(4, Math.max(-1, s)) + 1
    const i = Math.min(4, Math.floor(u))
    const f = u - i
    return pick(i) + (pick(i + 1) - pick(i)) * f
  }
  const x = useTransform(seat, (s) => at(s, (i) => rail.x[i]))
  const scale = useTransform(seat, (s) => at(s, (i) => RAIL_K[i]))
  const opacity = useTransform(seat, (s) => smoothstep((s + 1) / 0.7) * (1 - smoothstep((s - 3.25) / 0.75)))
  const z = useTransform(seat, (s) => Math.round((s + 1) * 10) + 2)

  return (
    <motion.a
      href={p.href}
      target="_blank"
      rel="noopener"
      // pointer-events off on the BOX (it is the biggest card's box even when this rider is
      // scaled small, and would otherwise swallow clicks meant for its neighbour); the art
      // and the caption take the clicks themselves
      className="group pointer-events-none absolute left-0 top-0 block will-change-transform"
      style={{ x, opacity, zIndex: z as unknown as number, width: rail.W, height: rail.height }}
    >
      <motion.div
        className="pointer-events-auto absolute left-0 overflow-hidden rounded-[0.9rem] border border-ink/10 will-change-transform"
        style={{ scale, transformOrigin: 'left bottom', width: rail.W, height: rail.imgH, top: rail.top }}
      >
        <Cover p={p} />
      </motion.div>
      <div
        className="pointer-events-auto absolute left-0"
        style={{ top: rail.top + rail.imgH, width: Math.min(rail.W * 0.8, 330) }}
      >
        <Caption p={p} />
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

  // batch 51 (owner): phones get their own carriage rules — cards render without an
  // entrance gate (see Card's `still`), and where the page did not choose an order the
  // carriage leads with Pizzdarija instead of Metal Kolor ("let's not expose Metal Kolor
  // as the first showcase project"). /kontakt keeps its own order; desktop is untouched.
  const [narrow, setNarrow] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const read = () => setNarrow(mq.matches)
    read()
    mq.addEventListener('change', read)
    return () => mq.removeEventListener('change', read)
  }, [])
  const rowList = narrow && !order
    ? [...list].sort((a, b) => (a.name === 'Pizzdarija' ? -1 : b.name === 'Pizzdarija' ? 1 : 0))
    : list

  // the rail's geometry is measured, not guessed — and re-measured on resize. `railV`
  // ticks so every rider recomputes its transform against the new numbers at once.
  const railV = useMotionValue(0)
  const [rail, setRail] = useState<Rail | null>(null)
  // the pin is a DESKTOP instrument: a 29vw card on a phone is a stamp, so narrow screens
  // keep the honest in-flow cascade (and a page 300vh shorter)
  const [wide, setWide] = useState(true)
  const { scrollYProgress } = useScroll({ target: runRef, offset: ['start start', 'end end'] })

  useEffect(() => {
    if (!pinned || reduced) return
    let raf = 0
    const read = () => {
      const w = window.innerWidth
      setWide(w >= 900)
      setRail(measureRail(w, window.innerHeight))
      railV.set(railV.get() + 1)
    }
    const onResize = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(read) }
    read()
    window.addEventListener('resize', onResize)
    return () => { window.removeEventListener('resize', onResize); cancelAnimationFrame(raf) }
  }, [pinned, reduced, railV])

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
        className="mt-12 flex items-baseline justify-between text-[12px] uppercase tracking-[0.16em] text-ink/45"
      >
        <span>Projekti</span>
      </motion.div>
    </>
  )

  /* THE CASCADE (batch 10, fluid) — smallest → biggest, left to right, overlapping
     rightward. On md+ everything is vw; phones keep the px h-scroll.
     batch 49: items-END, so the covers sit on one floor and the captions on one line. */
  const staticRow = (
    // batch 51 (owner): the phone gap between the header and the first poster shrinks from
    // 104px to 24px — the clearance the junction band needs did not disappear, it MOVED to
    // the section's own top padding (see the wrapper below), so the row still starts well
    // clear of the boundary while the title now sits right above its poster.
    <div className="relative left-1/2 mt-6 w-screen -translate-x-1/2 overflow-x-auto md:mt-5 md:overflow-visible pb-2 snap-x snap-mandatory md:snap-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex items-end gap-4 px-[11vw] md:gap-0 md:justify-center md:px-0">
        {rowList.slice(0, 4).map((p, i) => (
          <div
            key={p.name}
            className={`relative ${i === 0 ? 'md:ml-0' : 'md:-ml-[2vw]'}`}
            style={{ zIndex: 10 + i * 10 }}
          >
            <Card p={p} seat={SEATS[i]} i={i} drift={drifts[i]} still={narrow} />
          </div>
        ))}
      </div>
    </div>
  )

  if (pinned && !reduced && wide) {
    return (
      <div ref={ref} className="relative mx-auto max-w-6xl px-5 sm:px-6 py-16 md:py-28">
        {header}
        {/* the runway: one dwell per project — every rider takes the big seat once */}
        <div ref={runRef} className="relative w-full" style={{ height: `${N * 62 + 100}vh` }}>
          <div className="sticky top-0 h-screen w-full">
            {/* the rail spans the VIEWPORT, not the content column */}
            <div className="relative left-1/2 h-full w-screen -translate-x-1/2">
              {rail &&
                list.map((p, j) => (
                  <RailCard key={p.name} p={p} j={j} N={N} prog={scrollYProgress} railV={railV} rail={rail} />
                ))}
            </div>
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
    // batch 51: the junction clearance the carriage gave up now lives here — on a phone the
    // whole section starts lower, so the poster still clears the hero boundary's scan band
    // while sitting right under its own title. md+ keeps py-16/py-28 exactly.
    <div ref={ref} className="relative mx-auto max-w-6xl px-5 pb-16 pt-[150px] sm:px-6 md:pb-28 md:pt-28">
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
