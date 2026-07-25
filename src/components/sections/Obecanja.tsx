// Scene 2 — Obećanja. Galaxy Home text-fill mechanic EXACTLY:
// per-character opacity 0.25→1, useScroll offset ['start 0.8','end 0.2'], window ±0.01 around i/total.
import { useRef } from 'react'
import type { MotionValue } from 'motion/react'
import { motion, useScroll, useTransform } from 'motion/react'

const TEXT = 'Ugovor. Garancije. Potpuna transparentnost. Nijedan klijent ne ostaje nezadovoljan.'

function Char({ p, start, ch, accent }: { p: MotionValue<number>; start: number; ch: string; accent: boolean }) {
  const opacity = useTransform(p, [Math.max(0, start - 0.01), Math.min(1, start + 0.01)], [0.25, 1])
  return (
    <motion.span style={{ opacity }} className={accent ? 'text-accent' : undefined}>
      {ch === ' ' ? ' ' : ch}
    </motion.span>
  )
}

export default function Obecanja() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.2'] })
  const { scrollYProgress: strokeProgress } = useScroll({ target: ref, offset: ['start 0.7', 'end 0.25'] })
  const strokeLength = useTransform(strokeProgress, [0, 1], [0, 1])

  const total = TEXT.length
  const accentFrom = TEXT.indexOf('nezadovoljan')
  // words as unbreakable spans (so lines wrap at spaces), chars animated inside by GLOBAL index
  const words: { word: string; offset: number }[] = []
  let off = 0
  for (const w of TEXT.split(' ')) { words.push({ word: w, offset: off }); off += w.length + 1 }

  return (
    <div ref={ref} className="mx-auto max-w-[820px] px-5 sm:px-6 md:px-12 pt-28 sm:pt-36 pb-14 sm:pb-20 text-center">
      <p aria-label={TEXT} className="font-medium tracking-tight leading-snug text-ink text-xl sm:text-2xl md:text-[40px] md:leading-[48px]">
        {words.map(({ word, offset }, wi) => (
          <span key={wi}>
            <span className="inline-block whitespace-nowrap">
              {word.split('').map((ch, ci) => {
                const i = offset + ci
                return (
                  <Char key={ci} p={scrollYProgress} start={i / total} ch={ch}
                        accent={accentFrom !== -1 && i >= accentFrom && i < accentFrom + 'nezadovoljan'.length} />
                )
              })}
            </span>
            {wi < words.length - 1 ? ' ' : null}
          </span>
        ))}
      </p>
      {/* the pen arcs beneath the promise — scrubbed with the same progress */}
      <svg viewBox="0 0 600 46" fill="none" className="mx-auto mt-8 w-[min(70%,460px)]" aria-hidden>
        <motion.path
          d="M12 30 C 150 44, 450 42, 588 12"
          stroke="#2458A6" strokeWidth="3.5" strokeLinecap="round"
          style={{ pathLength: strokeLength }}
        />
      </svg>
    </div>
  )
}
