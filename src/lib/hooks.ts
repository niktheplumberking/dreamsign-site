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

export const WA_LINK =
  'https://wa.me/381637736963?text=' +
  encodeURIComponent('Dobar dan, zanima me više informacija u vezi vaše ponude')
