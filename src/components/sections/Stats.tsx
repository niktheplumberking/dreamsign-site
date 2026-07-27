// GALAXY HOME STRUCTURAL REPLICA — Section 7: Stats (white gradient overlay -top-[400px],
// useInView once -100px, y30 fade-up, 0.15 stagger, 0.6s). Numbers swapped to REAL
// contractual facts — no invented performance claims (factory law).
import { motion } from 'motion/react'

// Order is 2 · 1 · 3 · 0 (batch 3). It breaks the counting-up run, which is what made the row
// look like a list rather than a claim — and it happens to be the customer's actual sequence:
// two clicks to reach us, one signature to start, three revision rounds, no hidden costs ever.
// The numbers are contractual facts. Never invent a fifth.
const STATS = [
  { value: '2', label: 'Klika do razgovora' },
  { value: '1', label: 'Potpis do početka' },
  { value: '3', label: 'Runde revizija' },
  { value: '0', label: 'Skrivenih troškova' },
]

export default function Stats() {
  return (
    <div className="relative px-5 sm:px-6 py-16 md:py-32">
      {/* the white ground that rises to meet the descent now lives in the world (App.tsx),
          spanning from here to the ink band — a fade that ends mid-page is a section line. */}
      <div className="relative">
        <motion.h2
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.6 }}
          className="text-2xl md:text-[40px] md:leading-[44px] font-medium text-ink text-center mb-10 sm:mb-16"
        >
          Jasna pravila,{' '}
          {/* the hand comes in on the promise — same quill as the signature */}
          <span className="font-script font-normal text-accent text-[1.5em] leading-none">
            od prvog dana.
          </span>
        </motion.h2>
        <div className="mx-auto max-w-5xl grid grid-cols-2 gap-8 md:flex md:items-center md:justify-center">
          {STATS.map((s, i) => (
            <span key={s.label} className="contents">
              <motion.div
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: 0.15 * i }}
                className="text-center"
              >
                <div className="text-4xl sm:text-5xl md:text-[64px] md:leading-[76px] font-semibold text-ink tabular-nums">{s.value}</div>
                <div className="text-sm sm:text-base md:text-xl font-medium text-ink/70 text-center">{s.label}</div>
              </motion.div>
              {i < STATS.length - 1 && <div className="hidden md:block h-[80px] w-px bg-ink/20 mx-8 lg:mx-12" />}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
