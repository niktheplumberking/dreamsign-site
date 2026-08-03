// PRERENDER — the view-source law (Stage 6): every route's body copy must land in the
// static HTML the host serves, not only in a runtime render. Runs AFTER vite build; serves
// dist, opens each route in real Chrome, lets the page settle, walks the scroll once so
// every whileInView-once reveal completes, returns to the top, and snapshots the DOM.
// The client bundle re-renders over the snapshot on load (createRoot replaces children) —
// the snapshot is for crawlers, view-source and the first paint.
//
// FAILS LOUDLY when Chrome is missing: a deploy without prerendered HTML silently breaks
// the Stage 7 gate, so there is no graceful skip. Deploy flow: `vercel build` locally
// (buildCommand in vercel.json runs this script) + `vercel deploy --prebuilt`.
import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { launch, openPage } from './lib.mjs'

const DIST = path.resolve(import.meta.dirname, '../dist')
const PORT = 5181

const ROUTES = [
  { path: '/', out: 'index.html' },
  { path: '/radovi', out: 'radovi/index.html' },
  { path: '/usluge', out: 'usluge/index.html' },
  { path: '/kontakt', out: 'kontakt/index.html' },
  // any unknown path renders the router's catch-all — snapshot it as the host's 404 page
  { path: '/ova-stranica-ne-postoji', out: '404.html' },
  // the Owner's Key edit twins: static hosting must serve these URLs; noindexed by the
  // meta hook, disallowed in robots.txt
  { path: '/edit', out: 'edit/index.html' },
  { path: '/edit/radovi', out: 'edit/radovi/index.html' },
  { path: '/edit/usluge', out: 'edit/usluge/index.html' },
  { path: '/edit/kontakt', out: 'edit/kontakt/index.html' },
]

/** every prerendered page must contain these strings or the run fails — copy in the HTML
    is the entire point. One distinctive sentence per route, from the story map. */
const PROOF = {
  '/': 'Izrada sajtova',
  '/radovi': 'Kompletan identitet i korporativni sajt',
  '/usluge': 'jedan tim, jedan potpis',
  '/kontakt': 'Dva klika i razgovaramo',
  '/ova-stranica-ne-postoji': 'Stranica nije pronađena',
  '/edit': 'Izrada sajtova',
  '/edit/radovi': 'Kompletan identitet i korporativni sajt',
  '/edit/usluge': 'jedan tim, jedan potpis',
  '/edit/kontakt': 'Dva klika i razgovaramo',
}

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.glb': 'model/gltf-binary', '.json': 'application/json',
}

function serve() {
  const server = http.createServer((req, res) => {
    const url = decodeURIComponent(new URL(req.url, 'http://x').pathname)
    let file = path.join(DIST, url)
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      const idx = path.join(file, 'index.html')
      file = fs.existsSync(idx) ? idx : path.join(DIST, 'index.html') // SPA fallback
    }
    res.writeHead(200, { 'content-type': MIME[path.extname(file)] ?? 'application/octet-stream' })
    fs.createReadStream(file).pipe(res)
  })
  return new Promise((ok) => server.listen(PORT, () => ok(server)))
}

const server = await serve()
const browser = await launch()
const page = await openPage(browser, 1440, 900)

let failed = false
for (const r of ROUTES) {
  await page.goto(`http://localhost:${PORT}${r.path}?jump=0`, { waitUntil: 'networkidle2' })
  await page.waitForFunction('window.__ready === true', { timeout: 20000 })

  // walk the page so every whileInView-once reveal fires and settles at its final state,
  // then come home — the snapshot is the top-of-page view with all copy at rest
  await page.evaluate(async () => {
    const total = document.documentElement.scrollHeight - window.innerHeight
    for (let i = 0; i <= 12; i++) {
      window.scrollTo(0, Math.round((total * i) / 12))
      await new Promise((res) => setTimeout(res, 90))
    }
    await new Promise((res) => setTimeout(res, 700))
    window.scrollTo(0, 0)
  })
  await new Promise((res) => setTimeout(res, 900))

  const html = await page.evaluate(() => {
    // vite injects modulepreload links AT RUNTIME when a lazy chunk (three.js) loads during
    // the scroll walk — with ABSOLUTE hrefs on the prerender server's origin. Serialized,
    // they would 404 (or preload 695KB eagerly) on the real host. The lazy chunks are lazy
    // on purpose: strip every runtime-injected absolute link instead of rewriting it.
    document.querySelectorAll('link[href^="http://localhost"]').forEach((l) => l.remove())
    return '<!doctype html>\n' + document.documentElement.outerHTML
  })

  const proof = PROOF[r.path]
  if (!html.includes(proof)) {
    console.error(`FAIL ${r.path} — proof string missing from snapshot: "${proof}"`)
    failed = true
    continue
  }
  const out = path.join(DIST, r.out)
  fs.mkdirSync(path.dirname(out), { recursive: true })
  fs.writeFileSync(out, html)
  console.log(`ok  ${r.path}  ->  ${r.out}  (${(html.length / 1024).toFixed(0)}KB, proof: "${proof}")`)
}

await browser.close()
server.close()
if (failed) process.exit(1)
console.log('prerender complete — body copy is in the HTML on every route')
