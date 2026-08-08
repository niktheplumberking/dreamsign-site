// /kontakt — batch 44 (owner): the page rebuilt to his sitemap — hero (the duet, fonts
// swapped) → the review section (his Trustpilot-layout reference, carried by our REAL
// references: invented testimonials never ship, D62/D70) → the homepage's past-work
// beat → the FAQ (the radovi section, shared) → the standing finale. One world, one
// descent, the house parallax grammar throughout.
import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { World, WorldLayer, SeamBridge, Beat, useWorld } from '../components/World'
import PageHero from '../components/PageHero'
import Radovi from '../components/sections/Radovi'
import FaqSekcija from '../components/FaqSekcija'
import LandingCTA from '../components/LandingCTA'
import Ground from '../components/Ground'
import { MASK } from '../lib/masks'
import { WA_LINK } from '../lib/hooks'
import { bk } from '../lib/content'
import { usePageMeta } from '../lib/meta'
import { PAGE_SCHEMA } from '../lib/schema'

/* ------------------------------------------------- the review section (his reference) */

/* REAL references only — these are our live projects with OUR descriptions of the work;
   client quotes take these seats the day real ones exist (D62/D70). */
const RECENZIJE = [
  {
    thumb: '/media/radovi/bennett.webp', name: 'Bennett & Co', meta: 'bennettndco.com', href: 'https://www.bennettndco.com',
    line: 'Kompletan identitet i korporativni sajt — od logotipa i vizuala do lansiranja na sopstvenom domenu.',
  },
  {
    thumb: '/media/radovi/metalkolor.webp', name: 'Metal Kolor', meta: 'metal-kolor.rs', href: 'https://metal-kolor.rs/',
    line: 'Katalog, galerija i kontakt za majstore Srema — sajt koji zanatu daje izlog kakav zaslužuje.',
  },
  {
    thumb: '/media/radovi/pizzdarija.webp', name: 'Pizzdarija', meta: 'pizzdarija.rs', href: 'https://www.pizzdarija.rs/',
    line: 'Meni, priča i porudžbina na dva klika — u duhu lokala koji miriše na vatru.',
  },
  {
    thumb: '/media/brand/cloud-d.webp', name: 'Vaš projekat', meta: 'Započnite razgovor', href: WA_LINK,
    line: 'Sledeći rad kojim se hvalimo može biti vaš — dva klika i razgovaramo.',
  },
]

