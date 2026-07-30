// Beat 2 — „Radovi koji govore." Layout executed from Nick's reference (batch 6): editorial
// headline left with a small paragraph right, a meta line, then a CASCADE — cards stepping
// up and to the right, each taller than the last, its caption stepping with it. Layout only;
// the skin, the type and the motion are ours.
//
// REAL CONTENT LAW: every cover is a real screenshot of the real live site, captured at
// 1000×1150 and self-hosted — no mockups, no invented metrics. Copy describes what each site
// actually is (verified by loading all three). The fourth card is honestly empty.
//
// The cloud is in the cards themselves: each cover DISSOLVES at its top and bottom into the
// sky (the page's no-straight-lines law), so the work floats rather than sits in a box.
import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { WA_LINK } from '../../lib/hooks'
import { useWorld, useWorldRange } from '../World'

type Project = {
  name: string
  meta: string
  blurb: string
  href: string
  cover?: string
  /** cascade seat: push-down, cover height, and width — sizes GROW to the right (ref: the
      last card is ~2x the first) while the caption line steps down diagonally */
  drop: number
  tall: number
  w: number
}

const PROJECTS: Project[] = [
  {
    name: 'Bennett & Co',
    meta: 'Brend + sajt · SAD',
    blurb: 'Studio za web dizajn — kompletan identitet i korporativni sajt.',
    href: 'https://www.bennettndco.com',
    cover: '/media/radovi/bennett.webp',
    drop: 130, tall: 380, w: 280,
  },
  {
    name: 'Metal Kolor',
    meta: 'Web sajt · Srem',
    blurb: 'Farbara koja snabdeva majstore — katalog, galerija i kontakt.',
    href: 'https://metal-kolor.rs/',
    cover: '/media/radovi/metalkolor.webp',
    drop: 85, tall: 440, w: 360,
  },
  {
    name: 'Pizzdarija',
    meta: 'Web sajt · Novi Sad',
    blurb: 'Picerija sa picom na drva — meni i porudžbina na dva klika.',
    href: 'https://www.pizzdarija.rs/',
    cover: '/media/radovi/pizzdarija.webp',
    drop: 40, tall: 505, w: 450,
  },
  {
    name: 'Vaš projekat',
    meta: 'Slobodno mesto',
    blurb: 'Sledeći rad kojim se hvalimo može biti vaš — javite se.',
    href: WA_LINK,
    drop: 0, tall: 560, w: 560,
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

/** a trust pill that floats idle and shies away from the cursor (batch 8) */
function TrustPill({ b, i, reduced }: { b: (typeof TRUST)[number]; i: number; reduced: boolean }) {
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

  return (
    <motion.div
      {...fadeUp(3 + i)}
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

/** one card of the cascade — it drifts on the world's scroll at its own rate */
function Card({ p, i, drift }: { p: Project; i: number; drift: unknown }) {
  const external = p.href.startsWith('http') && !p.href.includes('wa.me')
  return (
    <motion.a
      href={p.href}
      target="_blank"
      rel="noopener"
      // per-card width from the cascade seat (196→296, they GROW like the reference);
      // phones cap at 62vw and ride the horizontal scroll. 196+226+258+296 + 3×24 = 1048
      // fits the 1104 column — justify-center on an overflowing row clips the left card.
      className="group relative block shrink-0"
      style={{ marginTop: p.drop, width: `min(${p.w}px, 62vw)`, y: drift as never }}
      initial={{ opacity: 0, y: 46 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-90px' }}
      transition={{ duration: 0.75, delay: 0.09 * i, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="relative overflow-hidden rounded-[0.9rem] border border-ink/10 transition-transform duration-500 ease-out group-hover:-translate-y-2"
        style={{ height: p.tall }}
      >
        {p.cover ? (
          <img
            src={p.cover}
            alt={`${p.name} — sajt koji smo izradili`}
            loading="lazy"
            // without this the decode lands on the main thread exactly as the card scrolls
            // into view — the worst frame went 11ms → 46ms when these three covers arrived
            decoding="async"
            className="h-full w-full object-cover object-top transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
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

export default function Radovi() {
  const ref = useRef<HTMLDivElement>(null)
  const { p: world, reduced } = useWorld()
  const [enter, exit] = useWorldRange(ref, 1.05, 0.15)
  // the cascade breathes with the descent — back cards drift further than front ones
  const d0 = useTransform(world, [enter, exit], [26, -26])
  const d1 = useTransform(world, [enter, exit], [18, -18])
  const d2 = useTransform(world, [enter, exit], [10, -10])
  const d3 = useTransform(world, [enter, exit], [4, -4])
  const drifts = reduced ? [0, 0, 0, 0] : [d0, d1, d2, d3]

  return (
    <div ref={ref} className="relative mx-auto max-w-6xl px-5 sm:px-6 py-16 md:py-28">
      {/* REF 1 MEASURED: THREE stacked headline lines top-left ending in a period, with the
          tiny note top-RIGHT sitting level with the third line. */}
      <div className="grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-end">
        <motion.h2
          {...fadeUp(0)}
          className="font-semibold tracking-tight text-ink leading-[1.04] text-[clamp(2.6rem,5.8vw,4.4rem)]"
        >
          Radovi
          <span className="block">koji{' '}<span className="font-script font-normal text-accent text-[1.28em] leading-[0.95]">govore.</span></span>
        </motion.h2>
        <motion.p
          {...fadeUp(1)}
          className="max-w-[34ch] text-[13.5px] leading-relaxed text-ink/60 md:justify-self-end md:pb-3"
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

      {/* THE CASCADE (batch 9 spread) — smallest → biggest, left to right, each bigger card
          overlapping the right edge of the one before it (z rises rightward). The smallest
          card is cut EXACTLY 40% by the left screen edge (112px of its 280); the biggest
          keeps a small distance from the right edge (pr-7). Row spans the full viewport:
          280+360+450+560 − 3×42 = 1524; 1524 − 112 + 28 = 1440. Tallest card 560 + caption
          ≈ 660 — the whole cascade fits one desktop viewport. Phones h-scroll. */}
      <div className="relative left-1/2 mt-5 w-screen -translate-x-1/2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex items-start pr-4 md:justify-end md:pr-7">
          {PROJECTS.map((p, i) => (
            <div
              key={p.name}
              className={`relative ${i === 0 ? '-ml-[112px]' : '-ml-8 md:-ml-[42px]'}`}
              style={{ zIndex: 10 + i * 10 }}
            >
              <Card p={p} i={i} drift={drifts[i]} />
            </div>
          ))}
        </div>
      </div>

      {/* the trust facts — glass, cloud-soft, all of them true. Batch 8: they FLOAT in
          place, and they shy away from the cursor — approach one and it drifts off, capped
          so it never leaves its seat. Springs do the settling; reduced motion gets them
          still and seated. */}
      <div className="mt-14 md:mt-20 grid grid-cols-2 gap-4 lg:grid-cols-4 items-start">
        {TRUST.map((b, i) => (
          <TrustPill key={b.t} b={b} i={i} reduced={reduced} />
        ))}
      </div>
    </div>
  )
}
