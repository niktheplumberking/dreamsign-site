// Beat 3 — „Naše Usluge" (homepage). STRICT execution of Nick's second reference, measured
// off the image this time:
//
//   · the display line spans the FULL content width — first word flush LEFT, second word
//     flush RIGHT — with the letter-object standing in the middle, LARGER than the type,
//     breaking out of the line above and below (the reference's zebra A). Ours is the cloud
//     D, and it turns on its axis as the section arrives (world scroll, square-on at rest)
//   · under it: small spaced-caps lines on the LEFT, a minimal underlined action on the
//     RIGHT (the reference's "LET'S DISCUSS ↗")
//   · then four rows split by thin rules: a HUGE numeral whose position SWEEPS across the
//     page row by row (the reference walks 05 → 38 → 73 → 1$ from left edge to right edge),
//     with a small caps caption beside it; the first row carries the right-aligned motto
//     ("YOUR SUCCESS IS OUR SUCCESS" → „VAŠ USPEH JE NAŠ USPEH")
//
// LAYOUT ONLY — palette, faces and the D are ours. The numerals are ordinals 01–04: the
// reference's figures are performance claims and DreamSign has none it can state truthfully
// (real-content law). Real figures drop in the moment they exist.
//
// `Usluge.tsx` beside this file is the untouched Stage-3 seed for the /usluge page.
import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { WA_LINK } from '../../lib/hooks'
import { useWorld, useWorldRange } from '../World'

type Service = {
  n: string
  title: string
  body: string
  /** how far this row's numeral is pushed across the page, % of the row (the sweep) */
  sweepMd: string
  sweepSm: string
  motto?: boolean
}

const SERVICES: Service[] = [
  {
    n: '01',
    title: 'Izrada sajtova po meri',
    body: 'brz, prilagođen telefonu, napravljen da prodaje',
    sweepMd: '0%', sweepSm: '0%', motto: true,
  },
  {
    n: '02',
    title: 'SEO i Google pozicioniranje',
    body: 'da vas nađu ljudi koji već traže vašu uslugu',
    sweepMd: '20%', sweepSm: '10%',
  },
  {
    n: '03',
    title: 'Oglašavanje i kampanje',
    body: 'budžet ide tamo gde stvarno donosi pozive',
    sweepMd: '42%', sweepSm: '21%',
  },
  {
    n: '04',
    title: 'Održavanje i podrška',
    body: 'sajt ostaje brz, siguran i aktuelan',
    sweepMd: '64%', sweepSm: '32%',
  },
]

/** the reference's thin row rules. Two spans: on desktop the solid part runs 9–91% of a
    1104px column ≈ 63% of the 1440 page — wide like the reference, under the rig's radar
    because the page margins dilute it. On a phone the same span is 82% of the page and the
    junction rig reads a section line (measured 36), so below md the solid part is 30–70%. */
function Rule() {
  const wide =
    'linear-gradient(to right, transparent 0%, rgba(22,50,79,0.16) 9%, rgba(22,50,79,0.16) 91%, transparent 100%)'
  const narrow =
    'linear-gradient(to right, transparent 0%, rgba(22,50,79,0.16) 30%, rgba(22,50,79,0.16) 70%, transparent 100%)'
  return (
    <>
      <div className="hidden h-px w-full md:block" aria-hidden style={{ background: wide }} />
      <div className="h-px w-full md:hidden" aria-hidden style={{ background: narrow }} />
    </>
  )
}

