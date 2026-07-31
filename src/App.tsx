// DreamSign — ONE CONTINUOUS DESCENT (Nick's directive): a single world spans hero → footer,
// one scroll progress drives every layer, no content section owns a background, and every
// junction is crossed by a masked layer or a gradient bridge — never abutted.
// Galaxy Home structure kept exactly; only the assets and the Serbian content are ours.
import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import Entrance, { ENTRANCE_MS } from './components/Entrance'
import Nav from './components/Nav'
import { World, WorldLayer, SeamBridge, Beat } from './components/World'
import Hero from './components/sections/Hero'
import Radovi from './components/sections/Radovi'
import NaseUsluge from './components/sections/NaseUsluge'
import Opis from './components/sections/Opis'
import TextFill from './components/sections/TextFill'
import Marquee from './components/sections/Marquee'
import Stats from './components/sections/Stats'
import Zavrsnica from './components/sections/Zavrsnica'
import Footer from './components/Footer'
import { sessionOnce, useReducedMotionSafe } from './lib/hooks'

declare global {
  interface Window { __ready?: boolean }
}

const jumpParam = new URLSearchParams(window.location.search).get('jump')
// Module scope: StrictMode double-mounts components — the session flag must burn exactly once.
const PLAY_ENTRANCE = !jumpParam && sessionOnce('ds_entered')

const MASK = {
  sky: 'linear-gradient(to bottom, transparent 0%, black 18%, black 72%, transparent 100%)',
  flourish: 'linear-gradient(to bottom, transparent 4%, black 34%, black 66%, transparent 96%)',
  tower: 'linear-gradient(to bottom, transparent 0%, black 7%, black 52%, transparent 100%)',
  // batch 9 — Nick's red line, as a mask: the warm zone's top edge is an IRREGULAR wavy
  // cloud-line (±45px undulations, drawn from his sketch), blurred 24px so no row of pixels
  // ever carries a hard step. preserveAspectRatio=none stretches it across any viewport.
  wavy: `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 1000' preserveAspectRatio='none'>` +
    `<defs>` +
    `<linearGradient id='g' x1='0' y1='0' x2='0' y2='1'>` +
    `<stop offset='0' stop-color='white'/><stop offset='0.55' stop-color='white'/>` +
    `<stop offset='0.98' stop-color='white' stop-opacity='0'/>` +
    `</linearGradient>` +
    `<filter id='b' x='-10%' y='-10%' width='120%' height='120%'><feGaussianBlur stdDeviation='24'/></filter>` +
    `</defs>` +
    `<path filter='url(%23b)' fill='url(%23g)' d='M0,210 C90,168 170,232 290,206 C420,178 470,252 590,240 ` +
    `C700,232 760,178 870,196 C980,214 1030,148 1150,164 C1260,178 1350,118 1440,140 L1440,1000 L0,1000 Z'/>` +
    `</svg>`,
  )}")`,
  sea: 'linear-gradient(to bottom, transparent 0%, black 46%, black 78%, transparent 100%)',
  rays: 'linear-gradient(to bottom, transparent 0%, black 26%, black 64%, transparent 100%)',
  // the ground plates fade IN at the top only — never out at the bottom, they are the end
  plain: 'linear-gradient(to bottom, transparent 0%, black 38%, black 100%)',
  paper: 'linear-gradient(to bottom, transparent 0%, black 42%, black 100%)',
}

