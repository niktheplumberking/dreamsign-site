// Beat 2 (batch 5, Nick's order) — „Radovi + poverenje": past work and the trust facts,
// one section, on the descent's own sky. REAL CONTENT LAW governs everything here:
//
//   · Bennett & Co is a real delivered project — Nick's US LLC, built by this factory,
//     shown through its OWN brand (ink #22352A, paper lockup, self-hosted copy of its
//     mark). No fake browser screenshot, no invented metrics.
//   · The second card is this site itself — the visitor is standing inside the proof.
//   · The third is the honest empty-state from the original Radovi seed: the next slot
//     is genuinely open, and saying so is the offer.
//   · The trust row states CONTRACT FACTS and the APR registration — never awards,
//     never invented client counts.
//
// M08 rise on the cards, M1 on the heading; hover is a lift, not a zoom.
import { motion } from 'motion/react'
import { WA_LINK } from '../../lib/hooks'

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.6, delay: 0.12 * i },
})

const TRUST = [
  { k: 'APR', t: 'Registrovana delatnost', d: 'matični broj 68643627' },
  { k: '§', t: 'Ugovor za svaki projekat', d: 'obim, rok i cena — pismeno' },
  { k: '©', t: 'Sajt je vaše vlasništvo', d: 'kod i sadržaj prelaze na vas' },
  { k: '1:1', t: 'Direktno sa vlasnikom', d: 'bez posrednika, od prvog dana' },
]

export default function Radovi() {
  return (
    <div className="relative mx-auto max-w-6xl px-5 sm:px-6 py-16 md:py-28">
      <motion.h2
        {...fadeUp(0)}
        className="text-center font-semibold tracking-tight text-ink text-2xl md:text-[40px] md:leading-[44px]"
      >
        Radovi koji{' '}
        <span className="font-script font-normal text-accent text-[1.5em] leading-none">govore.</span>
      </motion.h2>

      {/* the junction rig failed the first cut of this grid (fullWidthStep 10 desk / 212
          mobile): three aligned card tops read as one full-width line, and the Bennett ink
          slab against the sky was a razor edge across a stacked phone card. The fixes are
          in the page's grammar, not against it — the desktop cards stagger (editorial
          asymmetry, no shared edge), and every media panel opens on a tone near the sky
          so its top edge is a blend, not a step. */}
      <div className="mt-12 md:mt-16 grid gap-6 md:grid-cols-3 md:items-start">
        {/* Bennett & Co — the real one, in its own skin: paper light over its ink */}
        <motion.a
          {...fadeUp(1)}
          href={WA_LINK} target="_blank" rel="noopener"
          className="group block overflow-hidden rounded-[1.75rem] transition-transform duration-300 hover:-translate-y-1.5"
          style={{ WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 9%, black 84%, transparent 100%)', maskImage: 'linear-gradient(to bottom, transparent 0%, black 9%, black 84%, transparent 100%)' }}
        >
          {/* Bennett's ink plate is framed by its own paper at BOTH edges — the mobile rig
              measured 212 where flat ink met the white info band across a stacked card.
              A framed plate has no razor edge anywhere, and it is their stationery look. */}
          <div
            className="flex h-56 items-center justify-center px-10"
            // opens on paper (melted into the sky above), closes on WHITE — cream against
            // the white info band jumped 29 in the blue channel and the rig caught it
            style={{ background: 'linear-gradient(180deg, #EAEDDF 0%, #869585 21%, #22352A 42%, #22352A 58%, #8C9DA6 79%, #F7FAFC 100%)' }}
          >
            <img
              src="/media/radovi/bennett-lockup.svg" alt="Bennett & Co — logotip"
              className="max-h-16 w-auto transition-transform duration-500 group-hover:scale-[1.04]"
            />
          </div>
          <div className="bg-white/80 px-6 py-5 backdrop-blur-[6px]">
            <p className="font-semibold text-ink text-[16px]">Bennett & Co</p>
            <p className="mt-1 text-[13.5px] leading-relaxed text-ink/65">
              Kompletan brend i korporativni sajt za američku firmu — od identiteta do lansiranja.
            </p>
          </div>
        </motion.a>

        {/* DreamSign — the site the visitor is inside right now */}
        <motion.div
          {...fadeUp(2)}
          className="group block overflow-hidden rounded-[1.75rem] transition-transform duration-300 hover:-translate-y-1.5 md:mt-8"
          style={{ WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 9%, black 84%, transparent 100%)', maskImage: 'linear-gradient(to bottom, transparent 0%, black 9%, black 84%, transparent 100%)' }}
        >
          <div
            className="flex h-44 items-center justify-center px-10"
            style={{ background: 'linear-gradient(180deg, #BCD8F2 0%, #E7F1FB 100%)' }}
          >
            <img
              src="/media/brand/cloud-dream.webp" alt="DreamSign — oblak-logotip"
              className="max-h-14 w-auto transition-transform duration-500 group-hover:scale-[1.04]"
            />
          </div>
          <div className="bg-white/80 px-6 py-5 backdrop-blur-[6px]">
            <p className="font-semibold text-ink text-[16px]">DreamSign</p>
            <p className="mt-1 text-[13.5px] leading-relaxed text-ink/65">
              Sajt na kome se upravo nalazite — svaka animacija je naša preporuka u praksi.
            </p>
          </div>
        </motion.div>

        {/* the honest open slot */}
        <motion.a
          {...fadeUp(3)}
          href={WA_LINK} target="_blank" rel="noopener"
          className="group flex flex-col overflow-hidden rounded-[1.75rem] bg-tint/50 transition-transform duration-300 hover:-translate-y-1.5 md:mt-16"
          style={{ WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 9%, black 84%, transparent 100%)', maskImage: 'linear-gradient(to bottom, transparent 0%, black 9%, black 84%, transparent 100%)' }}
        >
          <div className="flex h-44 items-center justify-center">
            <img src="/media/brand/cloud-d.webp" alt="" aria-hidden className="h-16 w-auto opacity-75 transition-transform duration-500 group-hover:scale-[1.06]" />
          </div>
          <div className="px-6 py-5">
            <p className="font-semibold text-ink text-[16px]">Vaš projekat</p>
            <p className="mt-1 text-[13.5px] leading-relaxed text-ink/65">
              Sledeće mesto je otvoreno — javite se i budite rad kojim se hvalimo.
            </p>
          </div>
        </motion.a>
      </div>

      {/* the trust facts — glass pills, cloud-soft, all of them true */}
      <div className="mt-10 md:mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4 items-start">
        {TRUST.map((b, i) => (
          <motion.div
            key={b.t}
            {...fadeUp(4 + i)}
            // four DISTINCT seats: the first stagger only offset the tops, and the pills'
            // varying text heights realigned their BOTTOMS into one edge (measured 34)
            className={`liquid-glass rounded-[1.5rem] px-5 py-5 text-center ${['', 'mt-6', 'mt-11', 'mt-3'][i]}`}
          >
            <span className="font-script text-accent text-[26px] leading-none" aria-hidden>{b.k}</span>
            <p className="mt-2 font-semibold text-ink text-[14px] leading-snug">{b.t}</p>
            <p className="mt-1 text-[12.5px] text-ink/60">{b.d}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
