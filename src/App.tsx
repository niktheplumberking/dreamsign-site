// DreamSign — homepage: THE DESCENT. Galaxy Home overlap grammar throughout:
// hero (z-10) → mid-world wrapper (z-40, -mt-[25vh], own counter-parallax backdrop ['0%','-20%'])
// containing promises/services, over which Radovi rises (M08) → Prisustvo → landing (z-50) → footer.
// Eyes dev contract: ?jump=<scrollY> pre-scroll + window.__ready signal.
import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import { motion, useScroll, useTransform } from 'motion/react'
import Entrance from './components/Entrance'
import Nav from './components/Nav'
import Hero from './components/sections/Hero'
import Obecanja from './components/sections/Obecanja'
import Usluge from './components/sections/Usluge'
import Radovi from './components/sections/Radovi'
import Prisustvo from './components/sections/Prisustvo'
import Finale from './components/sections/Finale'
import Footer from './components/Footer'
import { sessionOnce, useReducedMotionSafe } from './lib/hooks'

declare global {
  interface Window { __ready?: boolean }
}

const jumpParam = new URLSearchParams(window.location.search).get('jump')
// Module scope: StrictMode double-mounts components — the session flag must burn exactly once.
const PLAY_ENTRANCE = !jumpParam && sessionOnce('ds_entered')

/** The mid-world: inside the cloud layer. Own scroll range drives the backdrop counter-parallax. */
function MidWorld({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotionSafe()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-20%'])
  return (
    <div ref={ref} className="relative z-40 -mt-[25vh]">
      {/* backdrop: descending INTO the mist — gradient + two blurred wisp layers at different depths */}
      <div className="absolute -top-[10vh] left-0 right-0 bottom-0 overflow-hidden pointer-events-none">
        <motion.div className="absolute inset-0 h-[120%]" style={reduced ? undefined : { y }}>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(220,235,248,0) 0%, #DCEBF8 14%, #F5F9FD 46%, #F5F9FD 100%)' }} />
          <img src="/media/hero-cloud-foreground.webp" alt="" className="absolute top-[6%] left-[-20%] w-[80%] opacity-[0.10] blur-md" />
          <img src="/media/hero-cloud-foreground.webp" alt="" className="absolute top-[38%] right-[-24%] w-[70%] opacity-[0.07] blur-lg scale-x-[-1]" />
        </motion.div>
      </div>
      <div className="relative">{children}</div>
    </div>
  )
}

export default function App() {
  const reduced = useReducedMotionSafe()
  const [playEntrance] = useState(PLAY_ENTRANCE)
  const [started, setStarted] = useState(!playEntrance)
  const lenisRef = useRef<Lenis | null>(null)

  // Lenis smooth scroll (desktop; mobile native is already smooth) — F1
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
      <Entrance play={playEntrance && !reduced} onDone={() => setStarted(true)} />
      <Nav />
      <main>
        <div className="relative z-10">
          <Hero started={started} />
        </div>
        <MidWorld>
          <div className="pt-[25vh]">
            <Obecanja />
            {/* M08: Usluge waits pinned while Radovi rises over it */}
            <div className="relative h-[200vh]">
              <div className="sticky top-0 min-h-screen flex items-center">
                <div className="w-full"><Usluge /></div>
              </div>
            </div>
            <Radovi />
            <Prisustvo />
          </div>
        </MidWorld>
        <Finale />
        <Footer />
      </main>
    </>
  )
}
