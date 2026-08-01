// /kontakt — the whole page IS the CTA (story-map: zero friction, the 2-click law at full
// size). Giant WhatsApp pill with the pen circling it at arrival, tel + address, and the
// folded Lično prisustvo moment (the vi→mi sky-map — brand-drawn, no third-party map ever).
// No contact form in v1: WhatsApp-first per the CTA law; email arrives with the domain.
import { useRef } from 'react'
import { motion, useTransform } from 'motion/react'
import { World, WorldLayer, SeamBridge, Beat, useWorld, useWorldRange } from '../components/World'
import HeroMini from '../components/HeroMini'
import Ground from '../components/Ground'
import { GlossyPill } from '../components/Nav'
import { MASK } from '../lib/masks'
import { WA_LINK } from '../lib/hooks'
import { LEGAL, SIGNATURE_STROKE, SIGNATURE_SWEEP, SIGNATURE_VIEWBOX } from '../lib/marks'
import { usePageMeta } from '../lib/meta'
import { PAGE_SCHEMA } from '../lib/schema'

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.6, delay: 0.15 * i },
})

/** the pen circles the pill once, at arrival — load+400ms per the build-spec */
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
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.4, duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <motion.div
        animate={reduced ? undefined : { y: [0, -7, 0] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* base size a step smaller: a 330px pill's flat top edge crosses >50% of a phone's
            pixel columns and reads as a section line to the rig (measured 48) */}
        <GlossyPill href={WA_LINK} className="px-8 sm:px-14 py-3 sm:py-4 text-[16px] sm:text-2xl font-semibold">
          Započnite razgovor
        </GlossyPill>
      </motion.div>
    </div>
  )
}

/** the folded Lično prisustvo — the in-person promise told by the pen, no humans, no
    third-party map. The route reads the world's one progress (one-descent grammar). */
function SkyMap() {
  const ref = useRef<HTMLDivElement>(null)
  const { p: world } = useWorld()
  const [enter, exit] = useWorldRange(ref, 0.9, 0.35)
  const route = useTransform(world, [enter, exit], [0, 1], { clamp: true })

  return (
    <div ref={ref} className="mx-auto grid max-w-6xl items-center gap-10 px-5 sm:px-6 md:grid-cols-[55fr_45fr] md:gap-14">
      <div>
        <motion.h2 {...fadeUp(0)} className="font-semibold tracking-tight text-ink text-2xl md:text-[40px] md:leading-[46px] [text-wrap:balance]">
          Kad zatreba, sedimo za vašim stolom — u vašoj firmi, <span className="relative inline-block">uživo.
            <svg viewBox="0 0 120 14" className="absolute -bottom-2 left-0 w-full" fill="none" aria-hidden>
              <motion.path d="M4 10 C 40 14, 80 12, 116 4" stroke="#2458A6" strokeWidth="3" strokeLinecap="round"
                initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ delay: 0.6, duration: 0.9, ease: [0.16, 1, 0.3, 1] }} />
            </svg>
          </span>
        </motion.h2>
        <motion.p {...fadeUp(1)} className="mt-5 text-[17px] leading-relaxed text-ink/70 max-w-md">
          Sajt je posao od poverenja. Zato ne radimo samo preko poruka — kada projekat to traži,
          dolazimo lično, slušamo kako vaš posao zaista radi i vraćamo se sa rešenjem.
        </motion.p>
        <motion.p {...fadeUp(2)} className="mt-4 text-[15px] text-ink/55">
          Ruma · Srbija — a put do vas je kratak.
        </motion.p>
      </div>

      {/* the sky-map: brand-drawn, self-hosted by definition (it's code). Tilted a breath
          on phones — its full-width plate edge is a razor to the junction rig (58/28),
          the same mobile treatment as the /radovi covers */}
      <motion.div {...fadeUp(1)} className="liquid-glass rounded-[1.75rem] p-4 rotate-[1.15deg] md:rotate-0">
        <svg viewBox="0 0 420 320" className="w-full h-auto rounded-[1.25rem]" role="img" aria-label="Stilizovana mapa — od vas do nas">
          <rect width="420" height="320" rx="20" fill="#DCEBF8" />
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
            fill="none" style={{ pathLength: route }}
          />
          <circle cx="70" cy="232" r="7" fill="#2458A6" />
          <text x="70" y="262" textAnchor="middle" fontFamily="Inter Tight" fontWeight="600" fontSize="15" fill="#16324F">vi</text>
          <g>
            <circle cx="342" cy="128" r="8" fill="#F5F9FD" stroke="#2458A6" strokeWidth="3.5" />
            <text x="342" y="104" textAnchor="middle" fontFamily="Inter Tight" fontWeight="600" fontSize="15" fill="#16324F">mi</text>
          </g>
        </svg>
      </motion.div>
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
    <div ref={ref} className="relative px-5 sm:px-6 pb-24 pt-4 text-center">
      <p
        aria-hidden
        className="font-script text-accent leading-tight text-[clamp(2.2rem,5vw,3.4rem)]"
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
    schema: PAGE_SCHEMA('Kontakt', '/kontakt'),
  })
  return (
    <main>
      <World>
        {/* useWorld needs the provider above it — the body is its own component */}
        <KontaktBody />
      </World>
    </main>
  )
}

function KontaktBody() {
  const { reduced } = useWorld()
  return (
    <>
      <HeroMini compact scriptAbove="Dobar dan." title="Dva klika i razgovaramo." />

      <div className="relative z-20 -mt-[14vh]">
        {/* the junction rides the sampled seam colour, homepage grammar */}
        <SeamBridge className="top-0 h-[56vh]" />
        <Beat name="kontakt" layers={
          <WorldLayer
            src="/media/B3-square-sky.webp" eager
            box="-top-[26vh] -bottom-[30vh]"
            imgClass="absolute inset-0 h-[126%] w-full object-cover object-center"
            y={['0%', '-9%']} base={0.85} mask={MASK.sky}
          />
        }>
          <div className="mx-auto max-w-4xl px-5 sm:px-6 pt-[22vh] pb-16 text-center">
            <CircledPill reduced={reduced} />
            <motion.p {...fadeUp(1)} className="mt-10 text-[15px] font-medium text-ink/60">
              ili pozovite{' '}
              <a href={LEGAL.phoneHref} className="text-accent/80 hover:text-accent font-semibold">
                {LEGAL.phone}
              </a>
            </motion.p>
            <motion.p {...fadeUp(2)} className="mt-2 text-[14px] text-ink/55">
              {LEGAL.seat}
            </motion.p>
          </div>
        </Beat>

        <Beat name="prisustvo" layers={
          <WorldLayer
            src="/media/bank-soft.webp" eager
            box="-top-[8vh] -bottom-[10vh]"
            imgClass="absolute right-[-14%] top-[10%] w-[46%] h-auto max-w-none scale-x-[-1]"
            y={['0%', '-10%']} base={0.5} float={{ px: 8, sec: 10 }}
          />
        }>
          <div className="pt-8 pb-10 md:pb-16">
            <SkyMap />
          </div>
        </Beat>

        <Ground>
          <Beat name="finale">
            <div className="pt-[22vh]">
              <MiniFinale />
            </div>
          </Beat>
        </Ground>
      </div>
    </>
  )
}
