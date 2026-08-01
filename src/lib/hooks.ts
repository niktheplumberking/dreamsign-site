import { useEffect, useState } from 'react'

export function useReducedMotionSafe() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const on = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return reduced
}

/** True exactly once per browser session (M09 session-skip law). */
export function sessionOnce(key: string): boolean {
  try {
    if (sessionStorage.getItem(key)) return false
    sessionStorage.setItem(key, '1')
    return true
  } catch {
    return true
  }
}

import { bk } from './content'

// The opener is an Owner's Key zone: the baked value feeds the link at build time.
// (A runtime edit reaches the link on the next publish — the link is a module constant.)
export const WA_LINK =
  'https://wa.me/381637736963?text=' +
  encodeURIComponent(bk('whatsapp-opener', 'Dobar dan, zanima me više informacija u vezi vaše ponude'))
