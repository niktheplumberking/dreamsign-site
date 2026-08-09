// FAQ — extracted VERBATIM from RadoviPage (batch 44) so /kontakt can carry the same
// section; /radovi renders it unchanged. The copy is the approved set: real house rules,
// no prices (factory law — „nemamo cenovnik" stays the honest answer).
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { WA_LINK } from '../lib/hooks'

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, delay: 0.12 * i },
})

const FAQ = [
  {
    q: 'Šta tačno radite?',
    a: 'Pravimo sajtove po meri — dizajn i izradu od nule, redizajn postojećih sajtova, SEO i Google pozicioniranje, oglašavanje i održavanje. Jedan tim, jedan potpis, od prvog razgovora do lansiranja.',
  },
  {
    q: 'Koliko košta sajt?',
    a: 'Nemamo cenovnik — svaki projekat je jedinstven. Posle prvog razgovora dobijate konkretnu ponudu: obim, rok i cenu, pismeno. Razgovor vas ništa ne košta i ni na šta ne obavezuje.',
  },
  {
    q: 'Koliko traje izrada?',
    a: 'Zavisi od obima — zato rok ne pogađamo nego ga ugovaramo. Pre početka potpisujemo ugovor sa jasnim, fiksnim rokom, i njega se držimo.',
  },
  {
    q: 'Da li potpisujemo ugovor?',
    a: 'Uvek. Obim posla, rok i cena stoje na papiru pre nego što počnemo. Bez skrivenih troškova, bez iznenađenja — to je pravilo kuće.',
  },
  {
    q: 'Čiji je sajt kada se završi?',
    a: 'Vaš. Kod i sadržaj prelaze u vaše vlasništvo, a tekstove i slike posle lansiranja menjate sami — bez programera i bez čekanja.',
  },
  {
    q: 'Šta ako nešto zatreba posle lansiranja?',
    a: 'Tu smo — održavanje, podrška i dalje unapređenje sajta. Radite direktno sa vlasnikom, a kada projekat to traži, dolazimo i lično.',
  },
]

export default function FaqSekcija() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="mx-auto grid w-full max-w-[1500px] grid-cols-1 items-start gap-12 px-6 sm:px-10 lg:grid-cols-12 lg:gap-16 lg:px-14">
      {/* LEFT: the big duet heading + the booking card (batch 14: eyebrow deleted, title
          grown, „pitanja" answers in the quill — the site's own primary/script duet) */}
      <div className="flex h-full flex-col justify-between lg:col-span-5">
        {/* batch 15/19/21/22: one row, the duet on a single baseline. „Same size" is
            OPTICAL, not font-size: Great Vibes reads far smaller than its metrics (small
            x-height, ink in the flourishes) — the ink-parity factor (1.163) still read
            small to the owner's eye, so the quill now wears 1.35 (his call: increase
            until it LOOKS equal). flex-nowrap: the pair may never split rows. */}
        <h2 className="mb-8 flex flex-nowrap items-baseline gap-x-4 leading-[0.95] tracking-tight">
          <span className="ink-gradient whitespace-nowrap text-[clamp(3rem,6.2vw,5.6rem)] font-bold">Česta</span>
          <span className="whitespace-nowrap font-script font-normal text-accent text-[clamp(4.5rem,9.3vw,8.4rem)]">
            pitanja
          </span>
        </h2>

        <motion.div
          {...fadeUp(1)}
          className="relative mt-4 overflow-hidden rounded-3xl border border-white/80 bg-white/85 p-6 shadow-[0_10px_35px_rgba(22,50,79,0.06)] sm:p-8 lg:mt-12"
        >
          <img src="/media/brand/cloud-d.webp" alt="" aria-hidden className="mb-5 w-16 sm:w-20 drop-shadow-md" />
          <h3 className="mb-2 text-xl font-bold text-ink sm:text-2xl">Zakažite razgovor</h3>
          <p className="mb-5 text-sm leading-relaxed text-ink/70 sm:text-base">
            Izaberite termin koji vam odgovara — 15 minuta, bez obaveza.
          </p>
          {/* BOOKING EMBED SLOT (batch 14): Nick's Calendly / cal.com lands here the moment
              he sends the link — until then a self-hosted placeholder holds the seat
              (no third-party script ships before the real account exists). */}
          <div id="booking-embed-slot" className="rounded-2xl border border-mist/70 bg-bg p-4">
            <div className="mb-3 flex items-center justify-between text-[12px] font-semibold uppercase tracking-[0.14em] text-ink/60">
              <span>Avgust 2026</span>
              <span aria-hidden>‹ ›</span>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-[12px] font-medium text-ink/70">
              {['P', 'U', 'S', 'Č', 'P', 'S', 'N'].map((d, i) => (
                <span key={i} className="py-1 text-[10px] font-semibold uppercase text-ink/40">{d}</span>
              ))}
              {Array.from({ length: 14 }, (_, i) => (
                <span
                  key={i}
                  className={`rounded-full py-1 ${i === 9 ? 'bg-accent font-semibold text-white' : 'text-ink/60'}`}
                >
                  {i + 3}
                </span>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {['10:00', '12:30', '15:00'].map((t) => (
                <span key={t} className="rounded-full border border-mist/80 bg-white px-3.5 py-1.5 text-[12px] font-semibold text-ink/45">
                  {t}
                </span>
              ))}
            </div>
            <p className="mt-4 text-[12px] leading-relaxed text-ink/55">
              Onlajn zakazivanje stiže uskoro — do tada,{' '}
              <a href={WA_LINK} target="_blank" rel="noopener" className="font-semibold text-accent hover:text-ink inline-block py-2.5">
                dva klika i razgovaramo ↗
              </a>
            </p>
          </div>
        </motion.div>
      </div>

      {/* RIGHT: the accordion — every card wears a CLOUD EDGE (batch 14: uneven, organic
          border radii, alternating per card; sizes untouched) and grows 20% under the
          cursor (his emphasis effect — origin centre, raised above its neighbours) */}
      <div className="flex flex-col gap-4 lg:col-span-7">
        {FAQ.map((f, i) => {
          const isOpen = open === i
          const cloudEdge = i % 2 === 0
            ? '2.5rem 3.6rem 2.75rem 3.9rem / 3.6rem 2.5rem 3.9rem 2.75rem'
            : '3.9rem 2.5rem 3.6rem 2.75rem / 2.75rem 3.9rem 2.5rem 3.6rem'
          return (
            <div
              key={f.q}
              style={{ borderRadius: cloudEdge }}
              className={`relative overflow-hidden transition-all duration-300 will-change-transform
                          hover:z-20 hover:scale-[1.03] hover:shadow-[0_14px_40px_rgba(22,50,79,0.10)] ${
                isOpen ? 'bg-white shadow-[0_8px_30px_rgba(22,50,79,0.06)]' : 'bg-white/70 hover:bg-white/95'
              }`}
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full cursor-pointer items-center justify-between gap-4 p-5 text-left sm:p-6"
                aria-expanded={isOpen}
              >
                <span className="text-base font-semibold text-ink sm:text-lg lg:text-xl">{f.q}</span>
                <span
                  aria-hidden
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-lg font-medium transition-transform duration-200 ${
                    isOpen ? 'rotate-45 bg-tint text-ink' : 'text-ink/55'
                  }`}
                >
                  +
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="a"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-6 text-sm leading-relaxed text-ink/70 sm:px-6 sm:text-base">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}
