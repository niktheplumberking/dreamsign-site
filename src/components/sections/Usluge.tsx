// Scene 3 — Usluge teaser. M4 hover-accordion cloud cards; entrances = Galaxy fade-up
// (useInView once, margin -100px, y30→0, 0.6s, stagger 0.15). Custom-drawn glyphs, no icon sets.
import { motion } from 'motion/react'

const SERVICES = [
  {
    id: 'izrada', naslov: 'Izrada premium sajtova',
    recenica: 'Sajt građen da prodaje, ne samo da postoji.',
    vise: 'Od prve skice do lansiranja — dizajn, animacije i sadržaj koji vode posetioca ka razgovoru.',
    glyph: (
      <svg viewBox="0 0 48 48" fill="none" className="h-9 w-9" aria-hidden>
        <rect x="6" y="10" width="36" height="26" rx="5" stroke="#2458A6" strokeWidth="2.5" />
        <path d="M6 18h36" stroke="#2458A6" strokeWidth="2.5" />
        <path d="M15 27c2-3.5 6-3.5 8 0s6 3.5 8 0" stroke="#6FA5D8" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'redizajn', naslov: 'Redizajn',
    recenica: 'Vaš postojeći sajt, prerođen.',
    vise: 'Zadržavamo ono što radi, menjamo ono što koči — novi izgled, ista adresa.',
    glyph: (
      <svg viewBox="0 0 48 48" fill="none" className="h-9 w-9" aria-hidden>
        <path d="M38 20a15 15 0 10-3.5 14" stroke="#2458A6" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M38 10v10h-10" stroke="#6FA5D8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'brendiranje', naslov: 'Brendiranje i vizuelni identitet',
    recenica: 'Logo, boje i glas koji se pamte.',
    vise: 'Kompletna priča brenda — od znaka do načina na koji vam se kupci obraćaju.',
    glyph: (
      <svg viewBox="0 0 48 48" fill="none" className="h-9 w-9" aria-hidden>
        <path d="M10 32c0-9 6-16 14-16s14 7 14 16" stroke="#6FA5D8" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="24" cy="16" r="5" stroke="#2458A6" strokeWidth="2.5" />
        <path d="M12 38h24" stroke="#2458A6" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'odrzavanje', naslov: 'Održavanje i samostalno uređivanje',
    recenica: 'Posle lansiranja sajt je vaš.',
    vise: 'Tekstove i slike menjate sami, bez programera — a mi čuvamo da sve radi.',
    glyph: (
      <svg viewBox="0 0 48 48" fill="none" className="h-9 w-9" aria-hidden>
        <path d="M30 12l6 6-18 18-8 2 2-8 18-18z" stroke="#2458A6" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M26 16l6 6" stroke="#6FA5D8" strokeWidth="2.5" />
      </svg>
    ),
  },
]

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.6, delay: 0.15 * i },
})

export default function Usluge() {
  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-6 py-16 md:py-24">
      <motion.h2 {...fadeUp(0)} className="text-center font-semibold tracking-tight text-ink text-2xl md:text-[40px] md:leading-[44px]">
        Od prvog razgovora do lansiranja — sve gradimo mi.
      </motion.h2>
      {/* M4 accordion on md+; stacked cards on mobile */}
      <div className="mt-10 md:mt-14 flex flex-col md:flex-row gap-4 md:h-[320px] group">
        {SERVICES.map((s, i) => (
          <motion.article
            key={s.id}
            {...fadeUp(i + 1)}
            className="usluga-card relative overflow-hidden rounded-[1.75rem] bg-tint/70 border border-mist/60 p-6 md:p-7 flex flex-col justify-between md:basis-0"
            style={{ flexGrow: i === 0 ? 2.5 : 1, transition: 'flex-grow 0.7s cubic-bezier(0.23,1,0.32,1)' }}
            onMouseEnter={(e) => {
              const row = e.currentTarget.parentElement!
              row.querySelectorAll<HTMLElement>('.usluga-card').forEach((el) => { el.style.flexGrow = '1'; el.style.opacity = '0.85' })
              e.currentTarget.style.flexGrow = '2.5'
              e.currentTarget.style.opacity = '1'
            }}
            onMouseLeave={(e) => {
              const row = e.currentTarget.parentElement!
              row.querySelectorAll<HTMLElement>('.usluga-card').forEach((el, idx) => { el.style.flexGrow = idx === 0 ? '2.5' : '1'; el.style.opacity = '1' })
            }}
          >
            <div>
              {s.glyph}
              <h3 className="mt-4 font-semibold text-ink text-lg leading-snug">{s.naslov}</h3>
              <p className="mt-1.5 text-[15px] text-ink/70">{s.recenica}</p>
            </div>
            <p className="mt-4 text-sm text-ink/60 leading-relaxed md:opacity-0 md:[.usluga-card:hover_&]:opacity-100 transition-opacity duration-500">
              {s.vise}
            </p>
          </motion.article>
        ))}
      </div>
      <motion.p {...fadeUp(2)} className="mt-8 text-center">
        <a href="/usluge" className="text-accent font-medium text-[15px] underline-offset-4 hover:underline">Sve usluge →</a>
      </motion.p>
    </div>
  )
}
