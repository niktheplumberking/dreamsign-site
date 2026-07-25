// Scene 5 — Lično prisustvo. No portrait (owner's law). The stroke draws the „vi → mi" route
// across a brand-drawn sky-map — scroll-driven (Galaxy scroll grammar), glass-framed.
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.6, delay: 0.15 * i },
})

export default function Prisustvo() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.35'] })
  const route = useTransform(scrollYProgress, [0.1, 0.9], [0, 1])

  return (
    <div ref={ref} className="mx-auto max-w-6xl px-5 sm:px-6 py-16 md:py-28 grid md:grid-cols-[55fr_45fr] gap-10 md:gap-14 items-center">
      <div>
        <motion.h2 {...fadeUp(0)} className="font-semibold tracking-tight text-ink text-2xl md:text-[40px] md:leading-[46px] [text-wrap:balance]">
          Kad zatreba, sedimo za vašim stolom — u vašoj firmi, <span className="relative inline-block">uživo.
            <svg viewBox="0 0 120 14" className="absolute -bottom-2 left-0 w-full" fill="none" aria-hidden>
              <motion.path d="M4 10 C 40 14, 80 12, 116 4" stroke="#2458A6" strokeWidth="3" strokeLinecap="round"
                initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ delay: 0.6, duration: 0.9, ease: [0.16, 1, 0.3, 1] }} />
            </svg>
          </span>
        </motion.h2>
        <motion.p {...fadeUp(1)} className="mt-5 text-[17px] leading-relaxed text-ink/70 max-w-md">
          Sajt je posao od poverenja. Zato ne radimo samo preko poruka — kada projekat to traži,
          dolazimo lično, slušamo kako vaš posao zaista radi i vraćamo se sa rešenjem.
        </motion.p>
        <motion.p {...fadeUp(2)} className="mt-4 text-[15px] text-ink/55">
          Ruma · Srbija — a put do vas je kratak.
        </motion.p>
      </div>

      {/* the sky-map: brand-drawn, self-hosted by definition (it's code) */}
      <motion.div {...fadeUp(1)} className="liquid-glass rounded-[1.75rem] p-4">
        <svg viewBox="0 0 420 320" className="w-full h-auto rounded-[1.25rem]" role="img" aria-label="Stilizovana mapa — od vas do nas">
          <rect width="420" height="320" rx="20" fill="#DCEBF8" />
          {/* the plain */}
          <path d="M30 240 C 90 200, 150 228, 210 208 S 340 180, 396 214 L 396 300 L 30 300 Z" fill="#A8CEF0" opacity="0.45" />
          <path d="M20 268 C 100 240, 210 260, 300 244 S 390 236, 404 246 L 404 304 L 20 304 Z" fill="#6FA5D8" opacity="0.30" />
          {/* the river */}
          <path d="M0 190 C 80 178, 130 210, 200 196 S 330 168, 420 188" stroke="#F5F9FD" strokeWidth="10" fill="none" strokeLinecap="round" opacity="0.9" />
          {/* drifting puffs */}
          <g fill="#F5F9FD">
            <ellipse cx="86" cy="66" rx="34" ry="16" /><ellipse cx="110" cy="56" rx="22" ry="12" />
            <ellipse cx="322" cy="84" rx="30" ry="14" /><ellipse cx="344" cy="74" rx="18" ry="10" />
          </g>
          {/* vi → mi route, drawn by the pen on scroll */}
          <motion.path
            d="M70 232 C 130 150, 240 260, 342 128"
            stroke="#2458A6" strokeWidth="4" strokeLinecap="round" strokeDasharray="1 14"
            fill="none" style={{ pathLength: route }}
          />
          <circle cx="70" cy="232" r="7" fill="#2458A6" />
          <text x="70" y="262" textAnchor="middle" fontFamily="Inter Tight" fontWeight="600" fontSize="15" fill="#16324F">vi</text>
          <g>
            <circle cx="342" cy="128" r="8" fill="#F5F9FD" stroke="#2458A6" strokeWidth="3.5" />
            <text x="342" y="104" textAnchor="middle" fontFamily="Inter Tight" fontWeight="600" fontSize="15" fill="#16324F">mi</text>
          </g>
        </svg>
      </motion.div>
    </div>
  )
}
