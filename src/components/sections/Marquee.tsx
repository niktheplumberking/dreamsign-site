// GALAXY HOME STRUCTURAL REPLICA — Section 6: Logo Marquee (two counter-rows, 30s linear).
// Exact structure incl. Lucide icons; names swapped to DreamSign's real value words.
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

function Row({ items, reverse }: { items: typeof ROW1; reverse?: boolean }) {
  const doubled = [...items, ...items, ...items, ...items]
  return (
    <div className="overflow-hidden">
      <div className={`flex w-max gap-8 sm:gap-12 ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'}`}>
        {doubled.map(({ Icon, name }, i) => (
          <span key={i} className="flex items-center gap-2">
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
