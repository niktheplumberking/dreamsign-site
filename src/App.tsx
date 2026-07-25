// DreamSign — homepage. Eyes dev contract: ?jump=<scrollY> pre-scroll + window.__ready signal.
import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import Entrance from './components/Entrance'
import Nav from './components/Nav'
import Hero from './components/sections/Hero'
import { sessionOnce, useReducedMotionSafe } from './lib/hooks'

declare global {
  interface Window { __ready?: boolean }
}

const jumpParam = new URLSearchParams(window.location.search).get('jump')
// Module scope: StrictMode double-mounts components — the session flag must burn exactly once.
const PLAY_ENTRANCE = !jumpParam && sessionOnce('ds_entered')

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
        <Hero started={started} />
      </main>
    </>
  )
}
