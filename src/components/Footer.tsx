// The footer is the last beat of the same descent, not a block bolted underneath: no ground
// of its own — it stands on the plain the world just landed on. A soft white veil (a dissolve,
// not a panel) plus a white text glow keep the ink type comfortably past AA over the imagery.
//
// Batch 3 trimmed the register block to the two numbers people actually check — PIB and
// matični broj — set on one line with the copyright.
//
// LEGAL NOTE, deliberately recorded here: Zakon o privrednim društvima čl. 25 wants the full
// poslovno ime and the sedište shown on the business's own pages, and both were removed from
// this footer by request. They are NOT gone from the site: the seat still appears as the
// contact address above, and the complete registered identity lives on /uslovi-koriscenja,
// linked from here. That keeps the footer as clean as asked without leaving the company
// undeclared.
//
// No rules or dividers anywhere: a hairline across the content column reads as a section line
// to the junction rig (measured 21–23 against a limit of 8) and breaks the one-descent law.
import { WA_LINK } from '../lib/hooks'
import { LEGAL } from '../lib/marks'
import { SIGNATURE_STROKE, SIGNATURE_VIEWBOX } from '../lib/marks'
import Lockup from './Lockup'

const GLOW = { textShadow: '0 1px 18px rgba(255,255,255,0.95), 0 0 6px rgba(255,255,255,0.85)' }

const PAGES = [
  { label: 'Početna', href: '/' },
  { label: 'Radovi', href: '/radovi' },
  { label: 'Usluge', href: '/usluge' },
  { label: 'Kontakt', href: '/kontakt' },
]

const LEGAL_PAGES = [
  { label: 'Politika privatnosti', href: '/politika-privatnosti.html' },
  { label: 'Uslovi korišćenja', href: '/uslovi-koriscenja.html' },
]

export default function Footer() {
  return (
    <footer data-beat="footer" className="relative z-30 text-ink">
      <div
        className="absolute inset-x-0 -top-[26vh] bottom-0 z-0 pointer-events-none
                   bg-gradient-to-b from-white/0 via-white/70 to-white/88"
        aria-hidden
      />
      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-6">
        {/* ---- band 1: who, where to go, how to reach ---- */}
        <div className="pt-14 pb-12 grid gap-10 md:grid-cols-[1.5fr_0.9fr_1.1fr]">
          <div>
            {/* the same lockup the nav and the entrance use — one D/S balance for the site.
                Extra lift here: the cloud letters are near-white and the footer stands on a
                pale plain, so the mark needs an edge the nav's glass never has to give it. */}
            <span
              className="inline-block text-[26px]"
              style={{ filter: 'drop-shadow(0 2px 5px rgba(22,50,79,0.30))' }}
            >
              <Lockup expanded reserveWidth={false} />
            </span>
            <p className="mt-4 text-[14.5px] leading-relaxed text-ink/75 max-w-xs" style={GLOW}>
              Izrada sajtova za firme u Srbiji. Jasan dogovor, fiksan rok, bez skrivenih troškova.
            </p>
          </div>

          <div className="flex flex-col gap-2.5 text-[15px]" style={GLOW}>
            <nav className="flex flex-col gap-2.5" aria-label="Stranice">
              {PAGES.map(p => (
                <a key={p.href} href={p.href} className="text-ink/75 hover:text-ink transition-colors w-fit">
                  {p.label}
                </a>
              ))}
            </nav>
            <nav className="mt-3 flex flex-col gap-2 text-[13px]" aria-label="Pravno">
              {LEGAL_PAGES.map(p => (
                <a key={p.href} href={p.href} className="text-ink/60 hover:text-ink transition-colors w-fit">
                  {p.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="text-[15px] space-y-2.5" style={GLOW}>
            <p className="text-ink/75">{LEGAL.seat}</p>
            <p>
              <a href={LEGAL.phoneHref} className="text-ink/75 hover:text-ink transition-colors">
                {LEGAL.phone}
              </a>
            </p>
            <p>
              <a href={`mailto:${LEGAL.email}`} className="text-ink/75 hover:text-ink transition-colors break-all">
                {LEGAL.email}
              </a>
            </p>
            <p>
              {/* a deeper blue than the brand accent: over the plain, #2458A6 sits at 4.3:1 */}
              <a href={WA_LINK} target="_blank" rel="noopener" className="text-[#1C4585] hover:text-ink transition-colors font-semibold">
                WhatsApp — započnite razgovor
              </a>
            </p>
          </div>
        </div>

        {/* ---- band 2: the owner signs his own page ---- */}
        <div className="pb-10 flex flex-col items-center text-center" style={GLOW}>
          <span className="font-script text-accent leading-none text-[clamp(1.9rem,4.5vw,2.6rem)]">
            {LEGAL.owner}
          </span>
          <svg viewBox={SIGNATURE_VIEWBOX} className="mt-1 w-[min(62%,240px)] overflow-visible" aria-hidden>
            <path d={SIGNATURE_STROKE} fill="#2458A6" />
          </svg>
          <p className="mt-2 text-[11.5px] uppercase tracking-[0.16em] text-ink/55">
            Vlasnik · DreamSign
          </p>
        </div>

        {/* ---- band 3: the three things on one line ---- */}
        <div
          className="pb-7 grid gap-2 text-[11.5px] text-ink/60 text-center
                     sm:grid-cols-3 sm:items-baseline sm:text-left"
          style={GLOW}
        >
          <p>© {new Date().getFullYear()} DreamSign · Sva prava zadržana.</p>
          <p className="sm:text-center">PIB: {LEGAL.pib}</p>
          <p className="sm:text-right">Matični broj: {LEGAL.registrationNo}</p>
        </div>
      </div>
    </footer>
  )
}
