// GALAXY HOME STRUCTURE — the two counter-running value rows, 30s linear.
// True infinite loop: the gap lives on each cell (mr-*), never on the flex container, so the
// track is EXACTLY two identical halves and translateX(0 → -50%) has no seam. With `gap` on
// the flex parent the half-way point fell mid-gap and the row visibly restarted.
import { Sparkles, Waves, Star, Zap, Orbit, Gem } from 'lucide-react'

const ROW1 = [
  { Icon: Sparkles, name: 'Dizajn' },
  { Icon: Waves, name: 'Animacije' },
  { Icon: Star, name: 'Kvalitet' },
]
const ROW2 = [
  { Icon: Zap, name: 'Brzina' },
  { Icon: Orbit, name: 'Podrška' },
  { Icon: Gem, name: 'Garancije' },
]

/** enough copies to overrun the widest container, then the whole unit exactly twice */
const UNIT_REPEATS = 4

function Row({ items, reverse }: { items: typeof ROW1; reverse?: boolean }) {
  const unit = Array.from({ length: UNIT_REPEATS }, () => items).flat()
  const track = [...unit, ...unit]
  return (
    <div className="overflow-hidden">
      <div
        className={`flex w-max ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'}`}
        style={{ willChange: 'transform' }}
      >
        {track.map(({ Icon, name }, i) => (
          <span key={i} className="flex items-center gap-2 mr-8 sm:mr-12 shrink-0">
            <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-ink/60" />
            <span className="text-sm sm:text-base font-medium text-ink/75 whitespace-nowrap">{name}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Marquee() {
  return (
    <div className="mx-auto max-w-[820px] py-4 sm:py-6 overflow-hidden space-y-4">
      <Row items={ROW1} />
      <Row items={ROW2} reverse />
    </div>
  )
}
