// The footer is the last beat of the same descent, not a block bolted underneath: no ground
// of its own — it stands on the plain the world just landed on. A soft white veil (a dissolve,
// not a panel) plus a white text glow keep the ink type comfortably past AA over the imagery.
//
// Four bands, in descending weight: who we are · where to go and how to reach us ·
// the register entry the law asks for · the owner's own signature. The legal band is set
// small and quiet on purpose — it is there to be found and checked, not read.
import { WA_LINK } from '../lib/hooks'
import { LEGAL, SIGNATURE_STROKE, SIGNATURE_VIEWBOX } from '../lib/marks'

const GLOW = { textShadow: '0 1px 18px rgba(255,255,255,0.95), 0 0 6px rgba(255,255,255,0.85)' }

const PAGES = [
  { label: 'Početna', href: '/' },
  { label: 'Radovi', href: '/radovi' },
  { label: 'Usluge', href: '/usluge' },
  { label: 'Kontakt', href: '/kontakt' },
]

/**
 * The bands are separated by air and type weight, NOT by rules.
 *
 * This footer first shipped with `border-t` dividers and the junction rig failed it —
 * fullWidthStep 21-23 at the finale/footer seam, against a limit of 8. Fading the ends of
 * the rule was not enough either: a hairline across the content column still puts ~51% of
 * the page's pixel columns on the same hard edge, which is the exact signature of a section
 * line. Kill-test (tools/find-line.mjs) confirmed the rule, with the footer's white veil
 * adding to it. On a page whose whole premise is one descent where nothing ends in a
 * straight line, the rules were the thing that was wrong — not the measurement.
 *
 * A short centred mark is safe: it touches a few percent of the columns, so it separates
 * without ever drawing a line across the page.
 */
function CentreMark() {
  return (
    <div
      className="mx-auto h-px w-16"
      aria-hidden
      style={{ background: 'linear-gradient(to right, transparent, rgba(22,50,79,0.22), transparent)' }}
    />
  )
}

/** one row of the register entry */
function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-2 leading-relaxed">
      <dt className="shrink-0 text-ink/55">{label}</dt>
      <dd className="text-ink/80 font-medium">{children}</dd>
    </div>
  )
}

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
        <div className="pt-14 pb-10 grid gap-10 md:grid-cols-[1.4fr_0.8fr_1.1fr]">
          <div>
            <span className="flex items-baseline leading-none" style={GLOW}>
              <span className="font-semibold text-ink text-[22px] tracking-tight">Dream</span>
              <span className="font-script text-accent text-[30px] ml-1">Sign</span>
            </span>
            <p className="mt-3 text-[14.5px] leading-relaxed text-ink/75 max-w-xs" style={GLOW}>
              Mi pretvaramo vaše poslovne snove u realnost, a na vama je da potpisujete ugovore.
            </p>
          </div>

          <nav className="flex flex-col gap-2.5 text-[15px]" aria-label="Stranice" style={GLOW}>
            {PAGES.map(p => (
              <a key={p.href} href={p.href} className="text-ink/75 hover:text-ink transition-colors w-fit">
                {p.label}
              </a>
            ))}
          </nav>

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

        {/* ---- band 2: the register entry, as the law asks ---- */}
        <div className="pt-6 pb-10" style={GLOW}>
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/45">
            Podaci o privrednom subjektu
          </h2>
          <dl className="mt-4 grid gap-x-10 gap-y-2 text-[12.5px] sm:grid-cols-2">
            <Fact label="Poslovno ime:">{LEGAL.name}</Fact>
            <Fact label="Sedište:">{LEGAL.seat}</Fact>
            <Fact label="Matični broj:">{LEGAL.registrationNo}</Fact>
            <Fact label="PIB:">{LEGAL.pib}</Fact>
            <Fact label="Pretežna delatnost:">{LEGAL.activity}</Fact>
            <Fact label="Registar:">
              {LEGAL.registeredAt}, {LEGAL.registeredOn}
            </Fact>
          </dl>
        </div>

        {/* ---- band 3: the owner signs his own page ---- */}
        <CentreMark />
        <div className="pt-10 pb-9 flex flex-col items-center text-center" style={GLOW}>
          <span className="font-script text-accent leading-none text-[clamp(1.9rem,4.5vw,2.6rem)]">
            {LEGAL.owner}
          </span>
          <svg
            viewBox={SIGNATURE_VIEWBOX}
            className="mt-1 w-[min(62%,240px)] overflow-visible"
            aria-hidden
          >
            <path d={SIGNATURE_STROKE} fill="#2458A6" />
          </svg>
          <p className="mt-2 text-[11.5px] uppercase tracking-[0.16em] text-ink/55">
            Vlasnik · DreamSign
          </p>
        </div>

        {/* ---- band 4: the line at the bottom of everything ---- */}
        <div>
          <p className="py-5 text-[11.5px] text-ink/55" style={GLOW}>
            © {new Date().getFullYear()} {LEGAL.shortName} · Sva prava zadržana.
          </p>
        </div>
      </div>
    </footer>
  )
}
