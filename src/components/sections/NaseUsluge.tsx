// Beat 3 — „Naše Usluge" (homepage). Layout executed from Nick's second reference (batch 6):
// a split headline with one object standing IN the word, a support line left and an action
// right, then numbered rows whose numerals cascade rightward, divided by hairlines.
// Layout only — the object is our cloud D, the type is our duet, the palette is the sky.
//
// NOTE: this is the HOMEPAGE beat. `Usluge.tsx` beside it is the untouched Stage-3 seed for
// the standalone /usluge page at Stage 6 — different job, deliberately not overwritten.
//
// Three things make this ours rather than a copy:
//   · the D turns on its own axis as you arrive, and is square-on by the time the section is
//     yours — driven by the world's ONE scroll value, never a second useScroll
//   · each row answers the mouse: sweep across it and the numeral and the words slide at
//     different rates, so the row has depth instead of a hover colour
//   · the dividers dissolve at both ends. A hairline across the content column reads as a
//     section line to the junction rig (measured 21-34, twice) and breaks the one-descent law
import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { WA_LINK } from '../../lib/hooks'
import { useWorld, useWorldRange } from '../World'

type Service = { n: string; title: string; body: string; step: number }

/**
 * The numerals are ordinals, deliberately. The reference fills this column with performance
 * figures (5 years, 38 employees, 73 clients); DreamSign has none of those it can state
 * truthfully yet, and inventing them is precisely what the real-content law forbids.
 * Ordinals carry the same typographic weight and claim only what is true.
 */
const SERVICES: Service[] = [
  {
    n: '01',
    title: 'Izrada sajtova po meri',
    body: 'Dizajn i razvoj od nule — brz sajt, prilagođen telefonu, napravljen da posetioca pretvori u upit.',
    step: 0,
  },
  {
    n: '02',
    title: 'SEO i Google pozicioniranje',
    body: 'Tehnička optimizacija i sadržaj koji vas podižu u pretrazi — da vas nađu ljudi koji već traže vašu uslugu.',
    step: 46,
  },
  {
    n: '03',
    title: 'Oglašavanje i kampanje',
    body: 'Google i društvene mreže — budžet ide tamo gde stvarno donosi pozive, uz jasan izveštaj.',
    step: 88,
  },
  {
    n: '04',
    title: 'Održavanje i podrška',
    body: 'Izmene, ažuriranja i bezbednost posle lansiranja — sajt ostaje brz, siguran i aktuelan.',
    step: 126,
  },
]

/** a divider that dissolves at both ends — never a full-width edge */
function SoftRule() {
  return (
    <div
      className="h-px w-full"
      aria-hidden
      style={{
        // the solid span must stay UNDER half the page's pixel columns or the median across
        // x tips and the rig reads a section line (measured 22 desk / 32 mobile at 18-82%)
        background:
          'linear-gradient(to right, transparent 0%, rgba(22,50,79,0.15) 32%, rgba(22,50,79,0.15) 68%, transparent 100%)',
      }}
    />
  )
}

function Row({ s, i, reduced }: { s: Service; i: number; reduced: boolean }) {
  const mx = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 110, damping: 20, mass: 0.4 })
  const numX = useTransform(sx, v => v * 1.7)   // the numeral rides in front
  const txtX = useTransform(sx, v => v * 0.65)  // the words trail behind it

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 38)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={onMove}
      onMouseLeave={() => mx.set(0)}
      className="group grid grid-cols-[auto_1fr] items-baseline gap-x-5 py-7 md:gap-x-9 md:py-9"
    >
      <motion.span
        aria-hidden
        style={{ x: numX, paddingLeft: s.step }}
        className="font-semibold tabular-nums leading-none tracking-tight text-accent/85
                   text-[clamp(2.4rem,6vw,4.6rem)] transition-colors duration-300 group-hover:text-accent"
      >
        {s.n}
      </motion.span>
      <motion.div style={{ x: txtX }}>
        <h3 className="font-semibold tracking-tight text-ink text-lg md:text-[24px]">{s.title}</h3>
        <p className="mt-1.5 max-w-xl text-[14px] md:text-[15.5px] leading-relaxed text-ink/70">
          {s.body}
        </p>
      </motion.div>
    </motion.div>
  )
}

