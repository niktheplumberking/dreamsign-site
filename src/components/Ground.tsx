// THE GROUND, shared by the inner pages: the same paper + plain plates the homepage lands
// on, wrapping each page's finale and the footer so every page ends standing inside the
// world. Layer values identical to Pocetna's approved ground block.
import { WorldLayer } from './World'
import { MASK } from '../lib/masks'
import Footer from './Footer'

export default function Ground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <div
        className="absolute left-0 right-0 -top-[80vh] bottom-0 z-0 pointer-events-none
                   bg-gradient-to-b from-transparent via-white/45 to-white/80"
        aria-hidden
      />
      {/* both plates EAGER: the inner pages are short, so a lazy plate's fetch+decode lands
          mid-first-scroll and stalls a frame (measured 137-174ms vs the 50ms law); eager +
          decoding=async moves that work into the load, before anyone scrolls */}
      <WorldLayer
        src="/media/B8-paper-ground.webp" eager
        box="-top-[30vh] bottom-0"
        imgClass="absolute inset-0 h-[112%] w-full object-cover object-bottom"
        y={['0%', '-4%']} mask={MASK.paper}
        opacity={{ range: [0.55, 0.72, 1], values: [0, 0.7, 0.7] }}
      />
      {/* the plain: once it is up it stays up, at full opacity, through the footer */}
      <WorldLayer
        src="/media/landing-plain.webp" eager
        box="-top-[42vh] bottom-0"
        imgClass="absolute inset-0 h-[118%] w-full object-cover object-bottom"
        y={['0%', '-6%']} mask={MASK.plain}
        opacity={{ range: [0.50, 0.70, 1], values: [0, 1, 1] }}
      />
      <div className="relative z-10">
        {children}
        <Footer />
      </div>
    </div>
  )
}
