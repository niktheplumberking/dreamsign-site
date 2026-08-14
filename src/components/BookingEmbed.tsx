// THE BOOKING CARD — Nick's cal.com event, embedded the way a third party should be.
//
// WHY IT IS CLICK-TO-LOAD AND NOT JUST PASTED IN (his note: "optimize the size when you add
// it and not break anything"):
//
//   1 · WEIGHT. cal.com's embed pulls its own script and then a whole booking application
//       inside an iframe — several hundred KB of somebody else's JavaScript. Pasted in
//       plainly it downloads for EVERY visitor of /radovi and /kontakt, including the ones
//       who never look at the card. Here nothing of cal.com is fetched until a visitor asks
//       for it: the closed state is our own markup, a few hundred bytes, already on the page.
//   2 · THE LAW. The moment that script runs, the visitor's IP and browser reach cal.com's
//       servers and cal.com may write to their device — which under the Zakon o elektronskim
//       komunikacijama needs the visitor's informed act, not our decision. A click IS that
//       act, and the line under the button says where they are about to go.
//   3 · THE SEAM. The embed brings its own layout. Loading it into a card that already has a
//       size would jump the page; the open state gets a reserved box, so nothing under it
//       moves when the calendar arrives.
//
// The initialisation below is cal.com's own snippet (the one Nick generated), kept verbatim
// in behaviour: the same queue shim, the same namespace, the same calLink and brand colour.
// Two deliberate differences: it runs on demand instead of on page load, and the theme is
// pinned to light — "auto" would paint a dark calendar inside our white card on a visitor
// whose phone is in dark mode.
import { useCallback, useEffect, useRef, useState } from 'react'
import { WA_LINK } from '../lib/hooks'

declare global {
  interface Window { Cal?: any }
}

const CAL_LINK = 'nikola-dreamsign/30min'
const CAL_NS = '30min'
const CAL_ORIGIN = 'https://app.cal.com'
const EMBED_JS = 'https://app.cal.com/embed/embed.js'

/** cal.com's loader, verbatim in effect: a queue on window.Cal that the real script drains
    once it lands, so calls made before it loads are not lost. */
function bootCal() {
  const C = window as any
  const d = document
  const p = (a: any, ar: any) => { a.q.push(ar) }
  C.Cal = C.Cal || function (...ar: any[]) {
    const cal = C.Cal
    if (!cal.loaded) {
      cal.ns = {}
      cal.q = cal.q || []
      d.head.appendChild(d.createElement('script')).src = EMBED_JS
      cal.loaded = true
    }
    if (ar[0] === 'init') {
      const api = function (...a: any[]) { p(api, a) }
      const namespace = ar[1]
      ;(api as any).q = (api as any).q || []
      if (typeof namespace === 'string') {
        cal.ns[namespace] = cal.ns[namespace] || api
        p(cal.ns[namespace], ar)
        p(cal, ['initNamespace', namespace])
      } else p(cal, ar)
      return
    }
    p(cal, ar)
  }
}

export default function BookingEmbed() {
  const [open, setOpen] = useState(false)
  const started = useRef(false)

  const load = useCallback(() => setOpen(true), [])

  useEffect(() => {
    if (!open || started.current) return
    started.current = true
    bootCal()
    const Cal = window.Cal!
    Cal('init', CAL_NS, { origin: CAL_ORIGIN })
    Cal.config = Cal.config || {}
    Cal.config.forwardQueryParams = true
    Cal.ns[CAL_NS]('inline', {
      elementOrSelector: '#cal-inline-30min',
      config: { layout: 'month_view', useSlotsViewOnSmallScreen: 'true', theme: 'light' },
      calLink: CAL_LINK,
    })
    Cal.ns[CAL_NS]('ui', {
      cssVarsPerTheme: { light: { 'cal-brand': '#2F6FB5' }, dark: { 'cal-brand': '#CFE2F3' } },
      hideEventTypeDetails: false,
      layout: 'month_view',
    })
  }, [open])

  return (
    // the id stays exactly where it was: /kontakt's „Zakažite termin" scrolls to it
    <div id="booking-embed-slot" className="rounded-2xl border border-mist/70 bg-bg p-4">
      {open ? (
        <>
          {/* a reserved box — the calendar arrives INTO a seat, so nothing below it jumps */}
          <div
            id="cal-inline-30min"
            className="min-h-[560px] w-full overflow-auto rounded-xl bg-white sm:min-h-[620px]"
          />
          <p className="mt-3 text-[11.5px] leading-relaxed text-ink/50">
            Kalendar pruža <a href="https://cal.com" target="_blank" rel="noopener" className="font-semibold text-accent hover:text-ink">cal.com</a>.
            Podaci koje unesete obrađuju se kako je opisano u{' '}
            <a href="/politika-privatnosti.html" className="font-semibold text-accent hover:text-ink">Politici privatnosti</a>.
          </p>
        </>
      ) : (
        <>
          {/* the closed state — our own pixels, no third party contacted yet */}
          <div className="flex items-center justify-between text-[12px] font-semibold uppercase tracking-[0.14em] text-ink/60">
            <span>Slobodni termini</span>
            <span aria-hidden>30 min</span>
          </div>
          <p className="mt-3 text-[13px] leading-relaxed text-ink/65">
            Izaberite dan i vreme koje vam odgovara — razgovor traje 30 minuta i ničim vas ne obavezuje.
          </p>
          <button
            type="button"
            onClick={load}
            className="mt-4 w-full rounded-full bg-accent px-5 py-3 text-[15px] font-semibold text-white transition
                       hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Prikaži slobodne termine
          </button>
          <p className="mt-3 text-[11.5px] leading-relaxed text-ink/50">
            Kalendar učitava <strong className="font-semibold">cal.com</strong> — tek kada kliknete. Do tada nijedan
            podatak ne napušta ovaj sajt.{' '}
            <a href="/politika-privatnosti.html" className="font-semibold text-accent hover:text-ink">Politika privatnosti</a>
          </p>
          <p className="mt-3 text-[12px] leading-relaxed text-ink/55">
            Više volite poruku?{' '}
            <a href={WA_LINK} target="_blank" rel="noopener" className="font-semibold text-accent hover:text-ink inline-block py-2">
              dva klika i razgovaramo ↗
            </a>
          </p>
        </>
      )}
    </div>
  )
}
