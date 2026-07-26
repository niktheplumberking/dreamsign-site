// The footer is the last beat of the same descent, not a block bolted underneath: no ground
// of its own — it stands on the plain the world just landed on. A soft white veil (a dissolve,
// not a panel) plus a white text glow keep the ink type comfortably past AA over the imagery.
import { WA_LINK } from '../lib/hooks'

const GLOW = { textShadow: '0 1px 18px rgba(255,255,255,0.95), 0 0 6px rgba(255,255,255,0.85)' }

export default function Footer() {
  return (
    <footer data-beat="footer" className="relative z-30 text-ink">
      <div
        className="absolute inset-x-0 -top-[26vh] bottom-0 z-0 pointer-events-none
                   bg-gradient-to-b from-white/0 via-white/70 to-white/88"
        aria-hidden
      />
      <div className="relative z-10">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 py-14 grid gap-10 md:grid-cols-3">
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
            <a href="/" className="text-ink/75 hover:text-ink transition-colors">Početna</a>
            <a href="/radovi" className="text-ink/75 hover:text-ink transition-colors">Radovi</a>
            <a href="/usluge" className="text-ink/75 hover:text-ink transition-colors">Usluge</a>
            <a href="/kontakt" className="text-ink/75 hover:text-ink transition-colors">Kontakt</a>
          </nav>
          <div className="text-[15px] space-y-2.5" style={GLOW}>
            <p className="text-ink/75">Ruma 22400, Srbija</p>
            <p><a href="tel:+381637736963" className="text-ink/75 hover:text-ink transition-colors">+381 63 773 6963</a></p>
            <p>
              {/* a deeper blue than the brand accent: over the plain, #2458A6 sits at 4.3:1 */}
              <a href={WA_LINK} target="_blank" rel="noopener" className="text-[#1C4585] hover:text-ink transition-colors font-semibold">
                WhatsApp — započnite razgovor
              </a>
            </p>
          </div>
        </div>
        <div className="border-t border-ink/10">
          <p className="mx-auto max-w-6xl px-5 sm:px-6 py-5 text-[11.5px] text-ink/55" style={GLOW}>
            © {new Date().getFullYear()} DreamSign · Ruma, Srbija
          </p>
        </div>
      </div>
    </footer>
  )
}
