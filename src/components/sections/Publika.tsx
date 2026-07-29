// Beat 3 (batch 5) — „Za koga gradimo": who we serve, said plainly. Editorial rows, not
// a card grid (anti-slop tripwire: the generic three-card feature grid). Each row is a
// script ordinal + who + one concrete line; rows rise in sequence (M1) and there is no
// rule anywhere — the air separates them, as everywhere else on this page.
import { motion } from 'motion/react'

const ROWS = [
  {
    n: 'i',
    who: 'Mali i porodični biznisi',
    what: 'Prvi ozbiljan sajt — da vas kupci nađu i odmah shvate šta nudite.',
  },
  {
    n: 'ii',
    who: 'Lokalne uslužne firme',
    what: 'Zakazivanja i pozivi umesto praznog inboxa — sajt koji dovodi posao.',
  },
  {
    n: 'iii',
    who: 'Zanatlije i majstori',
    what: 'Vaš rad, prikazan kako zaslužuje — galerija koja prodaje pre prvog razgovora.',
  },
  {
    n: 'iv',
    who: 'Brendovi u nastajanju',
    what: 'Identitet, sajt i priča iz jednog komada — spremni za rast širom Balkana.',
  },
]

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-90px' },
  transition: { duration: 0.6, delay: 0.1 * i },
})

export default function Publika() {
  return (
    <div className="relative mx-auto max-w-4xl px-5 sm:px-6 py-16 md:py-28">
      <motion.h2
        {...fadeUp(0)}
        className="text-center font-semibold tracking-tight text-ink text-2xl md:text-[40px] md:leading-[44px]"
      >
        Za koga{' '}
        <span className="font-script font-normal text-accent text-[1.5em] leading-none">gradimo</span>
      </motion.h2>

      <div className="mt-10 md:mt-14 space-y-7 md:space-y-9">
        {ROWS.map((r, i) => (
          <motion.div
            key={r.who}
            {...fadeUp(1 + i)}
            className="grid grid-cols-[3.2rem_1fr] items-baseline gap-x-4 md:grid-cols-[4rem_1fr] md:gap-x-6"
          >
            <span
              aria-hidden
              className="text-right font-script font-normal text-accent/80 leading-none text-[clamp(1.8rem,3.4vw,2.6rem)]"
            >
              {r.n}
            </span>
            <div>
              <h3 className="font-semibold text-ink text-lg md:text-[22px] tracking-tight">{r.who}</h3>
              <p className="mt-1 text-[14.5px] md:text-[15.5px] leading-relaxed text-ink/70 max-w-xl">
                {r.what}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
