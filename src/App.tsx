// DreamSign — GALAXY HOME STRUCTURAL REPLICA (Nick's directive: replicate, swap assets/content).
// Skeleton: Nav · Hero (4 layers) · mountain-wrapper[-25vh]{ Opis · TextFill · Marquee · Stats } ·
// page close · Footer. Eyes dev contract: ?jump + window.__ready.
import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import { motion, useScroll, useTransform } from 'motion/react'
import Entrance from './components/Entrance'
import Nav from './components/Nav'
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

/** Section 3: the mountain-equivalent wrapper — overlaps hero by -25vh, backdrop counter-parallax. */
function MountainWrapper({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotionSafe()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-20%'])
  return (
    <div ref={ref} className="relative z-40 -mt-[25vh]">
      <div className="absolute -top-[10vh] left-0 right-0 bottom-0 overflow-hidden pointer-events-none">
        <motion.img
          src="/media/B4-tower-fade.webp" alt=""
          className="h-[120%] w-full object-cover object-top"
          style={reduced ? undefined : { y }}
        />
      </div>
      <div className="relative pt-24 sm:pt-32 md:pt-40">{children}</div>
    </div>
  )
}

export default function App() {
  const reduced = useReducedMotionSafe()
  const [playEntrance] = useState(PLAY_ENTRANCE)
  const lenisRef = useRef<Lenis | null>(null)

  // Lenis smooth scroll (desktop; mobile native is already smooth)
  useEffect(() => {
    if (reduced || window.innerWidth < 768) return
    const lenis = new Lenis({ duration: 1.2, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
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
        <Hero />
        <MountainWrapper>
          <Opis />
          <TextFill />
          <Marquee />
          <Stats />
          <Zavrsnica />
        </MountainWrapper>
        <Footer />
      </main>
    </>
  )
}
