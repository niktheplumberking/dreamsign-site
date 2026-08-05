// THE PAGE VEIL (batch 22, owner) — every internal navigation crosses the sky: a gust of
// clouds rushes the viewport (left or right, picked at random), the route swaps while the
// screen is covered, and the gust blows out the far side. Total ride ~1.35s (his law: <2s).
//
// One capture-phase listener owns EVERY internal <a> — nav, footer, logo, 404 — so no
// component needs to know the veil exists. preventDefault() is enough to stop React
// Router's Link (it honours defaultPrevented); external links, new-tab clicks, modified
// clicks and same-page clicks pass through untouched. Reduced motion navigates plainly.
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useReducedMotionSafe } from '../lib/hooks'

const SWAP_MS = 560   // the route swaps here — the wall of cloud is at full cover
const TOTAL_MS = 1350 // the last wisp leaves the stage

/** the gust — mostly the CONTOURED clouds (watercolour corners + the button puff): the
    soft airbrushed banks vanish against the sky-wall, these stay legible at full speed */
const PUFFS = [
  // [src, top%, size vw, delay ms, duration ms, drift deg]
  ['/media/bank-soft.webp', 4, 84, 110, 1160, 1.5],
  ['/media/cloud-corner-l.webp', -10, 62, 0, 1140, -4],
  ['/media/cloud-puff.webp', 20, 56, 90, 1040, 3],
  ['/media/hero-cloud-foreground.webp', 32, 96, 40, 1210, 2],
  ['/media/cloud-corner-r.webp', 50, 48, 130, 1000, 6],
  ['/media/cloud-corner-l.webp', 64, 58, 60, 1090, -3],
  ['/media/cloud-puff.webp', 76, 54, 170, 970, -5],
  ['/media/cloud-corner-r.webp', -14, 40, 200, 940, 8],
] as const

export default function PageVeil() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const reduced = useReducedMotionSafe()
  const [gust, setGust] = useState<null | { dir: 1 | -1; to: string; key: number }>(null)
  const busy = useRef(false)
  const path = useRef(pathname)
  path.current = pathname
  // navigate's identity CHANGES after the route swaps — if the gust effect depended on it,
  // the cleanup would clear the un-mount timer mid-flight and the veil would stay forever,
  // silently swallowing every later click (found live, batch 22). The ref keeps the timers.
  const nav = useRef(navigate)
  nav.current = navigate

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as Element).closest?.('a')
      if (!a) return
      const href = a.getAttribute('href') || ''
      if (!href.startsWith('/') || href.startsWith('//') || a.target === '_blank' || a.hasAttribute('download')) return
      if (busy.current) { e.preventDefault(); return }
      const to = href.split('#')[0].split('?')[0]
      if (to === path.current) return
      if (reduced) return // the router handles it plainly — no veil under reduced motion
      e.preventDefault()
      busy.current = true
      setGust({ dir: Math.random() < 0.5 ? 1 : -1, to: href, key: Date.now() })
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [reduced])

  useEffect(() => {
    if (!gust) return
    const swap = setTimeout(() => nav.current(gust.to), SWAP_MS)
    const done = setTimeout(() => { setGust(null); busy.current = false }, TOTAL_MS)
    return () => { clearTimeout(swap); clearTimeout(done) }
  }, [gust])

  return (
    <AnimatePresence>
      {gust && (
        <motion.div
          key={gust.key}
          // click-TRANSPARENT: the busy ref already swallows double-clicks, so even a
          // zombie veil could never dead-lock the page (defence in depth)
          className="pointer-events-none fixed inset-0 z-[95] overflow-hidden"
          aria-hidden
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
        >
          {/* the sky-wall behind the gust — guarantees the swap is never seen naked */}
          <motion.div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, #D7E7F7 0%, #CDE2F5 55%, #E6F1FB 100%)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: TOTAL_MS / 1000, times: [0, 0.34, 0.62, 1], ease: 'linear' }}
          />
          {/* the wind: every puff crosses the whole stage, staggered depths and speeds */}
          {PUFFS.map(([src, top, vw, delay, dur, tilt], i) => (
            <motion.img
              key={i}
              src={src} alt=""
              className="absolute max-w-none select-none"
              style={{ top: `${top}%`, width: `${vw}vw`, left: 0, rotate: `${tilt}deg` }}
              initial={{ x: gust.dir === 1 ? '-120vw' : '120vw' }}
              animate={{ x: gust.dir === 1 ? '120vw' : '-120vw' }}
              transition={{ duration: dur / 1000, delay: delay / 1000, ease: [0.45, 0, 0.25, 1] }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
