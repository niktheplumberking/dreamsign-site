// T6 char-variant (Galaxy card #11 grammar, same values as the homepage's TextFill):
// per-character opacity 0.25→1 scrubbed by scroll, ±0.01 window around each char's index.
// Generalized for the inner pages; an optional accent word flips to signature blue at fill.
import { useRef } from 'react'
import type { MotionValue } from 'motion/react'
import { motion, useScroll, useTransform } from 'motion/react'
import { EditableText, useOwnersKey } from '../ok/OwnersKey'

function Char({ p, start, ch, accent }: { p: MotionValue<number>; start: number; ch: string; accent?: boolean }) {
  const opacity = useTransform(p, [Math.max(0, start - 0.01), Math.min(1, start + 0.01)], [0.25, 1])
  return (
    <motion.span style={{ opacity }} className={accent ? 'text-accent' : undefined}>
      {ch}
    </motion.span>
  )
}

export default function CharFill({
  text,
  accentWord,
  className = 'text-xl sm:text-2xl md:text-[40px] md:leading-[48px] text-center leading-snug tracking-tight font-medium text-ink',
  k,
}: {
  text: string
  /** this word renders in signature blue */
  accentWord?: string
  className?: string
  /** Owner's Key zone — edit mode swaps the per-char machinery for a plain editable line */
  k?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.2'] })
  const editing = useOwnersKey()?.editing

  if (editing && k) {
    return (
      <div className="mx-auto max-w-[820px] px-5 sm:px-6 pb-16 sm:pb-24 pt-8 sm:pt-12 md:px-12">
        <p className={className}>
          <EditableText k={k}>{text}</EditableText>
        </p>
      </div>
    )
  }

  const total = text.length
  const words: { word: string; offset: number }[] = []
  let off = 0
  for (const w of text.split(' ')) { words.push({ word: w, offset: off }); off += w.length + 1 }

  return (
    <div ref={ref} className="mx-auto max-w-[820px] px-5 sm:px-6 pb-16 sm:pb-24 pt-8 sm:pt-12 md:px-12">
      <p aria-label={text} className={className}>
        {words.map(({ word, offset }, wi) => (
          <span key={wi}>
            <span className="inline-block whitespace-nowrap">
              {word.split('').map((ch, ci) => (
                <Char
                  key={ci} p={scrollYProgress} start={(offset + ci) / total} ch={ch}
                  accent={accentWord !== undefined && word.replace(/[.,—]/g, '') === accentWord}
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