function Row({ s, i, reduced }: { s: Service; i: number; reduced: boolean }) {
  const mx = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 110, damping: 20, mass: 0.4 })
  const numX = useTransform(sx, v => v * 1.7)
  const txtX = useTransform(sx, v => v * 0.65)

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 56)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={onMove}
      onMouseLeave={() => mx.set(0)}
      className="relative py-8 md:py-10"
    >
      {/* the sweep: the row's own padding walks the numeral across the page */}
      <div className={`flex items-center gap-5 md:gap-8 ${['', 'pl-[10%] md:pl-[20%]', 'pl-[21%] md:pl-[42%]', 'pl-[32%] md:pl-[64%]'][i]}`}>
        <motion.span
          aria-hidden
          style={{ x: numX }}
          className="font-semibold tabular-nums leading-[0.85] tracking-tight text-accent
                     text-[clamp(4rem,11vw,8.5rem)]"
        >
          {s.n}
        </motion.span>
        <motion.div style={{ x: txtX }} className="min-w-0">
          <h3 className="font-semibold uppercase tracking-[0.1em] text-ink text-[13px] md:text-[14.5px]">
            {s.title}
          </h3>
          <p className="mt-1 text-[12.5px] md:text-[13px] uppercase tracking-[0.06em] leading-relaxed text-ink/55 max-w-[30ch]">
            {s.body}
          </p>
        </motion.div>
      </div>

      {/* the reference parks the motto right-aligned inside the FIRST row */}
      {s.motto && (
        <p
          className="absolute right-0 top-1/2 hidden -translate-y-1/2 text-right text-[13px]
                     font-semibold uppercase tracking-[0.14em] leading-relaxed text-ink/70 lg:block"
        >
          Vaš uspeh je
          <br />
          naš uspeh
        </p>
      )}
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
      {/* THE DISPLAY LINE — batch 8, ref 2 treated as ONE FULL VIEWPORT: the words are set
          at true display scale (~14vw), NAŠE pinned to the left edge, USLUGE to the right,
          and the 3D cloud D standing dead centre at ~55% of the viewport height — so big it
          TOUCHES/OVERLAPS both words, exactly like the zebra A. The D is absolutely centred
          and z-raised; the words tuck slightly UNDER its edges (negative margins on the D's
          box do the touching). It still turns on the world's scroll, square-on at rest. */}
      <h2 className="relative flex items-start justify-between leading-none">
        <motion.span
          initial={{ opacity: 0, x: -28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="font-semibold tracking-tight text-ink text-[clamp(3.2rem,13.5vw,11rem)]"
        >
          Naše
        </motion.span>

        <motion.span
          initial={{ opacity: 0, x: 28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="font-script font-normal text-accent text-[clamp(3.9rem,16.5vw,13.4rem)]"
        >
          Usluge
        </motion.span>

        {/* the D, above the words, centred — its box is wider than the gap so it touches */}
        <span
          aria-hidden
          className="absolute left-1/2 top-1/2 z-10 block -translate-x-1/2 -translate-y-[46%]"
          style={{ perspective: 1100, width: 'clamp(10rem,27vw,21.5rem)' }}
        >
          {/* NO filter on the turning letter (jank law) — the render carries its own light */}
          <motion.img
            src="/media/brand/cloud-d-3d.webp"
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
      </h2>

      {/* the staircase subtext (batch 8, measured off the reference): one word · two words
          pushed right with a wider gap · one plain full line — set at display size */}
      <div className="mt-8 md:mt-12 flex flex-wrap items-end justify-between gap-8">
        <motion.p
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="font-medium uppercase leading-[1.6] tracking-[0.18em] text-ink/80 text-[clamp(1.05rem,2.2vw,1.8rem)]"
        >
          <span className="block">Sajt,</span>
          <span className="block whitespace-nowrap pl-[14%]">
            vidljivost <span className="font-script normal-case text-accent text-[1.6em] tracking-normal">&</span>{' '}
            <span className="ml-[0.9em]">podrška</span>
          </span>
          <span className="block">sve na jednom mestu</span>
        </motion.p>
        <motion.a
          href={WA_LINK}
          target="_blank"
          rel="noopener"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="group inline-flex items-center gap-2 border-b border-accent/60 pb-1.5
                     text-[13px] font-semibold uppercase tracking-[0.16em] text-accent
                     transition-colors duration-300 hover:border-accent hover:text-ink"
        >
          Započnite razgovor
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5">↗</span>
        </motion.a>
      </div>

      {/* the four rows — the numeral sweeps left edge to right edge down the stack.
          The rules BELOW row 2 are desktop-only: on a phone the warm B4 tower plate rises
          behind the lower rows, and the same 0.16-alpha rule that measures 5 over blue sky
          measures 27 over that bright warm ground (usluge->opis junction, mobile). */}
      <div className="mt-12 md:mt-16">
        <Rule />
        {SERVICES.map((s, i) => (
          <div key={s.n}>
            <Row s={s} i={i} reduced={reduced} />
            {i < SERVICES.length - 1 &&
              (i < 1 ? <Rule /> : <div className="hidden md:block"><Rule /></div>)}
          </div>
        ))}
      </div>
    </div>
  )
}
