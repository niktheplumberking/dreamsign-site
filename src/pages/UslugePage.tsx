// /usluge — batch 13: Nick's own layout (AI Studio reference, 2026-08-03), our skin.
// Hero: the stacked display block MI SMO / FULL–SERVICE / script „Agencija" with the
// cloud mind-map riding top-right and the reference slider under it. Then the ink trust
// band (REAL facts only — the reference's ISO/SLA/certificate claims are not ours to
// make), then his 320vh blanket-stack of the four services — possible now that the World
// clips with overflow-clip instead of overflow-hidden (sticky lives).
// Faces, palette, sky and motion grammar stay ours; his red → signature blue.
import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useMotionValue, AnimatePresence, type MotionValue } from 'motion/react'
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

/* batch 42 (owner): THE CLOUD PLAYGROUND — the lines retired. The three service clouds
   share one INVISIBLE fence (his red box = this wrapper) and live in it: they wander
   idly, FLEE the approaching cursor, may overlap in any order, and never cross the
   border. Physics on one rAF loop writing motion values — zero React re-renders; the
   loop sleeps while the fence is off-screen; reduced motion gets calm static seats. */
/* batch 50 (owner, mobile audit): the fence was 300×144 on a phone, so three 96px clouds
   bunched in the middle and their labels stacked on top of each other — unreadable. On a
   phone the fence now spans the width and stands taller, and the clouds grow with it
   (wSm), so each label has its own sky. The physics reads element sizes live, so nothing
   else in the loop changes. */
const PLAY_CLOUDS = [
  { label: '1. Web dizajn', wPct: 32, wSm: 37, seat: [0.06, 0.02], seatSm: [0.0, 0.0] },
  { label: '2. SEO', wPct: 31, wSm: 34, seat: [0.55, 0.12], seatSm: [0.63, 0.16] },
  { label: '3. Marketing', wPct: 33, wSm: 39, seat: [0.6, 0.54], seatSm: [0.26, 0.62] },
]