function ReviewSekcija({ reduced }: { reduced: boolean }) {
  // the usluge train, widened to a three-card stage on desktop: every step the whole
  // row slides one seat left, connected — the approved slider grammar
  const N = RECENZIJE.length
  const [idx, setIdx] = useState(0)
  const next = useCallback(() => setIdx((v) => v + 1), [])
  const prev = useCallback(() => setIdx((v) => v - 1), [])
  useEffect(() => {
    if (reduced) return
    const t = setInterval(next, 8000)
    return () => clearInterval(t)
  }, [next, reduced])

  const viewRef = useRef<HTMLDivElement>(null)
  const [slotW, setSlotW] = useState(0)
  const [slots, setSlots] = useState(3)
  useEffect(() => {
    const measure = () => {
      const el = viewRef.current
      if (!el) return
      const n = window.matchMedia('(min-width: 1024px)').matches ? 3 : window.matchMedia('(min-width: 640px)').matches ? 2 : 1
      setSlots(n)
      setSlotW((el.clientWidth - (n - 1) * 16) / n + 16)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const mod = (v: number, m: number) => ((v % m) + m) % m
  const Btn = ({ onClick, label, children }: { onClick: () => void; label: string; children: React.ReactNode }) => (
    <button
      onClick={onClick} aria-label={label}
      className="grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-full border border-ink/20
                 bg-white/60 text-ink shadow-sm backdrop-blur-md transition-all hover:scale-105 hover:bg-white"
    >
      {children}
    </button>
  )

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-8 lg:px-12">
      {/* the reference's centred head — ours in the house faces, with a TRUE fact where
          the rating badge sat (we claim no stars we don't have) */}
      <div className="text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-2xl font-medium leading-tight text-ink/85 sm:text-3xl"
        >
          Pogledajte radove,
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="ink-gradient mx-auto w-max max-w-full text-3xl font-bold leading-tight tracking-tight sm:text-4xl"
          // the gradient class's horizontal guard (negative margins) defeats mx-auto —
          // zero it so the line centres like its sibling (the b40 title lesson)
          style={{ paddingLeft: 0, paddingRight: 0, marginLeft: 'auto', marginRight: 'auto' }}
        >
          sarađujte sa poverenjem.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="mx-auto mt-4 flex max-w-full items-center justify-center gap-2 text-[13px] font-medium text-ink/60 sm:text-sm"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="#2E5F9E" strokeWidth="1.8"
               strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" />
          </svg>
          Svaki projekat uz ugovor — obim, rok i cena, pismeno.
        </motion.p>
      </div>

      {/* the reference's body: quote block left, the cards right */}
      <div className="mt-12 grid grid-cols-1 items-start gap-8 sm:mt-14 lg:grid-cols-12 lg:gap-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="flex flex-row items-center justify-between gap-6 lg:col-span-3 lg:flex-col lg:items-start lg:justify-start"
        >
          <div>
            <span aria-hidden className="block font-serif text-6xl leading-none text-ink/20 sm:text-7xl">„</span>
            <p className="mt-2 max-w-[16ch] text-lg font-semibold leading-snug text-ink sm:text-xl">
              Šta stoji iza naših projekata
            </p>
          </div>
          <div className="flex items-center gap-3 lg:mt-8">
            <Btn onClick={prev} label="Prethodna referenca">‹</Btn>
            <span aria-hidden className="hidden h-px w-10 bg-ink/30 sm:block" />
            <Btn onClick={next} label="Sledeća referenca">›</Btn>
          </div>
        </motion.div>

        <div className="lg:col-span-9">
          <div ref={viewRef} className="relative h-[240px] overflow-hidden py-1 sm:h-[230px]">
            {RECENZIJE.map((r, i) => {
              const s = mod(i - mod(idx, N), N)
              const off = s === N - 1 ? -1 : s
              return (
                <motion.div
                  key={r.name}
                  className="absolute left-0 top-1 h-[calc(100%-8px)]"
                  style={{ width: slots === 1 ? '100%' : `calc((100% - ${(slots - 1) * 16}px) / ${slots})` }}
                  initial={false}
                  animate={{ x: off * slotW }}
                  transition={{ duration: reduced || !slotW ? 0 : 0.7, ease: [0.3, 0, 0.2, 1] }}
                >
                  <a
                    href={r.href} target="_blank" rel="noopener"
                    className="flex h-full w-full flex-col rounded-2xl border border-white/80 bg-white p-5 text-left shadow-[0_10px_30px_rgba(22,50,79,0.08)] transition-transform hover:scale-[1.02] sm:p-6"
                  >
                    <p className="text-[13.5px] font-medium leading-relaxed text-ink/80 sm:text-sm">{r.line}</p>
                    <div className="mt-auto flex items-center gap-3 border-t border-ink/10 pt-4">
                      <img
                        src={r.thumb} alt={r.name}
                        className="h-10 w-10 shrink-0 rounded-full border border-ink/15 bg-white object-cover object-top"
                      />
                      <span className="flex min-w-0 flex-col">
                        <span className="truncate text-[13.5px] font-semibold text-ink">{r.name}</span>
                        <span className="truncate text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">
                          {r.meta} ↗
                        </span>
                      </span>
                    </div>
                  </a>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------- the page */

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
      {/* batch 44 (owner): the duet — row 1 in the PRIMARY face, row 2 in the quill
          (fonts and sizes swapped from the old classic hero); the side texts deleted */}
      <PageHero
        flip
        trust
        script="Dobar dan."
        title="Dva klika i razgovaramo."
        titleK="kontakt-naslov"
        scriptSize="text-[clamp(2rem,7.4vw,6rem)]"
      />

      <div className="pointer-events-none relative z-20 -mt-[18vh]">
        <SeamBridge className="top-0 h-[62vh]" />

        {/* the reviews — his reference layout on the world's quiet sky */}
        <Beat name="utisci" layers={
          <>
            <WorldLayer
              src="/media/B3-square-sky.webp" eager
              box="-top-[26vh] -bottom-[30vh]"
              imgClass="absolute inset-0 h-[126%] w-full object-cover object-center"
              y={['0%', '-9%']} base={0.85} mask={MASK.sky}
            />
            <WorldLayer
              src="/media/cloud-real.webp" eager
              box="top-[6vh] h-[70vh]"
              imgClass="absolute left-[-9%] top-[14%] w-[34%] h-auto max-w-none"
              y={['0%', '-11%']} base={0.85} float={{ px: 8, sec: 10 }}
            />
          </>
        }>
          <div aria-hidden style={{ height: 'max(30vh, 360px)' }} />
          <ReviewSekcija reduced={reduced} />
          <div aria-hidden style={{ height: 'max(34vh, 390px)' }} />
        </Beat>

        {/* the past work — the homepage's own beat, verbatim grammar */}
        <Beat name="radovi" layers={
          <>
            <WorldLayer
              src="/media/B7-vertical-sea.webp"
              box="-top-[24vh] -bottom-[30vh]"
              imgClass="absolute inset-0 h-[126%] w-full object-cover object-center"
              y={['0%', '-10%']} base={0.5} mask={MASK.sea}
            />
            <WorldLayer
              src="/media/cloud-real.webp" eager
              box="top-[10vh] h-[70vh]"
              imgClass="absolute right-[-8%] top-[10%] w-[30%] h-auto max-w-none scale-x-[-1]"
              y={['0%', '-9%']} base={0.8} float={{ px: 7, sec: 12, delay: 0.9 }}
            />
          </>
        }>
          <Radovi />
          <div aria-hidden style={{ height: 'max(34vh, 390px)' }} />
        </Beat>

        {/* the FAQ — the radovi section, shared */}
        <Beat name="faq" layers={
          <WorldLayer
            src="/media/cloud-real.webp" eager
            box="top-[4vh] h-[60vh]"
            imgClass="absolute left-[-7%] top-[20%] w-[28%] h-auto max-w-none"
            y={['0%', '-8%']} base={0.7} float={{ px: 6, sec: 11 }}
          />
        }>
          <div aria-hidden style={{ height: 'max(16vh, 330px)' }} />
          <FaqSekcija />
          <div aria-hidden style={{ height: 'max(32vh, 370px)' }} />
        </Beat>

        <Ground>
          <Beat name="finale">
            <div className="pt-[10vh]">
              <LandingCTA
                lead={bk('kontakt-cta', 'Bez formulara i bez čekanja — poruka stiže direktno vlasniku.')}
                leadK="kontakt-cta"
                script="Potpišite svoj san"
                clipId="ds-sign-kontakt"
              />
            </div>
          </Beat>
        </Ground>
      </div>
    </>
  )
}
