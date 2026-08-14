// THE PAGE VEIL (batch 22/23, owner) — every internal navigation crosses the sky: a gust
// of clouds rushes the viewport (left or right, picked at random), the route swaps while
// the screen is covered, and the gust blows out the far side. Total ride ~1.35s (<2s law).
//
// One capture-phase listener owns EVERY internal <a> — nav, footer, logo, 404 — so no
// component needs to know the veil exists. preventDefault() is enough to stop React
// Router's Link (it honours defaultPrevented); external links, new-tab clicks, modified
// clicks and same-page clicks pass through untouched. Reduced motion navigates plainly.
//
// Batch 23: the flight is PURE CSS animation (keyframes in index.css) — compositor-driven,
// so the route swap's render stall can never freeze the wind mid-gust (the "slight stop"
// Nick felt). The puff images preload once on mount so the first gust flies as smoothly
// as the tenth.
import { useEffect, useRef, useState } from 'react'
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

  // the first gust must not decode its clouds mid-flight
  useEffect(() => {
    for (const [src] of PUFFS) { const i = new Image(); i.src = src }
  }, [])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as Element).closest?.('a')
      if (!a) return
      const href = a.getAttribute('href') || ''
      if (!href.startsWith('/') || href.startsWith('//') || a.target === '_blank' || a.hasAttribute('download')) return
      const to = href.split('#')[0].split('?')[0]
      // batch 58 — A PATH WITH A FILE EXTENSION IS A REAL FILE ON THE HOST, not a route.
      // The legal pages are static documents (/politika-privatnosti.html,
      // /uslovi-koriscenja.html); this listener was hijacking their clicks and handing them
      // to React Router, which has no such route — so the footer's two legal links landed
      // every visitor on the 404 page. The files themselves always served fine, which is why
      // nothing ever flagged it: a link check by URL passes, a CLICK does not. Let the
      // browser navigate.
      if (/\.[a-z0-9]{2,5}$/i.test(to)) return
      if (busy.current) { e.preventDefault(); return }
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

  if (!gust) return null
  const sweep = gust.dir === 1 ? 'veil-sweep-r' : 'veil-sweep-l'
  return (
    // click-TRANSPARENT: the busy ref already swallows double-clicks, so even a zombie
    // veil could never dead-lock the page (defence in depth)
    <div key={gust.key} className="pointer-events-none fixed inset-0 z-[95] overflow-hidden" aria-hidden>
      {/* the sky-wall behind the gust — guarantees the swap is never seen naked */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, #D7E7F7 0%, #CDE2F5 55%, #E6F1FB 100%)',
          animation: `veil-wall ${TOTAL_MS}ms linear both`,
        }}
      />
      {/* the wind: every puff crosses the whole stage, staggered depths and speeds */}
      {PUFFS.map(([src, top, vw, delay, dur, tilt], i) => (
        <img
          key={i}
          src={src} alt=""
          className="absolute max-w-none select-none will-change-transform"
          style={{
            top: `${top}%`, width: `${vw}vw`, left: 0,
            transform: `translateX(${gust.dir === 1 ? '-120vw' : '120vw'}) rotate(${tilt}deg)`,
            animation: `${sweep} ${dur}ms cubic-bezier(0.45, 0, 0.25, 1) ${delay}ms both`,
            ['--tilt' as string]: `${tilt}deg`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}
