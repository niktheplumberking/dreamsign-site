// /kontakt — batch 44 (owner): the page rebuilt to his sitemap — hero (the duet, fonts
// swapped) → the review section (his Trustpilot-layout reference, carried by our REAL
// references: invented testimonials never ship, D62/D70) → the homepage's past-work
// beat → the FAQ (the radovi section, shared) → the standing finale. One world, one
// descent, the house parallax grammar throughout.
import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useScroll } from 'motion/react'
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
/* batch 46 (owner): longer, warmer copy — still OURS about the work (some professional,
   some friendlier), never words put in a client's mouth; real quotes and real faces take
   these seats the day they exist (D62/D70). */
const RECENZIJE = [
  {
    thumb: '/media/radovi/bennett.webp', name: 'Bennett & Co', meta: 'bennettndco.com', href: 'https://www.bennettndco.com',
    title: 'Identitet koji uliva poverenje',
    line: 'Kompletan identitet i korporativni sajt — od logotipa i vizuala do lansiranja na sopstvenom domenu. Miran, precizan nastup za firmu kojoj se veruje na reč: sve na jednom mestu, sve potpisano.',
    tags: ['Brend', 'Korporativni sajt'],
  },
  {
    thumb: '/media/radovi/metalkolor.webp', name: 'Metal Kolor', meta: 'metal-kolor.rs', href: 'https://metal-kolor.rs/',
    title: 'Izlog za zanat koji traje',
    line: 'Katalog, galerija i kontakt za majstore Srema. Zanat je dobio izlog kakav zaslužuje — jasan, brz i bez komplikacija, da mušterija za tri klika stigne do telefona.',
    tags: ['Web sajt', 'Katalog'],
  },
  {
    thumb: '/media/radovi/pizzdarija.webp', name: 'Pizzdarija', meta: 'pizzdarija.rs', href: 'https://www.pizzdarija.rs/',
    title: 'Porudžbina na dva klika',
    line: 'Meni, priča i porudžbina na dva klika — u duhu lokala koji miriše na vatru. Toplo i direktno, po meri gostiju koji tačno znaju šta hoće: picu na drva, bez zaobilaženja.',
    tags: ['Web sajt', 'Meni'],
  },
  {
    thumb: '/media/brand/cloud-d.webp', name: 'Vaš projekat', meta: 'Započnite razgovor', href: WA_LINK,
    title: 'Vaše mesto u ovom nizu',
    line: 'Sledeći rad kojim se hvalimo može biti vaš. Dva klika i razgovaramo — bez formulara, bez čekanja, direktno sa ljudima koji će vaš sajt zaista graditi. Razgovor ništa ne košta.',
    tags: ['WhatsApp', 'Bez obaveza'],
  },
]

