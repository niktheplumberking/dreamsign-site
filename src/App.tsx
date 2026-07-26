// DreamSign — ONE CONTINUOUS DESCENT (Nick's directive): a single world spans hero → footer,
// one scroll progress drives every layer, no content section owns a background, and every
// junction is crossed by a masked layer or a gradient bridge — never abutted.
// Galaxy Home structure kept exactly; only the assets and the Serbian content are ours.
import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import Entrance from './components/Entrance'
import Nav from './components/Nav'
import { World, WorldLayer, SeamBridge, Beat } from './components/World'
import Hero from './components/sections/Hero'
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
  tower: 'linear-gradient(to bottom, transparent 0%, black 7%, black 52%, transparent 100%)',
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
    const lenis = new Lenis({ lerp: 0.1 })
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
      const timeout = setTimeout(ready, 2500)
      document.fonts.ready.then(() => { clearTimeout(timeout); setTimeout(ready, playEntrance ? 3200 : 300) })
    } else {
      setTimeout(ready, 2500)
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
              {/* the mountain: one instance, faded top eating the hero seam */}
              <Beat name="opis" layers={
                <WorldLayer
                  src="/media/B4-tower-fade.webp" eager
                  box="-top-[38vh] -bottom-[58vh]"
                  imgClass="absolute inset-0 h-[115%] w-full object-cover object-top"
                  y={['0%', '-20%']} mask={MASK.tower}
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
                  opacity={{ range: [0.34, 0.50, 0.72], values: [0, 0.62, 0.12] }}
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
                opacity={{ range: [0.58, 0.70, 1], values: [0, 0.7, 0.7] }}
              />
              {/* the plain: once it is up it stays up, at full opacity, through the footer */}
              <WorldLayer
                src="/media/landing-plain.webp"
                box="-top-[42vh] bottom-0"
                imgClass="absolute inset-0 h-[118%] w-full object-cover object-bottom"
                y={['0%', '-6%']} mask={MASK.plain}
                opacity={{ range: [0.52, 0.68, 1], values: [0, 1, 1] }}
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
