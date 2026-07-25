// GALAXY HOME STRUCTURAL REPLICA — Section 7: Stats (white gradient overlay -top-[400px],
// useInView once -100px, y30 fade-up, 0.15 stagger, 0.6s). Numbers swapped to REAL
// contractual facts — no invented performance claims (factory law).
import { motion } from 'motion/react'

const STATS = [
  { value: '1', label: 'Potpis do početka' },
  { value: '2', label: 'Klika do razgovora' },
  { value: '3', label: 'Runde revizija' },
  { value: '0', label: 'Skrivenih troškova' },
]

export default function Stats() {
  return (
    <div className="relative px-5 sm:px-6 py-16 md:py-32">
      {/* the white ground rising to meet the descent — exact overlay */}
      <div className="absolute -top-[400px] left-0 right-0 bottom-0 bg-gradient-to-b from-transparent via-white/60 to-white pointer-events-none" />
      <div className="relative">
        <motion.h2
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.6 }}
          className="text-2xl md:text-[40px] md:leading-[44px] font-medium text-ink text-center mb-10 sm:mb-16"
        >
          Jasna pravila, od prvog dana.
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
