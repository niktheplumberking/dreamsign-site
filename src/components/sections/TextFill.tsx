// GALAXY HOME STRUCTURAL REPLICA — Section 5: Text Fill (per-character scroll reveal).
// Exact: opacity 0.25→1, useScroll ['start 0.8','end 0.2'], ±0.01 window around i/total,
// container max-w-[820px] px-5 sm:px-6 pb-16 sm:pb-24 pt-8 sm:pt-12 md:px-12.
import { useRef } from 'react'
import type { MotionValue } from 'motion/react'
import { motion, useScroll, useTransform } from 'motion/react'
import { bk } from '../../lib/content'
import { EditableText, useOwnersKey } from '../../ok/OwnersKey'

const TEXT = bk(
  'obecanja-tekst',
  'Ugovor, garancije i potpuna transparentnost — svaki sajt biramo da donese rezultat, ne samo da postoji. Nijedan klijent ne ostaje nezadovoljan.',
)

// batch 60 (owner cleared deviation D09): the last word does not just fill, it CHANGES —
// „nezadovoljan" arrives in the signature blue while the rest of the sentence lands in ink.
// It was in the spec from the start and never built. The colour rides the SAME window as the
// opacity, so it is one motion, not a second one racing it.
const INK = '#16324F'
const ACCENT = '#2458A6'

function Char({ p, start, ch, accent = false }: {
  p: MotionValue<number>; start: number; ch: string; accent?: boolean
}) {
  const from = Math.max(0, start - 0.01)
  const to = Math.min(1, start + 0.01)
  const opacity = useTransform(p, [from, to], [0.25, 1])
  const color = useTransform(p, [from, to], [INK, ACCENT])
  return <motion.span style={accent ? { opacity, color } : { opacity }}>{ch}</motion.span>
}

export default function TextFill() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.2'] })
  // per-char spans and contentEditable cannot share a DOM — edit mode gets the plain form
  const editing = useOwnersKey()?.editing

  if (editing) {
    return (
      <div className="mx-auto max-w-[820px] px-5 sm:px-6 pb-16 sm:pb-24 pt-8 sm:pt-12 md:px-12">
        <p className="text-xl sm:text-2xl md:text-[40px] md:leading-[48px] text-center leading-snug tracking-tight font-medium text-ink">
          <EditableText k="obecanja-tekst">{TEXT}</EditableText>
        </p>
      </div>
    )
  }

  const total = TEXT.length
  const words: { word: string; offset: number }[] = []
  let off = 0
  for (const w of TEXT.split(' ')) { words.push({ word: w, offset: off }); off += w.length + 1 }

  return (
    <div ref={ref} className="mx-auto max-w-[820px] px-5 sm:px-6 pb-16 sm:pb-24 pt-8 sm:pt-12 md:px-12">
      <p aria-label={TEXT} className="text-xl sm:text-2xl md:text-[40px] md:leading-[48px] text-center leading-snug tracking-tight font-medium text-ink">
        {words.map(({ word, offset }, wi) => (
          <span key={wi}>
            <span className="inline-block whitespace-nowrap">
              {word.split('').map((ch, ci) => (
                <Char
                  key={ci} p={scrollYProgress} start={(offset + ci) / total} ch={ch}
                  // the word carries a full stop, and the owner's text is editable — match
                  // the stem, never the exact token
                  accent={word.toLowerCase().startsWith('nezadovoljan') && ci < 'nezadovoljan'.length}
                />
              ))}
            </span>
            {wi < words.length - 1 ? ' ' : null}
          </span>
        ))}
      </p>
    </div>
  )
}