function CloudMap() {
  const { reduced } = useWorld()
  const boxRef = useRef<HTMLDivElement>(null)
  const [narrow, setNarrow] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)')
    const read = () => setNarrow(mq.matches)
    read()
    mq.addEventListener('change', read)
    return () => mq.removeEventListener('change', read)
  }, [])
  const cloudRefs = useRef<(HTMLDivElement | null)[]>([])
  const x0 = useMotionValue(0), y0 = useMotionValue(0)
  const x1 = useMotionValue(0), y1 = useMotionValue(0)
  const x2 = useMotionValue(0), y2 = useMotionValue(0)
  const xs = [x0, x1, x2], ys = [y0, y1, y2]

  useEffect(() => {
    // batch 50 (owner, mobile audit): NO PHYSICS ON A PHONE. The fence is small enough
    // there that the edge-steer band covers nearly all of it, so all three clouds were
    // being nudged to the same middle and their labels stacked into one unreadable knot —
    // and a phone has no cursor for them to flee from anyway. Below 640 they take three
    // fixed, well-separated seats and just breathe (see the render branch).
    if (reduced || narrow) return
    const box = boxRef.current
    if (!box) return
    const mouse = { x: -1e4, y: -1e4 }
    const onMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY }
    window.addEventListener('mousemove', onMove, { passive: true })
    const st = PLAY_CLOUDS.map(() => ({ x: 0, y: 0, vx: 0, vy: 0, h: Math.random() * Math.PI * 2 }))
    let raf = 0, run = true, seeded = false
    const io = new IntersectionObserver(([e]) => { run = e.isIntersecting })
    io.observe(box)

    const step = () => {
      raf = requestAnimationFrame(step)
      if (!run) return
      const r = box.getBoundingClientRect()
      st.forEach((s, i) => {
        const el = cloudRefs.current[i]
        if (!el) return
        const w = el.offsetWidth, h = el.offsetHeight
        const maxX = Math.max(0, r.width - w), maxY = Math.max(0, r.height - h)
        if (!seeded) {
          const seat = r.width < 640 ? PLAY_CLOUDS[i].seatSm : PLAY_CLOUDS[i].seat
          s.x = Math.min(seat[0] * r.width, maxX)
          s.y = Math.min(seat[1] * r.height, maxY)
        }
        // batch 44 (owner): PERPETUAL — no destinations, no arrivals, no parking. Each
        // cloud cruises on a slowly wandering heading at one constant, very slow speed;
        // near the fence the heading bends back toward the middle.
        s.h += (Math.random() - 0.5) * 0.045
        if (s.x < 44 || s.x > maxX - 44 || s.y < 30 || s.y > maxY - 30) {
          const toC = Math.atan2(maxY / 2 - s.y, maxX / 2 - s.x)
          let dh = toC - s.h
          while (dh > Math.PI) dh -= 2 * Math.PI
          while (dh < -Math.PI) dh += 2 * Math.PI
          s.h += dh * 0.055
        }
        let ax = Math.cos(s.h) * 0.018, ay = Math.sin(s.h) * 0.018
        // the ESCAPE: still runs from the cursor, but composed — a quarter of the old
        // force, so it slips away instead of exploding (his note)
        const cx = r.left + s.x + w / 2, cy = r.top + s.y + h / 2
        const dx = cx - mouse.x, dy = cy - mouse.y
        const d = Math.hypot(dx, dy)
        const R = 240
        if (d < R) {
          // dead-centre guard: a cursor parked EXACTLY on the centre has no direction
          // to flee from — push outward from the fence's middle instead, never freeze
          let ux = dx, uy = dy
          if (d < 1) { ux = cx - (r.left + r.width / 2); uy = cy - (r.top + r.height / 2) }
          const um = Math.hypot(ux, uy) || 1
          const f = 0.5 * Math.pow(1 - d / R, 2)
          ax += (ux / um) * f
          ay += (uy / um) * f
        }
        // the border: a soft spring near the fence, a hard clamp on it
        const M = 14
        if (s.x < M) ax += (M - s.x) * 0.012
        if (s.x > maxX - M) ax -= (s.x - (maxX - M)) * 0.012
        if (s.y < M) ay += (M - s.y) * 0.012
        if (s.y > maxY - M) ay -= (s.y - (maxY - M)) * 0.012
        s.vx = (s.vx + ax) * 0.93
        s.vy = (s.vy + ay) * 0.93
        const sp = Math.hypot(s.vx, s.vy)
        if (sp > 2.4) { s.vx *= 2.4 / sp; s.vy *= 2.4 / sp }
        // never park: below cruise speed the cloud keeps sliding along its heading
        const MIN = 0.34
        if (sp < MIN) {
          if (sp > 0.02) { s.vx *= MIN / sp; s.vy *= MIN / sp }
          else { s.vx = Math.cos(s.h) * MIN; s.vy = Math.sin(s.h) * MIN }
        }
        s.x = Math.min(Math.max(s.x + s.vx, 0), maxX)
        s.y = Math.min(Math.max(s.y + s.vy, 0), maxY)
        xs[i].set(s.x)
        ys[i].set(s.y)
      })
      seeded = true
    }
    raf = requestAnimationFrame(step)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('mousemove', onMove); io.disconnect() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced])

  return (
    <motion.div
      ref={boxRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="pointer-events-none absolute right-0 z-10 aspect-[360/230] w-[94vw] sm:aspect-[500/240] sm:w-[440px] md:w-[560px] lg:w-[46vw] lg:max-w-[900px]
                 top-[11vh] sm:top-[9vh] lg:top-[10vh]"
      aria-hidden
    >
      {PLAY_CLOUDS.map((c, i) => {
        const still = reduced || narrow
        return (
        <motion.div
          key={c.label}
          ref={(el) => { cloudRefs.current[i] = el }}
          className="absolute left-0 top-0"
          // phones and reduced motion: a fixed seat with a slow breath; desktop: the
          // playground's own physics writing x/y
          animate={narrow && !reduced ? { y: [0, -7, 0] } : undefined}
          transition={narrow && !reduced
            ? { duration: 6.5 + i * 1.3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.7 }
            : undefined}
          style={
            still
              ? {
                  left: `${(narrow ? c.seatSm[0] : c.seat[0]) * 100}%`,
                  top: `${(narrow ? c.seatSm[1] : c.seat[1]) * 100}%`,
                  width: `${narrow ? c.wSm : c.wPct}%`,
                }
              : { x: xs[i], y: ys[i], width: `${c.wPct}%` }
          }
        >
          <img
            src="/media/cloud-puff.webp" alt=""
            className="w-full select-none drop-shadow-[0_8px_20px_rgba(22,50,79,0.20)]"
          />
          <span className="absolute inset-0 flex items-center justify-center pt-[4%]">
            <span className="max-w-[70%] text-center text-[12px] font-semibold uppercase leading-tight tracking-[0.08em] text-ink/85 sm:max-w-[62%] sm:text-[13px] lg:text-[14px]">
              {c.label}
            </span>
          </span>
        </motion.div>
        )
      })}
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
        <span className="mt-1.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-accent">{r.label} ↗</span>
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
      {/* batch 37 (owner): the map hangs from the SECTION so its right edge is the
          VIEWPORT's right edge — off the content grid entirely, per his order */}
      <CloudMap />

      <div className="relative flex min-h-screen w-full flex-col justify-end px-4 pb-[23.5vh] pt-28 sm:px-10 lg:px-16">

      <div className="relative z-20 mx-auto flex w-full max-w-7xl flex-col items-center justify-end">

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
        {/* batch 33 (owner): "the gap between 04 and our process is too big — much
            smaller" — the full SkyGap became one short breath. The 04 sheet CONTINUES
            past the stage floor as a static melt: solid at the floor, gone 220px later —
            during the lock it sits below the viewport, after release there is no edge. */}
        {/* batch 34 (owner): the melt descends THROUGH the sky's own tones — a white
            fade over blue read as a pale stripe (his red circle); now the sheet becomes
            sky, not haze. His 70%-cloud technique rides on top: three real clouds cover
            the band, their soft ink ending inside the section (the clip law). */}
        {/* batch 50 (owner, mobile audit): the melt exists to CONTINUE the 04 sheet past
            the stage floor — but on a phone the deck is an accordion now, so there is no
            sheet above it and the melt's solid top painted a hard band across open sky
            (junction step 64). Phones get plain sky of the guard depth instead; md+ keeps
            the melt exactly as composed. */}
        <div aria-hidden className="relative h-[330px] md:h-[max(12vh,140px)]">
          <div
            className="absolute inset-0 hidden md:block"
            style={{
              background: `linear-gradient(to bottom, ${CARD_BG} 0%, rgba(216,230,243,0.9) 40%, rgba(176,201,228,0.45) 75%, rgba(176,201,228,0) 100%)`,
            }}
          />
          {/* batch 50: these three cover the melt's band — with the melt gone on phones
              they stand on open sky, and three clouds sharing one bottom line across the
              full width ARE a step (the batch-30 lesson). Desktop only. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-[8px] z-20 hidden select-none md:block">
            {[
              { cls: 'left-[-4%] w-[34%]', op: 'opacity-70' },
              { cls: 'left-[30%] w-[38%] scale-x-[-1]', op: 'opacity-70' },
              { cls: 'right-[-5%] w-[32%]', op: 'opacity-70' },
            ].map((c, i) => (
              <img
                key={i} src="/media/cloud-real.webp" alt="" loading="eager"
                className={`absolute bottom-0 h-auto max-w-none ${c.cls} ${c.op}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* batch 32 (owner): HIS fix, exactly — the SAME background image that paints the
          zone below the 04 box, duplicated as a TOP layer (z-20) at ~55% opacity across
          the foot line. Above and below the boundary are now the same pixels, so no tone
          step can exist. Masked so it has no edges of its own; its upper wisps thin to
          nothing before the CTA pill's worst-case seat. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[300px] select-none overflow-hidden"
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
        box="top-[100vh] bottom-0"
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
      {/* batch 33: every layer here now stops AT the section's edge (≤4vh lap) — clouds
          that crossed into the wheel's runway slid on scroll while the stage was pinned
          and broke the lock (his red circle). The veil owns the boundary alone. */}
      <WorldLayer
        src="/media/cloud-real.webp" eager
        box="bottom-0 h-[70vh]"
        imgClass="absolute left-[24%] top-[22%] w-[46%] h-auto max-w-none"
        y={['0%', '-9%']} base={0.95} float={{ px: 8, sec: 11 }}
      />
      <WorldLayer
        src="/media/cloud-real.webp" eager
        box="bottom-0 h-[64vh]"
        imgClass="absolute left-[2%] top-[38%] w-[34%] h-auto max-w-none scale-x-[-1]"
        y={['0%', '-7%']} base={0.85} float={{ px: 7, sec: 13, delay: 0.8 }}
      />
      <WorldLayer
        src="/media/cloud-real.webp" eager
        box="bottom-0 h-[60vh]"
        imgClass="absolute right-[6%] top-[30%] w-[30%] h-auto max-w-none"
        y={['0%', '-11%']} base={0.8} float={{ px: 6, sec: 9, delay: 1.5 }}
      />
      <WorldLayer
        src="/media/cloud-real.webp" eager
        box="bottom-0 h-[54vh]"
        imgClass="absolute left-[-8%] top-[16%] w-[36%] h-auto max-w-none"
        y={['0%', '-10%']} base={0.85}
      />
      <WorldLayer
        src="/media/cloud-real.webp" eager
        box="bottom-0 h-[54vh]"
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
          <button onClick={onOpen} className="group/title flex w-full cursor-pointer items-center justify-between py-1.5 -my-1.5 text-left" aria-expanded={active}>
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
                {/* batch 33 (owner): the body's foot clearance equals the next sheet's
                    overlap — the active card's CTA is never swallowed by the half cut */}
                <div className="max-w-2xl space-y-3 pt-3 pb-12 sm:space-y-4 sm:pt-4 sm:pb-16 lg:pb-[max(64px,8vh)]">
                  <span className="inline-block text-xs font-semibold uppercase tracking-wider text-ink/70 sm:text-sm">{s.sub}</span>
                  {s.paras.map((p) => (
                    <p key={p.slice(0, 16)} className="text-xs leading-relaxed text-ink/85 sm:text-sm lg:text-base">{p}</p>
                  ))}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {s.caps.map((c) => (
                      <span key={c} className="rounded-full border border-ink/15 bg-white/60 px-3 py-1.5 text-[12px] font-medium text-ink">
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
  // batch 50: below 900px the deck hands over to a plain accordion (see the `phone` return)
  const [phone, setPhone] = useState(false)
  const [openCard, setOpenCard] = useState(0)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 899px)')
    const read = () => setPhone(mq.matches)
    read()
    mq.addEventListener('change', read)
    return () => mq.removeEventListener('change', read)
  }, [])
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

  // batch 34 (owner): THE PARKED DECK — upcoming sheets rest at the viewport's bottom
  // edge ("almost touching the endpoint"), giving the open card the whole stage. Only
  // the NEXT sheet flies up to cover the previous one; the rest do not move until
  // their own turn. Seats are measured px; the flight is pure transform (Bennett law).
  // (Hooks live ABOVE the reduced-motion return — the Rules of Hooks.)
  const N = SERVICES.length
  // batch 38 (owner): O grew (~15%) so a covered sheet stops LOWER and shows more of
  // the row beneath (his red line); the parked deck rides LIFT px higher so the last
  // number is fully readable at the viewport's foot ("until you can see 04 clearly").
  const [g, setG] = useState({ vh: 900, head: 96, O: 92, P: 86, lift: 90 })
  useEffect(() => {
    const m = () => {
      const vh = window.innerHeight, w = window.innerWidth
      const short = vh <= 860
      const head = (short ? 48 : w >= 640 ? 80 : 64) + 16
      const O = short ? 64 : w >= 1024 ? Math.max(88, 0.11 * vh) : w >= 640 ? 84 : 60
      const P = short ? 64 : w >= 640 ? 86 : 62
      setG({ vh, head, O, P, lift: short ? 70 : 90 })
    }
    m()
    window.addEventListener('resize', m)
    return () => window.removeEventListener('resize', m)
  }, [])

  // reduced motion (or no JS-driven pin): the four cards as a plain stacked list
  if (reduced) {
    return (
      <div className="flex flex-col gap-10 py-10">
        {SERVICES.map((_, i) => <StackCard key={i} i={i} active onOpen={() => {}} />)}
      </div>
    )
  }

  // batch 50 (owner, mobile audit): THE DECK IS A DESKTOP INSTRUMENT. Parked rows only
  // show P px of each card, and P has to be small for four of them to fit a phone — so
  // every two-line title („SEO I POZICIONIRANJE", „OGLAŠAVANJE I KAMPANJE") was sliced
  // through the middle by the row beneath it. On a phone the four services become a plain
  // accordion: one open, the rest closed, nothing overlapping and nothing cut. The pin
  // (and its 420vh of runway) belongs to screens that can hold it.
  if (phone) {
    return (
      <div className="flex flex-col gap-4 px-1 py-8">
        {SERVICES.map((_, i) => (
          <div key={i} className="rounded-[1.6rem] bg-white/55 backdrop-blur-[6px]">
            <StackCard i={i} active={openCard === i} onOpen={() => setOpenCard(openCard === i ? -1 : i)} />
          </div>
        ))}
      </div>
    )
  }

  return (
    // batch 30 (owner): 420vh — much scroll per card, time to read. The sticky stage
    // keeps the batch-29 blanket (head melt + foot fade) beneath the sheets.
    <div ref={ref} className="relative h-[340vh] w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: `linear-gradient(to bottom, transparent 0%, ${CARD_BG} 90px, ${CARD_BG} calc(100% - 22vh), rgba(239,246,252,0) 100%)` }}
        />
        {SERVICES.map((_, i) => {
          const risenTop = g.head + i * g.O
          const parkedY = g.vh - (N - i) * g.P - g.lift - risenTop
          return (
            <motion.div
              key={i}
              className={`absolute left-0 right-0 ${i > 0 ? 'border-t border-ink/25 shadow-[0_-12px_28px_rgba(22,50,79,0.07)]' : ''}`}
              style={{
                top: risenTop,
                zIndex: i + 1,
                // the last sheet runs solid to the stage floor (batch 33, his order);
                // parked sheets carry a plate solid through their visible bar
                ...(i === N - 1
                  ? { height: g.vh - risenTop, background: CARD_BG }
                  : i > 0
                    ? { background: `linear-gradient(to bottom, ${CARD_BG} 0px, ${CARD_BG} 110px, rgba(239,246,252,0) 250px)` }
                    : {}),
              }}
              initial={false}
              animate={{ y: i <= active ? 0 : parkedY }}
              transition={{ duration: reduced ? 0 : 0.6, ease: [0.3, 0, 0.2, 1] }}
            >
              <StackCard i={i} active={active === i} onOpen={() => jump(i)} />
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

/* ------------------------------------------- the process wheel (his revolver, b32) */

/* REAL process only — these are the pipeline's own client-facing stages; no invented
   claims, no prices (factory law). */
const PROCESS = [
  { n: '01', t: 'Upoznavanje', d: 'Prvi razgovor — cilj, obim i rok. Bez obaveza i bez žargona.',
    g: 'M4 5h16v10H9l-5 4V5z M8 9h8 M8 12h5',
    more: [
      'Sve počinje razgovorom — uživo, telefonom ili porukom. Slušamo šta vam treba, gledamo gde ste sada i kažemo iskreno šta ima smisla raditi, a šta ne.',
      'Iz tog razgovora izlazi jasna slika: cilj sajta, obim posla i realan rok. Ako se ne dogovorimo — ništa niste izgubili.',
    ] },
  { n: '02', t: 'Ponuda i ugovor', d: 'Sve pismeno: šta se radi, do kada i za koliko. Bez skrivenih troškova.',
    g: 'M6 3h9l4 4v14H6V3z M14 3v5h5 M9 13h6 M9 17h4',
    more: [
      'Dobijate ponudu u kojoj piše tačno šta se radi, do kada i za koliko. Bez sitnih slova i bez skrivenih stavki.',
      'Ugovor potpisujemo pre početka — obim, rok i cena su fiksirani, a sajt i sadržaj od prvog dana pripadaju vama.',
    ] },
  { n: '03', t: 'Pravac dizajna', d: 'Prvo početna strana — izgled odobravate pre nego što gradimo ostatak.',
    g: 'M12 3a9 9 0 110 18 9 9 0 010-18z M15.5 8.5l-2.2 5-5 2.2 2.2-5 5-2.2z',
    more: [
      'Ne gradimo ceo sajt naslepo: prvo nastaje početna strana — izgled, boje, tipografija i ton celog sajta.',
      'Vi je pregledate i kažete šta valja, a šta ne. Tek kada odobrite pravac, gradimo ostatak — bez lutanja i bez prerade na kraju.',
    ] },
  { n: '04', t: 'Izrada sajta', d: 'Sekcija po sekcija, uz pregled napretka uživo tokom cele izrade.',
    g: 'M3 5h18v14H3V5z M3 9h18 M6 7h.01 M8.5 7h.01 M11 7h.01',
    more: [
      'Sajt raste sekcija po sekcija, a napredak pratite uživo, na pravom linku — ne na slikama.',
      'Svaka stranica se gradi i za telefon i za računar; tekstove i slike slažemo zajedno, da sve bude vaše.',
    ] },
  { n: '05', t: 'Provere', d: 'Brzina, SEO, telefon i svaki klik — proveravamo sve pre lansiranja.',
    g: 'M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z M9 12l2 2 4-4',
    more: [
      'Pre lansiranja sajt prolazi proveru brzine, SEO podešavanja, telefona i svakog klika — ništa ne ide napolje dok sve ne prođe.',
      'Ako nešto ne valja, popravljamo dok ne bude kako treba.',
    ] },
  { n: '06', t: 'Lansiranje i briga', d: 'Sajt kreće da radi za vas — a mi ostajemo uz njega i posle.',
    g: 'M3 11l18-7-7 18-2.5-7L3 11z',
    more: [
      'Sajt izlazi na vaš domen, a vi dobijate pristup i uputstvo — od prvog dana sami menjate tekstove i slike.',
      'Posle lansiranja ne nestajemo: ažuriranja, bezbednosne kopije i podrška direktno od ljudi koji su sajt gradili.',
    ] },
]

/* batch 50 (owner, mobile audit): THE PROCESS ON A PHONE.
   The revolver is a wide-screen instrument — it needs a giant arc off the left edge and a
   column of sky to its right. At 390px the numbers landed on top of the step's own text
   and the title was squeezed to nothing. A phone gets the six steps as an honest vertical
   list instead: number, icon, title, line, and the same two paragraphs behind „Saznajte
   više". No pin, no scroll-jacking, and the page loses 340vh of runway. */
function ProcessList() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    // the trailing sky is the junction guard: the last card must not sit near the beat's
    // edge or its panel reads as a full-width step (batch 50, measured 20)
    <div className="mx-auto w-full max-w-2xl px-5 pt-[310px] pb-[330px]">
      <h2 className="ink-gradient mb-10 text-center text-[clamp(2.4rem,11vw,3.6rem)] font-semibold leading-[0.95] tracking-tight">
        Naš proces
      </h2>
      <ol className="flex flex-col gap-3">
        {PROCESS.map((s, i) => {
          const isOpen = open === i
          return (
            <li key={s.n} className="rounded-[1.4rem] border border-white/70 bg-white/70 p-5 backdrop-blur-[6px]">
              <div className="flex items-start gap-4">
                <span aria-hidden className="mt-0.5 text-[26px] font-bold leading-none tracking-tight text-accent/70">
                  {s.n}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5">
                    <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5 shrink-0 stroke-accent" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d={s.g} />
                    </svg>
                    <h3 className="text-[17px] font-semibold leading-tight text-ink">{s.t}</h3>
                  </div>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-ink/70">{s.d}</p>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="mt-3 inline-flex min-h-[40px] items-center gap-2 rounded-full border border-accent/40 px-4 text-[12.5px] font-semibold uppercase tracking-[0.12em] text-accent"
                  >
                    {isOpen ? 'Zatvorite' : 'Saznajte više'}
                    <span aria-hidden className={isOpen ? 'rotate-45 transition-transform' : 'transition-transform'}>+</span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        {s.more.map((m, j) => (
                          <p key={j} className="mt-3 text-[13.5px] leading-relaxed text-ink/70">{m}</p>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

/** one number riding the wheel: seat at 3 o'clock (θ=0), passed steps rotate up along
    the arc and leave through the screen edge — his revolver. The step angle comes from
    the RADIUS (batch 37): a giant circle needs a small angle for the same spacing. */
function WheelNumber({ i, rot, R, cx, fontPx, numOff, step }: {
  i: number; rot: MotionValue<number>; R: number; cx: number; fontPx: number; numOff: number; step: number
}) {
  const rad = (d: number) => (d * Math.PI) / 180
  const th = (v: number) => v - i * step
  const numR = R + numOff
  const x = useTransform(rot, v => cx + numR * Math.cos(rad(th(v))))
  const y = useTransform(rot, v => -numR * Math.sin(rad(th(v))))
  const dotX = useTransform(rot, v => cx + R * Math.cos(rad(th(v))))
  const dotY = useTransform(rot, v => -R * Math.sin(rad(th(v))))
  const tilt = useTransform(rot, v => -th(v) * 0.8)
  const op = useTransform(rot, v => {
    const a = Math.abs(th(v))
    if (a > 2.6 * step) return 0
    return a < step * 0.2 ? 1 : Math.max(0.16, 0.3 - a / (15 * step))
  })
  const dotOp = useTransform(rot, v => (Math.abs(th(v)) > 2.6 * step ? 0 : Math.abs(th(v)) < step * 0.2 ? 0.9 : 0.35))
  const scale = useTransform(rot, v => 1.45 - Math.min(Math.abs(th(v)) / step, 1) * 0.55)
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
  const titleRef = useRef<HTMLHeadingElement>(null)
  const { reduced } = useWorld()
  // batch 50: below 900px the wheel hands over to the list (see ProcessList). Measured on
  // the client so the desktop prerender still ships the wheel's own markup.
  const [phone, setPhone] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 899px)')
    const read = () => setPhone(mq.matches)
    read()
    mq.addEventListener('change', read)
    return () => mq.removeEventListener('change', read)
  }, [])
  const [k, setK] = useState(0)
  const [expanded, setExpanded] = useState(false)
  const [dim, setDim] = useState({ R: 2000, cx: -1200, fontPx: 120, numOff: 120, step: 10, xTop: -999, textLeft: 1100, titleW: 560 })
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const N = PROCESS.length
  // the revolver CLICK: the cylinder dwells on each seat (~55% of its window) and turns
  // between dwells — piecewise stops, so a resting scroll never parks between numbers
  const stops: number[] = [], angles: number[] = []
  const seg = (0.92 - 0.08) / (N - 1)
  for (let j = 0; j < N; j++) {
    const c = 0.08 + j * seg
    stops.push(Math.max(0.08, c - seg * 0.28), Math.min(0.92, c + seg * 0.28))
    angles.push(j * dim.step, j * dim.step)
  }
  const rot = useTransform(scrollYProgress, stops, angles, { clamp: true })

  useEffect(() => {
    // sync IMMEDIATELY too — when the geometry (step) re-derives after mount, waiting
    // for the next scroll event left k pointing at the wrong seat (number↔text desync)
    const update = (v: number) => setK(Math.min(N - 1, Math.max(0, Math.round(v / dim.step))))
    update(rot.get())
    return rot.on('change', update)
  }, [rot, N, dim.step])

  useEffect(() => {
    const m = () => {
      // batch 37 (owner): "imagine a fully drawn circle but OUTSIDE the viewport" — a
      // giant radius (2.2·vh), centre far off-left, so the visible line is a near-
      // vertical arc entering the top edge and leaving the bottom edge; the numbers'
      // seat lands at the viewport's CENTRE, words to its right. The step angle now
      // derives from the radius (same ~370px seat spacing at any R); clouds sit on the
      // two edge-crossing points so the line always emerges from behind a cloud.
      // batch 39 (owner): HIS drawing, measured — the step content's left edge sits
      // exactly on the TITLE's left edge (his vertical blue line); the numbers seat
      // just left of it, and the ring rides where his red arc runs. The whole assembly
      // derives from the title's real rendered edge, not a guess. The stage is
      // overflow-visible + top layer, so the arc closes off-screen — never a break.
      const vh = window.innerHeight, vw = window.innerWidth
      if (vw < 640) {
        const R = Math.max(104, Math.min(vh * 0.467, vw * 0.3))
        let cx = vw * 0.47 - 1.19 * R
        if (cx > R - 30) cx = R - 30
        setDim({ R, cx, fontPx: Math.max(30, R * 0.2), numOff: R * 0.19, step: 26, xTop: -999, textLeft: cx + R * 1.38 + 28, titleW: 320 })
      } else {
        const R = Math.max(140, Math.min(vh * 0.72, vw * 0.41))
        const fontPx = Math.max(34, R * 0.2)
        // batch 40: align to the title's VISUAL glyph edge, not its box — the
        // ink-gradient class carries descender-guard padding (offset by negative
        // margins), so rect.left sits ~0.1em left of the first glyph. rect.left +
        // paddingLeft = where the ink actually starts. Same for the right edge.
        let titleLeft = vw * 0.34, titleW = vw * 0.31
        if (titleRef.current) {
          const r = titleRef.current.getBoundingClientRect()
          const cs = window.getComputedStyle(titleRef.current)
          const padL = parseFloat(cs.paddingLeft) || 0
          const padR = parseFloat(cs.paddingRight) || 0
          titleLeft = r.left + padL
          titleW = r.width - padL - padR
        }
        const seat = titleLeft - fontPx * 1.05
        const cx = seat - 1.19 * R
        setDim({ R, cx, fontPx, numOff: R * 0.19, step: 26, xTop: -999, textLeft: titleLeft, titleW })
      }
    }
    // the title's rendered width shifts once the display font arrives — re-measure
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(() => m()).catch(() => {})
    }
    m()
    window.addEventListener('resize', m)
    return () => window.removeEventListener('resize', m)
  }, [])

  if (reduced || phone) return <ProcessList />

  const { R, cx, fontPx, numOff, step, textLeft, titleW } = dim
  const narrow = typeof window !== 'undefined' && window.innerWidth < 640
  return (
    <div ref={ref} className="relative h-[340vh] w-full">
      {/* the whole six-step process, for readers and crawlers — the wheel itself is
          decorative motion (aria-hidden numbers, one visible text at a time) */}
      <ul className="sr-only">
        {PROCESS.map(s => (
          <li key={s.n}>{s.n} — {s.t}: {s.d} {s.more.join(' ')}</li>
        ))}
      </ul>
      {/* batch 38 (owner): NO overflow clip and a raised layer — the ring may run into
          the sections above and beneath and stays on top of everything, so no boundary
          can ever cut its line */}
      <div className="sticky top-0 z-30 h-screen w-full">
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
        {/* batch 37 (owner): bigger, a touch lower, CENTRED under the nav */}
        <h2
          ref={titleRef}
          className="ink-gradient absolute left-1/2 top-28 w-max -translate-x-1/2 text-center font-semibold uppercase
                     leading-none tracking-tight sm:top-32 text-[clamp(2.75rem,8.5vw,4rem)] lg:text-[clamp(4rem,7vw,6.25rem)]"
          // batch 40: the gradient class's HORIZONTAL guard (padding + negative margin)
          // shifted the translate-centred box 0.1em left of true centre — the vertical
          // guard stays (descenders), the horizontal one is zeroed so the glyphs centre
          // exactly on the nav's own centreline
          style={{ paddingLeft: 0, paddingRight: 0, marginLeft: 0, marginRight: 0 }}
        >
          Naš proces
        </h2>

        {/* batch 34 (owner): the wheel shrinks toward the left edge when a step opens —
            "Saznajte više" pushes the cylinder aside and the story takes the right */}
        <motion.div
          initial={false}
          animate={{ scale: expanded ? 0.55 : 1 }}
          transition={{ duration: 0.6, ease: [0.3, 0, 0.2, 1] }}
          className="absolute inset-0 origin-[0%_50%]"
        >
          {/* wheel space: local (0,0) = left edge, mid-height */}
          <div aria-hidden className="absolute left-0 top-1/2">
            {/* batch 37: the arc of a circle whose body lives OUTSIDE the viewport —
                no forced layer (a 2R square at this radius would be a giant GPU alloc;
                only the visible sliver rasters on the shared layer) */}
            <div
              className="absolute rounded-full border border-ink/25"
              style={{ width: 2 * R, height: 2 * R, left: cx - R, top: -R }}
            />
            {PROCESS.map((_, i) => (
              <WheelNumber key={i} i={i} rot={rot} R={R} cx={cx} fontPx={fontPx} numOff={numOff} step={step} />
            ))}
          </div>
        </motion.div>


        {/* the active step's words, at the seat's right — swap per step. On phones the
            seat's right is too narrow: the words sit UNDER the seat instead. */}
        <AnimatePresence>
          {!expanded && (
            <motion.div
              key="seat-text"
              // batch 41 (owner): a clean HANDOVER, never an overlap — the leaving text
              // finishes its exit before the arriving one begins (0.35s stagger both ways)
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.38, duration: 0.4, ease: [0.3, 0, 0.2, 1] } }}
              exit={{ opacity: 0, x: -30, transition: { duration: 0.3, ease: [0.3, 0, 0.2, 1] } }}
              className="absolute max-sm:inset-x-6 max-sm:top-[64%] sm:top-1/2 sm:-translate-y-1/2 sm:pr-4"
              style={narrow ? undefined : { left: textLeft, maxWidth: `min(32rem, calc(100vw - ${Math.round(textLeft)}px - 1.5rem))` }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={k}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.35, ease: [0.3, 0, 0.2, 1] }}
                >
                  <div className="flex items-center gap-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-ink/25 bg-white/55 shadow-sm sm:h-14 sm:w-14">
                      <svg viewBox="0 0 24 24" className="h-6 w-6 sm:h-7 sm:w-7" fill="none" stroke="#16324F"
                           strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d={PROCESS[k].g} />
                      </svg>
                    </span>
                    <h3 className="ink-gradient text-2xl font-semibold uppercase tracking-tight sm:text-4xl lg:text-5xl">
                      {PROCESS[k].t}
                    </h3>
                  </div>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-ink/75 sm:mt-4 sm:text-lg">
                    {PROCESS[k].d}
                  </p>
                  <button
                    onClick={() => setExpanded(true)}
                    className="mt-4 inline-flex min-h-[40px] cursor-pointer items-center gap-2 rounded-full border border-ink/30 bg-white/60
                               px-5 py-2 text-xs font-semibold uppercase tracking-wider text-ink shadow-sm backdrop-blur-sm
                               transition-all hover:scale-[1.03] hover:bg-white sm:mt-5"
                  >
                    Saznajte više <span aria-hidden>+</span>
                  </button>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* batch 34 (owner): the STORY panel — the wheel steps aside, the step opens.
            Scrolling on keeps turning the cylinder; the panel follows the active step. */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              key="story"
              // batch 41 (owner): arrives only AFTER the seat text has left (handover)
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0, transition: { delay: 0.38, duration: 0.5, ease: [0.3, 0, 0.2, 1] } }}
              exit={{ opacity: 0, x: 40, transition: { duration: 0.3, ease: [0.3, 0, 0.2, 1] } }}
              className="absolute max-sm:inset-x-6 max-sm:top-[38%] sm:top-1/2 sm:-translate-y-1/2"
              // batch 40 (owner): the story sits INSIDE the title's two edges — same
              // left, same width, centred against the main title by construction
              style={narrow ? undefined : { left: textLeft, width: titleW }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={k}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.35, ease: [0.3, 0, 0.2, 1] }}
                >
                  <div className="flex items-center gap-4">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-ink/25 bg-white/55 shadow-sm sm:h-16 sm:w-16">
                      <svg viewBox="0 0 24 24" className="h-7 w-7 sm:h-8 sm:w-8" fill="none" stroke="#16324F"
                           strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d={PROCESS[k].g} />
                      </svg>
                    </span>
                    <h3 className="ink-gradient text-3xl font-semibold uppercase tracking-tight sm:text-5xl">
                      {PROCESS[k].t}
                    </h3>
                  </div>
                  {PROCESS[k].more.map(p => (
                    <p key={p.slice(0, 12)} className="mt-4 max-w-xl text-sm leading-relaxed text-ink/85 sm:mt-5 sm:text-lg">
                      {p}
                    </p>
                  ))}
                  <button
                    onClick={() => setExpanded(false)}
                    className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-full border border-ink/30 bg-white/60
                               px-5 py-2 text-xs font-semibold uppercase tracking-wider text-ink shadow-sm backdrop-blur-sm
                               transition-all hover:scale-[1.03] hover:bg-white"
                  >
                    <span aria-hidden>←</span> Nazad
                  </button>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
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

          {/* batch 32/33 (owner): NAŠ PROCES — the revolver wheel between the stack and
              KO SMO MI. NO world layers on this beat: a parallax cloud slid across the
              pinned stage and broke the lock (his red circle) — all weather rides
              INSIDE the sticky stage now. */}
          <Beat name="proces">
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
