// /kontakt — batch 44 (owner): the page rebuilt to his sitemap — hero (the duet, fonts
// swapped) → the review section (his Trustpilot-layout reference, carried by our REAL
// references: invented testimonials never ship, D62/D70) → the homepage's past-work
// beat → the FAQ (the radovi section, shared) → the standing finale. One world, one
// descent, the house parallax grammar throughout.
import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { World, WorldLayer, SeamBridge, Beat, useWorld } from '../components/World'
import PageHero from '../components/PageHero'
import Radovi, { TrustPills } from '../components/sections/Radovi'
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
      className="grid h-12 w-12 shrink-0 cursor-pointer place-items-center rounded-full border border-ink/20 text-xl
                 bg-white/60 text-ink shadow-sm backdrop-blur-md transition-all hover:scale-105 hover:bg-white"
    >
      {children}
    </button>
  )

  return (
    <div className="mx-auto w-full max-w-[1520px] px-4 sm:px-8 lg:px-12">
      {/* the reference's centred head — ours in the house faces, with a TRUE fact where
          the rating badge sat (we claim no stars we don't have) */}
      {/* batch 45 (owner): the head MUCH bigger, on the house duet rule — row 1 primary,
          row 2 in the quill; the fact subtitle deleted (his order) */}
      <div className="text-center">
        <motion.h2
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="leading-none"
        >
          <span
            className="ink-gradient mx-auto block w-max max-w-full font-semibold tracking-tight text-[clamp(2.4rem,5.4vw,5rem)]"
            style={{ paddingLeft: 0, paddingRight: 0, marginLeft: 'auto', marginRight: 'auto' }}
          >
            Pogledajte radove,
          </span>
          <span className="mt-1 block font-script font-normal leading-[1.05] text-accent text-[clamp(2.4rem,5.4vw,4.9rem)]">
            sarađujte sa poverenjem.
          </span>
        </motion.h2>
      </div>

      {/* the reference's body: quote block left, the cards right */}
      <div className="mt-14 grid grid-cols-1 items-start gap-10 sm:mt-16 lg:grid-cols-12 lg:gap-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="flex flex-row items-center justify-between gap-6 lg:col-span-3 lg:flex-col lg:items-start lg:justify-start"
        >
          <div>
            <span aria-hidden className="block font-serif text-8xl leading-none text-ink/20 sm:text-[7rem]">„</span>
            <p className="mt-3 max-w-[14ch] text-2xl font-semibold leading-snug text-ink sm:text-3xl">
              Šta stoji iza naših projekata
            </p>
          </div>
          <div className="flex items-center gap-4 lg:mt-10">
            <Btn onClick={prev} label="Prethodna referenca">‹</Btn>
            <span aria-hidden className="hidden h-px w-14 bg-ink/30 sm:block" />
            <Btn onClick={next} label="Sledeća referenca">›</Btn>
          </div>
        </motion.div>

        <div className="lg:col-span-9">
          <div ref={viewRef} className="relative h-[360px] overflow-hidden py-1 sm:h-[340px]">
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
                    className="flex h-full w-full flex-col rounded-2xl border border-white/80 bg-white p-6 text-left shadow-[0_10px_30px_rgba(22,50,79,0.08)] transition-transform hover:scale-[1.02] sm:p-8"
                  >
                    <p className="text-[15px] font-medium leading-relaxed text-ink/80 sm:text-[17px] sm:leading-relaxed">{r.line}</p>
                    <div className="mt-auto flex items-center gap-3 border-t border-ink/10 pt-4">
                      <img
                        src={r.thumb} alt={r.name}
                        className="h-12 w-12 shrink-0 rounded-full border border-ink/15 bg-white object-cover object-top"
                      />
                      <span className="flex min-w-0 flex-col">
                        <span className="truncate text-[15.5px] font-semibold text-ink">{r.name}</span>
                        <span className="truncate text-[12px] font-semibold uppercase tracking-[0.12em] text-accent">
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
      {/* no trust text row here — the four GLASS cards carry those exact facts in the
          hero's sea now (batch 45); doubling them read as noise */}
      <PageHero
        flip
        script="Dobar dan."
        title="Dva klika i razgovaramo."
        titleK="kontakt-naslov"
        scriptSize="text-[clamp(2rem,7.4vw,6rem)]"
      />

      <div className="pointer-events-none relative z-20 -mt-[18vh]">
        <SeamBridge className="top-0 h-[62vh]" />

        {/* batch 45 (owner): the four trust cards moved INTO the hero's cloud sea (his
            red circle) — the same shy glass pills, pulled up over the hero's foot */}
        <div className="pointer-events-auto relative z-30 mx-auto -mt-[13vh] w-full max-w-6xl px-5 sm:px-6">
          <TrustPills reduced={reduced} />
        </div>

        {/* batch 45 (owner): ONE content beat — reviews, past work and FAQ live in the
            same beat now, so the junction law stops demanding a sky field between them
            (mid-beat razors are never scanned — the usluge mega-beat precedent). The
            gaps shrank to breaths. */}
        <Beat name="sadrzaj" layers={
          <>
            <WorldLayer
              src="/media/B3-square-sky.webp" eager
              box="-top-[26vh] h-[150vh]"
              imgClass="absolute inset-0 h-[120%] w-full object-cover object-center"
              y={['0%', '-9%']} base={0.85} mask={MASK.sky}
            />
            <WorldLayer
              src="/media/cloud-real.webp" eager
              box="top-[6vh] h-[70vh]"
              imgClass="absolute left-[-9%] top-[14%] w-[34%] h-auto max-w-none"
              y={['0%', '-11%']} base={0.85} float={{ px: 8, sec: 10 }}
            />
            <WorldLayer
              src="/media/B7-vertical-sea.webp"
              box="top-[110vh] h-[220vh]"
              imgClass="absolute inset-0 h-[118%] w-full object-cover object-center"
              y={['0%', '-10%']} base={0.5} mask={MASK.sea}
            />
            <WorldLayer
              src="/media/cloud-real.webp" eager
              box="top-[150vh] h-[70vh]"
              imgClass="absolute right-[-8%] top-[10%] w-[30%] h-auto max-w-none scale-x-[-1]"
              y={['0%', '-9%']} base={0.8} float={{ px: 7, sec: 12, delay: 0.9 }}
            />
            <WorldLayer
              src="/media/cloud-real.webp" eager
              box="bottom-[26vh] h-[60vh]"
              imgClass="absolute left-[-7%] top-[20%] w-[28%] h-auto max-w-none"
              y={['0%', '-8%']} base={0.7} float={{ px: 6, sec: 11 }}
            />
          </>
        }>
          <div aria-hidden style={{ height: 'max(22vh, 260px)' }} />
          <ReviewSekcija reduced={reduced} />
          <div aria-hidden style={{ height: 'max(12vh, 150px)' }} />
          <Radovi trust={false} />
          <div aria-hidden style={{ height: 'max(9vh, 110px)' }} />
          <FaqSekcija />
          <div aria-hidden style={{ height: 'max(30vh, 350px)' }} />
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
