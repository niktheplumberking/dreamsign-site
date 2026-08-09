// The cloud button (batch 14/15): a real cloud — our own entrance puff — carrying a label.
// Floats idle, swells on hover; works as a link (href) or an action (onClick). The label
// sits in the puff's fluffy body, sized to stay INSIDE the cloud at every breakpoint.
import { motion } from 'motion/react'

export default function CloudButton({
  label,
  href,
  onClick,
  reduced,
  className = '',
}: {
  label: string
  href?: string
  onClick?: () => void
  reduced: boolean
  className?: string
}) {
  const body = (
    <motion.span
      aria-hidden
      className="relative col-start-1 row-start-1 block w-full"
      animate={reduced ? undefined : { y: [0, -6, 0] }}
      transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
    >
      <img
        src="/media/cloud-puff.webp" alt=""
        className="w-full select-none drop-shadow-[0_10px_26px_rgba(22,50,79,0.22)]
                   transition-transform duration-300 group-hover:scale-105"
      />
      {/* batch 16: the label sits dead-centre of the cloud's visible mass (the image has
          a touch more transparent air above than below — pt-[4%] optically centres it) */}
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center pt-[4%]">
        <span className="max-w-[60%] text-center text-[12px] font-semibold uppercase leading-tight tracking-[0.1em] text-ink/85 sm:text-[12.5px]">
          {label}
        </span>
      </span>
    </motion.span>
  )

  const cls = `group relative grid w-[300px] cursor-pointer place-items-center sm:w-[350px] ${className}`

  return href ? (
    <a href={href} target="_blank" rel="noopener" className={cls} aria-label={label}>
      {body}
    </a>
  ) : (
    <button type="button" onClick={onClick} className={cls} aria-label={label}>
      {body}
    </button>
  )
}