export default function App() {
  const reduced = useReducedMotionSafe()
  const [playEntrance] = useState(PLAY_ENTRANCE)
  const lenisRef = useRef<Lenis | null>(null)

  // Lenis drives the whole site — one smoothing law for every layer (touch stays native).
  useEffect(() => {
    if (reduced) return
    // batch 10: lerp eased 0.1 → 0.085 — a touch more glide without going floaty; wheel
    // smoothing stays on. Lenis remains the ONLY scroll driver on the site.
    const lenis = new Lenis({ lerp: 0.085, smoothWheel: true })
    lenisRef.current = lenis
    let id: number
    const raf = (time: number) => { lenis.raf(time); id = requestAnimationFrame(raf) }
    id = requestAnimationFrame(raf)
    return () => { cancelAnimationFrame(id); lenis.destroy() }
  }, [reduced])

  // Eyes dev contract: jump + __ready
  useEffect(() => {
    if (jumpParam) {
      const y = parseInt(jumpParam, 10) || 0
      requestAnimationFrame(() => { window.scrollTo(0, y); lenisRef.current?.scrollTo(y, { immediate: true }) })
    }
    const ready = () => { window.__ready = true }
    if (document.fonts?.ready) {
      const timeout = setTimeout(ready, ENTRANCE_MS + 900)
      // the rig may not capture until the entrance is fully off the page — this tracks
      // the entrance's own clock, so retuning the beats can never desync the Eyes
      document.fonts.ready.then(() => { clearTimeout(timeout); setTimeout(ready, playEntrance ? ENTRANCE_MS + 400 : 300) })
    } else {
      setTimeout(ready, playEntrance ? ENTRANCE_MS + 400 : 2500)
    }
  }, [playEntrance])

  return (
    <>
      <Entrance play={playEntrance && !reduced} onDone={() => {}} />
      <Nav />
      <main>
        <World>
          <Hero />

          {/* THE DESCENT — overlaps the hero by 25vh; nothing below here paints its own ground. */}
          <div className="relative z-20 -mt-[25vh]">
            {/* junction 1: the gradient bridge, starting on the hero's sampled bottom colour */}
            <SeamBridge className="top-[8vh] h-[86vh]" />

            <div className="pt-24 sm:pt-32 md:pt-40">
              {/* batch 5, Nick's order — the proof lands right under the hero: past work +
                  the trust facts, on B3's quiet sky (small clouds, no mass — the cards are
                  the mass). The layer straddles both junctions per the one-descent law. */}
              <Beat name="radovi" layers={
                <WorldLayer
                  src="/media/B3-square-sky.webp"
                  box="-top-[34vh] -bottom-[40vh]"
                  imgClass="absolute inset-0 h-[126%] w-full object-cover object-center"
                  y={['0%', '-10%']} base={0.85} mask={MASK.sky}
                />
              }>
                <Radovi />
              </Beat>

              {/* what we sell — the quill flourish rides the right margin, a whisper;
                  batch 8 adds two ambient puffs drifting behind the giant word-line so the
                  section lives in weather, not on a flat wall */}
              <Beat name="usluge" layers={
                <>
                  <WorldLayer
                    src="/media/B2-vertical-flourish.webp"
                    box="-top-[26vh] -bottom-[30vh]"
                    imgClass="absolute right-[-14%] top-0 h-full w-auto max-w-none object-contain md:right-[-6%]"
                    y={['0%', '-7%']} mask={MASK.flourish}
                    opacity={{ range: [0.10, 0.22, 0.40], values: [0, 0.32, 0.10] }}
                  />
                  <WorldLayer
                    src="/media/bank-soft.webp"
                    box="-top-[6vh] -bottom-[10vh]"
                    imgClass="absolute left-[-18%] top-[6%] w-[52%] h-auto max-w-none"
                    y={['0%', '-14%']} base={0.55}
                  />
                  <WorldLayer
                    src="/media/bank-soft.webp"
                    box="-top-[6vh] -bottom-[10vh]"
                    imgClass="absolute right-[-14%] top-[46%] w-[44%] h-auto max-w-none scale-x-[-1]"
                    y={['0%', '-8%']} base={0.45}
                  />
                  {/* batch 10 — the storybook cloud Nick red-circled into the empty left
                      field beside rows 03/04 */}
                  <WorldLayer
                    src="/media/hero-cloud-foreground.webp"
                    box="-top-[4vh] -bottom-[6vh]"
                    imgClass="absolute left-[-7%] top-[56%] w-[36%] h-auto max-w-none"
                    y={['0%', '-11%']} base={0.92}
                  />
                </>
              }>
                <NaseUsluge />
              </Beat>

              {/* the mountain: one instance, its TOP edge cut by MASK.wavy — an irregular,
                  blurred cloud-line silhouette drawn to Nick's red-line sketch (batch 9):
                  high left, dipping, rising, dipping deeper, climbing off the right edge.
                  Never a horizontal fade. The batch-8 outlined bank he circled is deleted. */}
              <Beat name="opis" layers={
                <WorldLayer
                  src="/media/B4-tower-fade.webp" eager
                  box="-top-[38vh] -bottom-[58vh]"
                  imgClass="absolute inset-0 h-[115%] w-full object-cover object-top"
                  y={['0%', '-20%']} mask={MASK.wavy}
                />
              }>
                <Opis />
              </Beat>

              {/* the vertical sea: one continuous span straddling both junctions around the promise */}
              <Beat name="promise" layers={
                <WorldLayer
                  src="/media/B7-vertical-sea.webp"
                  box="-top-[44vh] -bottom-[56vh]"
                  imgClass="absolute inset-0 h-[130%] w-full object-cover object-center"
                  y={['0%', '-12%']} base={0.92} mask={MASK.sea}
                />
              }>
                <TextFill />
              </Beat>

              {/* the light gap opening into the proof beat */}
              <Beat name="marquee" layers={
                <WorldLayer
                  src="/media/B6-light-rays.webp"
                  box="-top-[30vh] -bottom-[64vh]"
                  imgClass="absolute inset-0 h-[130%] w-full object-cover object-center"
                  y={['0%', '-8%']} mask={MASK.rays}
                  // batch 5: two beats were inserted above — every world-fraction window
                  // slides later or the light arrives during the wrong beat
                  opacity={{ range: [0.56, 0.71, 0.86], values: [0, 0.62, 0.12] }}
                />
              }>
                <Marquee />
              </Beat>

              <Beat name="stats"><Stats /></Beat>
            </div>

            {/* THE GROUND — the signature beat and the footer stand on the same plain:
                one set of layers spans both, so the page ends inside the world, not beside it. */}
            <div className="relative">
              <div
                className="absolute left-0 right-0 -top-[80vh] bottom-0 z-0 pointer-events-none
                           bg-gradient-to-b from-transparent via-white/45 to-white/80"
                aria-hidden
              />
              <WorldLayer
                src="/media/B8-paper-ground.webp"
                box="-top-[30vh] bottom-0"
                imgClass="absolute inset-0 h-[112%] w-full object-cover object-bottom"
                y={['0%', '-4%']} mask={MASK.paper}
                opacity={{ range: [0.70, 0.82, 1], values: [0, 0.7, 0.7] }}
              />
              {/* the plain: once it is up it stays up, at full opacity, through the footer */}
              <WorldLayer
                src="/media/landing-plain.webp"
                box="-top-[42vh] bottom-0"
                imgClass="absolute inset-0 h-[118%] w-full object-cover object-bottom"
                y={['0%', '-6%']} mask={MASK.plain}
                opacity={{ range: [0.64, 0.80, 1], values: [0, 1, 1] }}
              />
              <div className="relative z-10">
                <Beat name="finale"><Zavrsnica /></Beat>
                <Footer />
              </div>
            </div>
          </div>
        </World>
      </main>
    </>
  )
}
