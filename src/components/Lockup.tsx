// The mark that becomes the name: DS ⇄ DreamSign, one gesture. The nav runs it on
// hover/focus, the entrance runs it on a timer — deliberately the same transition.
// The full lockup always holds the layout width (it is only clipped), so nothing
// around it ever moves; the DS mark rides on top of it and fades.
import { useReducedMotionSafe } from '../lib/hooks'

export default function Lockup({ expanded, className = '' }: { expanded: boolean; className?: string }) {
  const reduced = useReducedMotionSafe()
  const dur = reduced ? '0ms' : '640ms'
  const ease = 'cubic-bezier(0.22, 1, 0.36, 1)'

  return (
    <span className={`relative inline-flex items-baseline leading-none ${className}`} aria-hidden>
      {/* the name — clipped shut when collapsed, unfurled left to right when open */}
      <span
        className="inline-flex items-baseline"
        style={{
          clipPath: expanded ? 'inset(-30% -14% -30% 0%)' : 'inset(-30% 100% -30% 0%)',
          transition: `clip-path ${dur} ${ease}`,
        }}
      >
        <img
          src="/media/brand/cloud-d.webp" alt="" aria-hidden
          className="h-[0.86em] w-auto max-w-none"
          style={{ filter: 'drop-shadow(0 1px 1.5px rgba(22,50,79,0.30))' }}
        />
        <span className="font-medium tracking-tight text-ink">ream</span>
        <span className="font-script font-normal text-[1.45em] ml-[-0.015em] text-accent">Sign</span>
      </span>

      {/* the DS mark, sitting on the name's own D */}
      <img
        src="/media/brand/ds-mark.webp" alt="" aria-hidden
        className="absolute left-[-0.06em] bottom-[-0.16em] h-[1.5em] w-auto max-w-none"
        style={{
          opacity: expanded ? 0 : 1,
          transition: `opacity ${reduced ? '0ms' : expanded ? '240ms' : '440ms'} ease`,
          filter: 'drop-shadow(0 1px 1.5px rgba(22,50,79,0.22))',
        }}
      />
    </span>
  )
}
