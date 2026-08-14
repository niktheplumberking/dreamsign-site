// THE LEGAL PAGES' SHELL (batch 59, owner: "make sure that the legal pages are actual pages
// of the website, with navbar and footer, not like a static HTML page").
//
// They used to be two hand-written .html files in `public/` with their own stylesheet — real
// documents, correctly served, and visibly not part of the site: no nav, no footer, no world,
// their own typography, and a lonely „← Nazad na početnu" as the only way back. A visitor who
// clicked „Politika privatnosti" left DreamSign and arrived at a printout of it.
//
// Now they are routes like every other page: the nav floats over them, the footer closes them,
// the cloud gust plays on the way in and out, and they open on the same sky the site lives in.
// What does NOT change is that they stay documents — one column, generous measure, no motion
// competing with the reading. A legal page that performs is a legal page nobody finishes.
import type { ReactNode } from 'react'
import Footer from './Footer'

export function LegalLayout({
  title, updated, intro, children,
}: { title: string; updated: string; intro: ReactNode; children: ReactNode }) {
  return (
    <main className="relative">
      {/* the sky band — the same still and the same bank the hero uses, so the page opens
          inside the world rather than on a white sheet. The bank's baked alpha ramp does the
          melt into the reading column: no hard edge, no line for the junction rig to find. */}
      <div className="relative h-[46vh] min-h-[300px] w-full overflow-hidden">
        <img src="/media/hero-sky-still.webp" alt="" className="absolute inset-0 h-full w-full object-cover" />
        {/* the bank's alpha ramp is baked for a FULL-HEIGHT hero; squeezed into a 46vh band it
            compresses into a visible edge — measured 13 on the junction metric at 1440, where
            8 is the fail line. The mask re-lengthens the ramp in CSS so the top of the bank
            dissolves instead of starting. */}
        <img
          src="/media/hero-bank-fade.webp" alt="" aria-hidden
          className="pointer-events-none absolute inset-x-0 -bottom-[2%] h-[62%] w-full select-none object-cover object-bottom"
          style={{
            maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.35) 26%, #000 62%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.35) 26%, #000 62%)',
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-b from-transparent to-bg" aria-hidden />

        <div className="relative z-10 mx-auto flex h-full max-w-3xl flex-col justify-end px-5 pb-10 sm:px-6">
          <h1
            className="ink-gradient font-semibold tracking-tight leading-[1.05] text-[clamp(2.1rem,6vw,3.6rem)]"
          >
            {title}
          </h1>
          <p className="mt-3 text-[13px] font-medium uppercase tracking-[0.14em] text-ink/55">
            Poslednja izmena: {updated}
          </p>
        </div>
      </div>

      {/* the document */}
      <div className="mx-auto max-w-3xl px-5 pb-24 sm:px-6">
        <div className="text-[16.5px] leading-[1.75] text-ink/85 [&_a]:font-semibold [&_a]:text-accent [&_a:hover]:text-ink [&_strong]:text-ink">
          {intro}
          {children}
        </div>
      </div>

      <Footer />
    </main>
  )
}

/** a numbered section — the heading level the outline audit expects, nothing decorative */
export function Clause({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <section className="mt-11 first:mt-8">
      <h2 className="mb-3 text-[clamp(1.15rem,2.4vw,1.45rem)] font-bold tracking-tight text-ink">
        {n}. {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

export function SubClause({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <div className="mt-7">
      <h3 className="mb-2 text-[16.5px] font-bold text-ink">{n}. {title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

/** the identity card — the same facts the law wants declared, set as a card, not a table dump */
export function Facts({ rows }: { rows: [string, ReactNode][] }) {
  return (
    // THE PLATE IS sm+ ONLY. On a phone this card is nearly the full column width, so its
    // top edge is a full-width tonal step — measured 32 with a hairline border, still 12 as
    // a soft plate, against a fail line of 8. The site's own footer law says it plainly: a
    // rule across the content column reads as a section line. Below sm the facts are simply
    // a list, which is also the better read on a phone: a card that touches both screen
    // edges is not a card, it is a background.
    <dl className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-[auto_1fr] sm:rounded-3xl sm:bg-white/80 sm:p-7 sm:shadow-[0_10px_35px_rgba(22,50,79,0.06)]">
      {rows.map(([k, v]) => (
        <div key={k} className="contents">
          <dt className="text-[13px] font-semibold uppercase tracking-[0.1em] text-ink/50 sm:pt-0.5">{k}</dt>
          <dd className="mb-3 text-[15.5px] font-medium text-ink sm:mb-0">{v}</dd>
        </div>
      ))}
    </dl>
  )
}

export function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-2.5 pl-5">
      {items.map((it, i) => (
        <li key={i} className="list-disc marker:text-accent/60">{it}</li>
      ))}
    </ul>
  )
}
