// The footer — the site ends standing on solid ground (ink band, clean, roomy).
import { WA_LINK } from '../lib/hooks'

export default function Footer() {
  return (
    <footer data-beat="footer" className="relative z-30 bg-ink text-bg">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 py-14 grid gap-10 md:grid-cols-3">
        <div>
          <span className="flex items-baseline leading-none">
            <span className="font-semibold text-bg text-[22px] tracking-tight">Dream</span>
            <span className="font-script text-[#BFD9F5] text-[30px] ml-1">Sign</span>
          </span>
          <p className="mt-3 text-[14.5px] leading-relaxed text-bg/60 max-w-xs">
            Mi pretvaramo vaše poslovne snove u realnost, a na vama je da potpisujete ugovore.
          </p>
        </div>
        <nav className="flex flex-col gap-2.5 text-[15px]" aria-label="Stranice">
          <a href="/" className="text-bg/70 hover:text-bg transition-colors">Početna</a>
          <a href="/radovi" className="text-bg/70 hover:text-bg transition-colors">Radovi</a>
          <a href="/usluge" className="text-bg/70 hover:text-bg transition-colors">Usluge</a>
          <a href="/kontakt" className="text-bg/70 hover:text-bg transition-colors">Kontakt</a>
        </nav>
        <div className="text-[15px] space-y-2.5">
          <p className="text-bg/70">Ruma 22400, Srbija</p>
          <p><a href="tel:+381637736963" className="text-bg/70 hover:text-bg transition-colors">+381 63 773 6963</a></p>
          <p>
            <a href={WA_LINK} target="_blank" rel="noopener" className="text-[#BFD9F5] hover:text-bg transition-colors font-medium">
              WhatsApp — započnite razgovor
            </a>
          </p>
        </div>
      </div>
      <div className="border-t border-bg/10">
        <p className="mx-auto max-w-6xl px-5 sm:px-6 py-5 text-[11.5px] text-bg/40">
          © {new Date().getFullYear()} DreamSign · Ruma, Srbija
        </p>
      </div>
    </footer>
  )
}
