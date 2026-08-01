// F9 char-rise (Galaxy grammar): characters glide up out of a masked line, staggered by
// index. One-shot on view — the inner pages' intro voice. Word/space structure mirrors
// TextFill's (space OUTSIDE the nowrap span, or inline-block trimming glues words).
import { motion } from 'motion/react'
import { EditableText, useOwnersKey } from '../ok/OwnersKey'

export default function CharRise({
  text,
  className = '',
  as: Tag = 'p',
  delay = 0,
  k,
}: {
  text: string
  className?: string
  as?: 'p' | 'h2'
  delay?: number
  /** Owner's Key zone — edit mode swaps the per-char machinery for a plain editable line */
  k?: string
}) {
  const editing = useOwnersKey()?.editing
  if (editing && k) {
    return (
      <Tag className={className}>
        <EditableText k={k}>{text}</EditableText>
      </Tag>
    )
  }
  const words = text.split(' ')
  let index = 0
  return (
    <Tag className={className} aria-label={text}>
      {words.map((word, wi) => {
        const chars = word.split('').map((ch, ci) => {
          const i = index++
          return (
            <span key={ci} className="inline-block overflow-hidden align-bottom">
              <motion.span
                aria-hidden
                className="inline-block"
                initial={{ y: '120%' }}
                whileInView={{ y: '0%' }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, delay: delay + i * 0.022, ease: [0.22, 1, 0.36, 1] }}
              >
                {ch}
              </motion.span>
            </span>
          )
        })
        index++ // the space between words keeps the stagger clock honest
        return (
          <span key={wi}>
            <span className="inline-block whitespace-nowrap">{chars}</span>
            {wi < words.length - 1 ? ' ' : null}
          </span>
        )
      })}
    </Tag>
  )
}
