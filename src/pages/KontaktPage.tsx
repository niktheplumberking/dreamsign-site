// /kontakt — batch 13: no reference existed, so per the owner's instruction the page
// adopts the /radovi aesthetic: script into a giant condensed title, then one ink-framed
// bento carrying everything a visitor needs — the two-click conversation, the brand-drawn
// sky-map (never a third-party map), and the real contact facts. Whole page = the CTA.
import { useRef } from 'react'
import { motion, useTransform } from 'motion/react'
import { World, WorldLayer, SeamBridge, Beat, useWorld, useWorldRange } from '../components/World'
import PageHero from '../components/PageHero'
import Ground from '../components/Ground'
import { GlossyPill } from '../components/Nav'
import { MASK } from '../lib/masks'
import { WA_LINK } from '../lib/hooks'
import { bk } from '../lib/content'
import { LEGAL, SIGNATURE_STROKE, SIGNATURE_SWEEP, SIGNATURE_VIEWBOX } from '../lib/marks'
import { usePageMeta } from '../lib/meta'
import { PAGE_SCHEMA } from '../lib/schema'

const SkyGap = () => <div aria-hidden style={{ height: 'max(38vh, 466px)' }} />

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, delay: 0.12 * i },
})

/** the pen circles the pill once, at arrival — kept from the approved first cut */
function CircledPill({ reduced }: { reduced: boolean }) {
  return (
    <div className="relative inline-block">
      <svg
        viewBox="0 0 340 110" aria-hidden
        className="absolute -inset-x-8 -inset-y-6 h-[calc(100%+3rem)] w-[calc(100%+4rem)] overflow-visible"
      >
        <motion.path
          d="M 170 8 C 268 6, 330 24, 330 54 C 330 86, 258 102, 168 102 C 78 102, 10 88, 10 56 C 10 28, 74 10, 150 10"
          stroke="#2458A6" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.9"
          initial={{ pathLength: reduced ? 1 : 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ delay: 0.4, duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <motion.div
        animate={reduced ? undefined : { y: [0, -7, 0] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <GlossyPill href={WA_LINK} className="px-8 py-3 text-[16px] font-semibold sm:px-12 sm:py-4 sm:text-xl">
          Započnite razgovor
        </GlossyPill>
      </motion.div>
    </div>
  )
}

/** the ink-framed contact bento — the /radovi frame texture carrying the whole page */
function KontaktBento({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const { p: world } = useWorld()
  const [enter, exit] = useWorldRange(ref, 0.9, 0.3)
  const route = useTransform(world, [enter, exit], [0, 1], { clamp: true })
  const tel = bk('kontakt-telefon', LEGAL.phone)

  return (
    <div ref={ref} className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <div className="grid w-full transform-gpu grid-cols-1 gap-3 overflow-hidden rounded-3xl bg-ink p-3 shadow-xl sm:gap-4 sm:p-4 lg:grid-cols-2 lg:p-5">

        {/* TILE 1 — the conversation (the whole page's reason) */}
        <motion.div
          {...fadeUp(0)}
          className="flex min-h-[380px] transform-gpu flex-col items-center justify-center rounded-2xl border border-white/70 bg-bg p-8 text-center shadow-md sm:min-h-[440px] sm:p-10"
        >
          <p aria-hidden className="font-script leading-none text-accent text-[clamp(2rem,4vw,3rem)]">
            Dobar dan.
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-[34px] sm:leading-[1.1]">
            {bk('kontakt-naslov', 'Dva klika i razgovaramo.')}
          </h2>
          <p className="mt-3 max-w-[34ch] text-[14.5px] leading-relaxed text-ink/65">
            Bez formulara i bez čekanja — poruka stiže direktno vlasniku.
          </p>
          <div className="mt-10">
            <CircledPill reduced={reduced} />
          </div>
          <p className="mt-9 text-[14px] font-medium text-ink/60">
            ili pozovite{' '}
            <a href={'tel:' + tel.replace(/[^+\d]/g, '')} className="font-semibold text-accent/85 hover:text-accent">
              {tel}
            </a>
          </p>
        </motion.div>

        {/* RIGHT COLUMN — the sky-map + the facts */}
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* TILE 2 — the brand-drawn map, the pen travelling vi → mi */}
          <motion.div {...fadeUp(1)} className="flex-1 transform-gpu rounded-2xl border border-white/70 bg-tint p-4 shadow-md sm:p-5">
            {/* own compositor layer: the per-frame route repaint otherwise re-rasters the
                big masked sky it shares a layer with (the /usluge pen-line scar, 192ms) */}
            <svg viewBox="0 0 420 320" className="h-auto w-full rounded-xl" role="img" aria-label="Stilizovana mapa — od vas do nas"
                 style={{ transform: 'translateZ(0)', willChange: 'transform' }}>
              <rect width="420" height="320" rx="16" fill="#DCEBF8" />
              <path d="M30 240 C 90 200, 150 228, 210 208 S 340 180, 396 214 L 396 300 L 30 300 Z" fill="#A8CEF0" opacity="0.45" />
              <path d="M20 268 C 100 240, 210 260, 300 244 S 390 236, 404 246 L 404 304 L 20 304 Z" fill="#6FA5D8" opacity="0.30" />
              <path d="M0 190 C 80 178, 130 210, 200 196 S 330 168, 420 188" stroke="#F5F9FD" strokeWidth="10" fill="none" strokeLinecap="round" opacity="0.9" />
              <g fill="#F5F9FD">
                <ellipse cx="86" cy="66" rx="34" ry="16" /><ellipse cx="110" cy="56" rx="22" ry="12" />
                <ellipse cx="322" cy="84" rx="30" ry="14" /><ellipse cx="344" cy="74" rx="18" ry="10" />
              </g>
              <motion.path
                d="M70 232 C 130 150, 240 260, 342 128"
                stroke="#2458A6" strokeWidth="4" strokeLinecap="round" strokeDasharray="1 14"
                fill="none" style={{ pathLength: reduced ? 1 : route }}
              />
              <circle cx="70" cy="232" r="7" fill="#2458A6" />
              <text x="70" y="262" textAnchor="middle" fontFamily="Inter Tight" fontWeight="600" fontSize="15" fill="#16324F">vi</text>
              <g>
                <circle cx="342" cy="128" r="8" fill="#F5F9FD" stroke="#2458A6" strokeWidth="3.5" />
                <text x="342" y="104" textAnchor="middle" fontFamily="Inter Tight" fontWeight="600" fontSize="15" fill="#16324F">mi</text>
              </g>
            </svg>
            <p className="mt-3 px-1 text-[13px] leading-relaxed text-ink/70">
              Kad zatreba, sedimo za vašim stolom — u vašoj firmi, <span className="font-semibold text-accent">uživo</span>.
              Ruma · Srbija, a put do vas je kratak.
            </p>
          </motion.div>

          {/* TILE 3 — the facts, black on white, no decoration */}
          <motion.div {...fadeUp(2)} className="transform-gpu rounded-2xl border border-white/70 bg-bg p-6 shadow-md sm:p-7">
            <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-[14px] sm:grid-cols-2">
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/50">Adresa</dt>
                <dd className="mt-0.5 font-medium text-ink/85">{bk('kontakt-adresa', LEGAL.seat)}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/50">Telefon</dt>
                <dd className="mt-0.5 font-medium text-ink/85">
                  <a href={'tel:' + tel.replace(/[^+\d]/g, '')} className="hover:text-accent">{tel}</a>
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/50">E-mail</dt>
                <dd className="mt-0.5 font-medium text-ink/85">
                  <a href={`mailto:${LEGAL.email}`} className="break-all hover:text-accent">{LEGAL.email}</a>
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/50">Registar</dt>
                <dd className="mt-0.5 font-medium text-ink/85">PIB {LEGAL.pib} · MB {LEGAL.registrationNo}</dd>
              </div>
            </dl>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

/** the mini landing: a short page still lands — the pen signs, no second pill */
function MiniFinale() {
  const ref = useRef<HTMLDivElement>(null)
  const { p, reduced } = useWorld()
  const [enter, exit] = useWorldRange(ref)
  const drawn = useTransform(p, [enter, exit], [0, 1], { clamp: true })
  const inked = useTransform(drawn, (v) => SIGNATURE_SWEEP * v)

  return (
    <div ref={ref} className="relative px-5 pb-24 pt-4 text-center sm:px-6">
      <p
        aria-hidden
        className="font-script leading-tight text-accent text-[clamp(2.2rem,5vw,3.4rem)]"
        style={{ textShadow: '0 1px 0 currentColor' }}
      >
        Potpišite svoj san
      </p>
      <svg viewBox={SIGNATURE_VIEWBOX} className="mx-auto -mt-2 w-[min(72%,420px)] overflow-visible" aria-hidden>
        <defs>
          <clipPath id="ds-sign-kontakt">
            <motion.rect x="-8" y="-16" height="92" width={reduced ? SIGNATURE_SWEEP : inked} />
          </clipPath>
        </defs>
        <g clipPath="url(#ds-sign-kontakt)" fill="#2458A6">
          <path d={SIGNATURE_STROKE} />
        </g>
      </svg>
    </div>
  )
}

export default function KontaktPage() {
  usePageMeta({
    title: 'Kontakt — DreamSign | Ruma, Srbija',
    description:
      'Javite nam se jednim klikom na WhatsApp (+381 63 773 6963) ili telefonom. DreamSign, Ruma — sajtovi koji prodaju; ponuda posle prvog razgovora.',
    path: '/kontakt',
    ogImage: '/media/og-kontakt.jpg',
    schema: PAGE_SCHEMA('Kontakt', '/kontakt'),
  })
  return (
    <main>
      <World>
        <KontaktBody />
      </World>
    </main>
  )
}

function KontaktBody() {
  const { reduced } = useWorld()
  return (
    <>
      <PageHero
        script="Dobar dan."
        title="Kontakt"
        left="Ruma · Srbija"
        right={bk('kontakt-telefon', LEGAL.phone)}
      />

      <div className="pointer-events-none relative z-20 -mt-[18vh]">
        <SeamBridge className="top-0 h-[62vh]" />

        <Beat name="kontakt" layers={
          <WorldLayer
            src="/media/B3-square-sky.webp" eager
            box="-top-[26vh] -bottom-[26vh]"
            imgClass="absolute inset-0 h-[126%] w-full object-cover object-center"
            y={['0%', '-9%']} base={0.85} mask={MASK.sky}
          />
        }>
          <SkyGap />
          <KontaktBento reduced={reduced} />
          <div aria-hidden style={{ height: 'max(30vh, 340px)' }} />
        </Beat>

        <Ground>
          <Beat name="finale">
            <div className="pt-[10vh]">
              <MiniFinale />
            </div>
          </Beat>
        </Ground>
      </div>
    </>
  )
}
