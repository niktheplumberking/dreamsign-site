// THE SHELL (Stage 6): router, nav, entrance, and the one smoothing law. Each page owns its
// own World (one useScroll per page — the one-descent law holds per route); the shell owns
// everything that must survive navigation: Lenis, the Eyes dev contract, the session-once
// entrance. Inner arrivals get no overlay — the M09 entrance plays ONCE per session sitewide.
import { useEffect, useRef, useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import Entrance, { ENTRANCE_MS } from './components/Entrance'
import Nav from './components/Nav'
import PageVeil from './components/PageVeil'
import Pocetna from './pages/Pocetna'
import RadoviPage from './pages/RadoviPage'
import UslugePage from './pages/UslugePage'
import KontaktPage from './pages/KontaktPage'
import NotFound from './pages/NotFound'
import PolitikaPrivatnosti from './pages/PolitikaPrivatnosti'
import UsloviKoriscenja from './pages/UsloviKoriscenja'
import { sessionOnce, useReducedMotionSafe } from './lib/hooks'
import { OK_ENABLED, SITE_SLUG, SUPABASE_URL, SUPABASE_ANON_KEY } from './lib/content'
import { OwnersKeyProvider, OwnersKeyLogin, OwnersKeyBar } from './ok/OwnersKey'
import './ok/owners-key.css'

declare global {
  interface Window { __ready?: boolean }
}

const jumpParam = new URLSearchParams(window.location.search).get('jump')
// Module scope: StrictMode double-mounts components — the session flag must burn exactly once.
const PLAY_ENTRANCE = !jumpParam && sessionOnce('ds_entered')

/** client-side navigation lands every page at its top, instantly — no animated catch-up */
function ScrollReset({ lenis }: { lenis: React.RefObject<Lenis | null> }) {
  const { pathname } = useLocation()
  const first = useRef(true)
  useEffect(() => {
    if (first.current) { first.current = false; return } // the initial load keeps ?jump
    window.scrollTo(0, 0)
    lenis.current?.scrollTo(0, { immediate: true })
  }, [pathname, lenis])
  return null
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

  const routes = (
    <Routes>
      <Route path="/" element={<Pocetna />} />
      <Route path="/radovi" element={<RadoviPage />} />
      <Route path="/usluge" element={<UslugePage />} />
      <Route path="/kontakt" element={<KontaktPage />} />
      {/* batch 59 (owner): the two legal documents are PAGES of this site now, not two loose
          .html files in public/ with their own stylesheet. Same nav, same footer, same gust
          on the way in — the old /politika-privatnosti.html and /uslovi-koriscenja.html
          addresses 301 to these (vercel.json), because both were already published. */}
      <Route path="/politika-privatnosti" element={<PolitikaPrivatnosti />} />
      <Route path="/uslovi-koriscenja" element={<UsloviKoriscenja />} />
      {/* the Owner's Key: each page has its edit twin — same components, edit affordances.
          The site IS the panel (owners-key-sop). Never prerendered as indexable: usePageMeta
          stamps noindex on every /edit path, and robots.txt disallows it. */}
      <Route path="/edit" element={<Pocetna />} />
      <Route path="/edit/radovi" element={<RadoviPage />} />
      <Route path="/edit/usluge" element={<UslugePage />} />
      <Route path="/edit/kontakt" element={<KontaktPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )

  const isEdit = window.location.pathname.startsWith('/edit')

  return (
    <BrowserRouter>
      <Entrance play={playEntrance && !reduced} onDone={() => {}} />
      <Nav />
      {/* batch 22: every internal click crosses the sky — the cloud gust veil */}
      <PageVeil />
      <ScrollReset lenis={lenisRef} />
      {OK_ENABLED ? (
        <OwnersKeyProvider slug={SITE_SLUG} supabaseUrl={SUPABASE_URL} supabaseAnonKey={SUPABASE_ANON_KEY}>
          <OwnersKeyLogin />
          <OwnersKeyBar />
          {routes}
        </OwnersKeyProvider>
      ) : (
        <>
          {/* editing is wired but the anon key has not landed in the factory .env yet —
              the baked words render either way; only the editing surface waits */}
          {isEdit && (
            <div className="fixed bottom-4 left-1/2 z-[90] -translate-x-1/2 rounded-full bg-ink/90 px-5 py-2 text-[13px] font-medium text-white shadow-lg">
              Uređivanje još nije uključeno — sajt prikazuje sačuvani sadržaj.
            </div>
          )}
          {routes}
        </>
      )}
    </BrowserRouter>
  )
}