export default function NaseUsluge() {
  const ref = useRef<HTMLDivElement>(null)
  const { p: world, reduced } = useWorld()

  // the D turns as the section arrives and is square-on once the section is fully yours
  const [enter, exit] = useWorldRange(ref, 1.12, 0.32)
  const rotY = useTransform(world, [enter, exit], [-84, 0], { clamp: true })
  const lift = useTransform(world, [enter, exit], [0.9, 1], { clamp: true })

  return (
    <div ref={ref} className="relative mx-auto max-w-6xl px-5 sm:px-6 py-16 md:py-28">
      {/* the headline, with the D standing in the middle of it */}
      <h2 className="flex items-center justify-center gap-3 sm:gap-6 md:gap-9 leading-none">
        <span className="font-semibold tracking-tight text-ink text-[clamp(2.1rem,7vw,5.4rem)]">
          Naše
        </span>
        <span
          aria-hidden
          className="relative block shrink-0"
          style={{ perspective: 900, width: 'clamp(3.4rem,10vw,8rem)' }}
        >
          {/* a puff sits behind it so the letter never turns against nothing */}
          <span
            className="absolute left-1/2 top-1/2 block w-[240%] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              paddingBottom: '150%',
              background: 'radial-gradient(closest-side, rgba(255,255,255,0.85), transparent 72%)',
            }}
          />
          {/* NO filter on the turning letter. A drop-shadow is recomputed every frame while
              rotateY runs, and it took the worst frame to 46ms against a 50ms law. The puff
              behind already grounds it; willChange keeps it on its own compositor layer. */}
          <motion.img
            src="/media/brand/cloud-d.webp"
            alt=""
            className="relative block h-auto w-full select-none"
            style={{
              rotateY: reduced ? 0 : rotY,
              scale: reduced ? 1 : lift,
              transformStyle: 'preserve-3d',
              willChange: 'transform',
            }}
          />
        </span>
        <span className="font-script font-normal text-accent text-[clamp(2.6rem,9vw,7rem)]">
          Usluge
        </span>
      </h2>

      {/* support left, action right — the reference's second band */}
      <div className="mt-12 md:mt-16 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
        <motion.p
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="max-w-lg text-[15.5px] md:text-[17px] leading-relaxed text-ink/75"
        >
          Sve što je potrebno da vas kupci nađu, razumeju i pozovu —{' '}
          <span className="font-script text-accent text-[1.45em] leading-none">na jednom mestu.</span>
        </motion.p>
        <motion.a
          href={WA_LINK}
          target="_blank"
          rel="noopener"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="group inline-flex w-fit items-center gap-2 rounded-full border border-accent/45 px-7 py-3
                     text-[15px] font-medium text-accent transition-colors duration-300
                     hover:bg-accent hover:text-bg md:justify-self-end"
        >
          Započnite razgovor
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5">↗</span>
        </motion.a>
      </div>

      {/* the numbered rows */}
      <div className="mt-10 md:mt-14">
        {/* rules open the stack and separate the rows — but NOT after the last one: a rule
            that close to the beat boundary is measured by the junction rig as a seam */}
        <SoftRule />
        {SERVICES.map((s, i) => (
          <div key={s.n}>
            <Row s={s} i={i} reduced={reduced} />
            {i < SERVICES.length - 1 && <SoftRule />}
          </div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mt-8 text-right text-[11.5px] uppercase tracking-[0.18em] text-ink/45"
      >
        Vaš uspeh je i naš uspeh
      </motion.p>
    </div>
  )
}