function ReviewSekcija({ reduced }: { reduced: boolean }) {
  // batch 46 (owner): the section PINS — the camera locks and scroll turns the train,
  // one review per breath, time to read (the stack's lock grammar). Arrows jump the
  // runway; reduced motion keeps the flat row with clickable arrows.
  const N = RECENZIJE.length
  const [idx, setIdx] = useState(0)
  const runRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: runRef, offset: ['start start', 'end end'] })
  useEffect(() => {
    if (reduced) return
    return scrollYProgress.on('change', (p) => {
      setIdx(p < 0.28 ? 0 : p < 0.52 ? 1 : p < 0.76 ? 2 : 3)
    })
  }, [scrollYProgress, reduced])
  const jump = useCallback((to: number) => {
    const el = runRef.current
    if (!el) { setIdx(Math.min(N - 1, Math.max(0, to))); return }
    const targets = [0.12, 0.4, 0.64, 0.9]
    const k = Math.min(N - 1, Math.max(0, to))
    window.scrollTo({ top: el.offsetTop + targets[k] * (el.offsetHeight - window.innerHeight), behavior: 'smooth' })
  }, [N])
  const next = useCallback(() => jump(idx + 1), [jump, idx])
  const prev = useCallback(() => jump(idx - 1), [jump, idx])

  const prevOffs = useRef<Record<string, number>>({})
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

  const body = (
    <div className="mx-auto w-full max-w-[1520px] px-4 sm:px-8 lg:px-12">
      {/* the reference's centred head — ours in the house faces, with a TRUE fact where
          the rating badge sat (we claim no stars we don't have) */}
      {/* batch 45 (owner): the head MUCH bigger, on the house duet rule — row 1 primary,
          row 2 in the quill; the fact subtitle deleted (his order) */}
      {/* batch 50 (owner, mobile audit): 9vh of a phone screen is 76px — less than the
          floating nav pill needs, so the head's first row sat UNDER it. Phones get a fixed
          124px of sky (nav bottom 91 + air); the desktop's measured 9vh seat is untouched
          from sm up. */}
      <div className="pt-[100px] text-center sm:pt-[9vh]">
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
      <div className="mt-5 grid grid-cols-1 items-start gap-4 sm:mt-12 sm:gap-10 lg:grid-cols-12 lg:gap-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="flex flex-row items-center justify-between gap-6 lg:col-span-3 lg:flex-col lg:items-start lg:justify-start"
        >
          <div>
            <span aria-hidden className="block font-serif text-5xl leading-none text-ink/20 sm:text-8xl sm:text-[7rem]">„</span>
            <p className="mt-1.5 max-w-[14ch] text-lg font-semibold leading-snug text-ink sm:mt-3 sm:text-3xl">
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
          {/* batch 50: on a phone the 540px window left a third of the card empty under
              the text — the cards' own copy needs ~420px there */}
          <div ref={viewRef} className="relative h-[418px] overflow-hidden py-1 sm:h-[500px]">
            {RECENZIJE.map((r, i) => {
              const s = mod(i - mod(idx, N), N)
              const off = s === N - 1 ? -1 : s
              // batch 47 (owner): the LEFT card slides left and DISSOLVES — and the card
              // wrapping around to the right pops into its seat instead of sliding across
              // the whole row over its neighbours (his note)
              const prev = prevOffs.current[r.name] ?? off
              const wrapped = Math.abs(off - prev) > 1.5
              prevOffs.current[r.name] = off
              return (
                <motion.div
                  key={r.name}
                  className="absolute left-0 top-1 h-[calc(100%-8px)]"
                  style={{ width: slots === 1 ? '100%' : `calc((100% - ${(slots - 1) * 16}px) / ${slots})` }}
                  initial={false}
                  animate={{ x: off * slotW, opacity: off === -1 ? 0 : 1 }}
                  transition={
                    reduced || !slotW
                      ? { duration: 0 }
                      : wrapped
                        ? { x: { duration: 0 }, opacity: { duration: 0.45, ease: 'easeOut' } }
                        : { duration: 0.7, ease: [0.3, 0, 0.2, 1] }
                  }
                >
                  {/* batch 47 (owner): real card anatomy — head, rule, title, body, tags */}
                  <a
                    href={r.href} target="_blank" rel="noopener"
                    className="flex h-full w-full flex-col rounded-2xl border border-white/80 bg-white p-6 text-left shadow-[0_10px_30px_rgba(22,50,79,0.08)] transition-transform hover:scale-[1.02] sm:p-7"
                  >
                    <div className="flex items-center gap-3">
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
                    <div aria-hidden className="mt-4 h-px w-full bg-ink/10" />
                    <h3 className="mt-4 text-lg font-semibold leading-snug tracking-tight text-ink sm:text-xl">
                      {r.title}
                    </h3>
                    <p className="mt-2.5 text-[14.5px] font-medium leading-relaxed text-ink/70 sm:text-[15.5px]">
                      {r.line}
                    </p>
                    <div className="mt-auto flex flex-wrap gap-2 pt-4">
                      {r.tags.map((t) => (
                        <span key={t} className="rounded-full border border-ink/15 bg-tint/50 px-3 py-1.5 text-[12px] font-semibold text-ink/70">
                          {t}
                        </span>
                      ))}
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

  // reduced motion: the flat row, arrows switch instantly
  if (reduced) return body

  // the LOCK: a runway of one breath per review; the stage centres the whole section
  return (
    <div ref={runRef} className="relative h-[300vh] w-full">
      <div className="sticky top-0 flex h-screen w-full flex-col justify-center">
        {body}
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
      {/* batch 47 (owner): the cloud button between the title and the pills — glides
          down to the booking card in the FAQ */}
      <PageHero
        flip
        script="Dobar dan."
        title="Dva klika i razgovaramo."
        titleK="kontakt-naslov"
        scriptSize="text-[11.4vw] sm:text-[clamp(2rem,7.4vw,6rem)]"
        more={{ label: 'Zakažite termin', targetId: 'booking-embed-slot' }}
      />

      <div className="pointer-events-none relative z-20 -mt-[18vh]">
        <SeamBridge className="top-0 h-[62vh]" />

        {/* batch 45 (owner): the four trust cards moved INTO the hero's cloud sea (his
            red circle) — the same shy glass pills, pulled up over the hero's foot */}
        {/* batch 52 (owner): pulled higher on a phone so BOTH rows of the 2×2 land on the
            first screen — "it's not possible to see all four". sm+ keeps his -25vh seat. */}
        <div className="pointer-events-auto relative z-30 mx-auto -mt-[37vh] w-full max-w-6xl px-5 sm:-mt-[25vh] sm:px-6">
          <TrustPills reduced={reduced} immediate />
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
          {/* batch 52 (owner): on a phone this breath was dead space under the trust
              cards — the review head carries its own 124px of sky already. Halved below
              sm; the desktop's 22vh/260px is untouched. */}
          <div aria-hidden className="h-[70px] sm:h-[max(22vh,260px)]" />
          <ReviewSekcija reduced={reduced} />
          <div aria-hidden style={{ height: 'max(12vh, 150px)' }} />
          <Radovi trust={false} order={[1, 3, 0, 2, 4]} headerAlign="faq" />
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
