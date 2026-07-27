// The standing behaviour checks — the things you cannot see in a single screenshot.
// Each one measures instead of trusting the eye. Add a check here whenever a bug turns out
// to be invisible in a still frame.
//
//   node tools/checks.mjs
import fs from 'node:fs'
import {
  launch, openPage, ready, p05Luminance, contrast, hexLum, BASE, OUT, DEVICES,
} from './lib.mjs'

const browser = await launch()
const fail = []
const ok = (label, pass, detail) => {
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${label}  ${detail}`)
  if (!pass) fail.push(label)
}

// ---- hero: a still sky, and an h1 the cloud bank never climbs over ----
// Batch 3 replaced the cloud wordmark with the page's h1, so the old "bank is above the
// wordmark" check no longer has a subject. What matters now is the opposite: the bank must
// NOT reach the type, and the type must stay readable over whatever sky is behind it.
for (const dev of DEVICES) {
  const page = await openPage(browser, dev.w, dev.h, dev.mobile)
  await page.goto(`${BASE}/?jump=0`, { waitUntil: 'networkidle0' })
  await ready(page)
  const geo = await page.evaluate(() => {
    const h1 = document.querySelector('section[data-beat="hero"] h1')
    const sub = h1?.parentElement?.querySelector('p')
    const r = h1.getBoundingClientRect()
    const s = sub.getBoundingClientRect()
    return {
      still: !!document.querySelector('img[src*="hero-sky-still"]'),
      video: !!document.querySelector('video'),
      text: h1.textContent.trim(),
      top: Math.round(r.top), bottom: Math.round(Math.max(r.bottom, s.bottom)),
      x: Math.round(Math.min(r.left, s.left)), w: Math.round(Math.max(r.width, s.width)),
      vh: window.innerHeight,
    }
  })
  await page.screenshot({ path: `${OUT}/check-hero-${dev.id}.png` })
  ok(`hero ${dev.id} sky is a still`, geo.still && !geo.video, `still=${geo.still} video=${geo.video}`)

  // the copy has to sit in the clear upper half — below that the bank starts climbing
  ok(`hero ${dev.id} copy clears the cloud bank`, geo.bottom < geo.vh * 0.62,
     `copy ends at ${geo.bottom} of ${geo.vh} (${((geo.bottom / geo.vh) * 100).toFixed(0)}%)`)

  // ...and it has to be readable against whatever the sky is doing behind it. Hide the type
  // first, exactly as the footer check does — measuring WITH the text in frame just measures
  // the ink against itself and always returns 1.00:1.
  await page.evaluate(() => {
    const block = document.querySelector('section[data-beat="hero"] h1').parentElement
    block.style.visibility = 'hidden'
  })
  const band = await page.screenshot({
    clip: { x: Math.max(0, geo.x - 8), y: Math.max(0, geo.top - 6), width: Math.min(geo.w + 16, dev.w), height: (geo.bottom - geo.top) + 12 },
  })
  const ratio = contrast(hexLum('#16324F'), p05Luminance(band))
  ok(`hero ${dev.id} h1 clears AA over the sky`, ratio >= 4.5, `${ratio.toFixed(2)}:1 — "${geo.text}"`)
  await page.close()
}

// ---- nav: the DS mark opens without moving anything ----
{
  const page = await openPage(browser, 1440, 900)
  await page.goto(`${BASE}/?jump=0`, { waitUntil: 'networkidle0' })
  await ready(page)
  const read = () => page.evaluate(() => ({
    logo: document.querySelector('nav a[aria-label]').getBoundingClientRect().width,
    links: document.querySelector('nav div.hidden').getBoundingClientRect().left,
  }))
  const before = await read()
  await page.hover('nav a[aria-label]')
  await new Promise(r => setTimeout(r, 800))
  const after = await read()
  await page.screenshot({ path: `${OUT}/check-nav-hover.png` })
  ok('nav morph causes no reflow', Math.abs(after.links - before.links) < 0.5,
     `links ${before.links.toFixed(1)} -> ${after.links.toFixed(1)}, slot ${before.logo.toFixed(1)} -> ${after.logo.toFixed(1)}`)
  await page.close()
}

// ---- marquee: a true infinite loop is geometry, not timing ----
{
  const page = await openPage(browser, 1440, 900)
  await page.goto(`${BASE}/?jump=1500`, { waitUntil: 'networkidle0' })
  await ready(page)
  const rows = await page.evaluate(() =>
    [...document.querySelectorAll('.animate-marquee, .animate-marquee-reverse')].map(track => {
      const lefts = [...track.children].map(c => c.offsetLeft)
      const pitch = lefts.slice(1).map((l, i) => +(l - lefts[i]).toFixed(3))
      const half = lefts.length / 2
      return {
        cells: lefts.length,
        // the two halves must be pitch-for-pitch identical...
        identical: pitch.slice(0, half - 1).every((g, i) => Math.abs(g - pitch[half + i]) < 0.02),
        // ...and the half must be exactly half the track, or -50% lands mid-gap and jumps
        halfWidth: +(lefts[half] - lefts[0]).toFixed(2),
        trackHalf: +(track.scrollWidth / 2).toFixed(2),
      }
    }))
  rows.forEach((r, i) => ok(`marquee row ${i + 1} is seamless`,
    r.identical && Math.abs(r.halfWidth - r.trackHalf) < 0.6,
    `${r.cells} cells · halves identical ${r.identical} · ${r.halfWidth} vs ${r.trackHalf}`))
  await page.close()
}

// ---- the ground: the plain reveals once and never fades back out ----
{
  const page = await openPage(browser, 1440, 900)
  await page.goto(`${BASE}/?jump=0`, { waitUntil: 'networkidle0' })
  await ready(page)
  const series = await page.evaluate(async () => {
    const total = document.documentElement.scrollHeight - window.innerHeight
    const plain = document.querySelector('img[src*="landing-plain"]')
    const out = []
    for (const f of [0.6, 0.7, 0.8, 0.9, 1]) {
      window.scrollTo(0, Math.round(total * f))
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))
      out.push({ f, op: +(+getComputedStyle(plain).opacity).toFixed(2) })
    }
    return out
  })
  const peak = Math.max(...series.map(s => s.op))
  const monotone = series.every((s, i) => i === 0 || s.op >= series[i - 1].op - 0.01)
  ok('landing plain holds once revealed', peak > 0.99 && monotone,
     series.map(s => `${s.f}:${s.op}`).join(' '))
  ok('no stray contrail plate', !(await page.evaluate(() => !!document.querySelector('img[src*="B5-contrail"]'))), 'B5 absent')
  await page.close()
}

// ---- footer: ink over imagery still has to clear AA ----
{
  const page = await openPage(browser, 1440, 900)
  await page.goto(`${BASE}/?jump=0`, { waitUntil: 'networkidle0' })
  await ready(page)
  const total = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight)
  await page.goto(`${BASE}/?jump=${total}`, { waitUntil: 'networkidle0' })
  await ready(page)
  const box = await page.evaluate(() => {
    const f = document.querySelector('footer')
    f.querySelector(':scope > div.relative').style.visibility = 'hidden' // hide the type, keep the world
    const r = f.getBoundingClientRect()
    return { x: 0, y: Math.max(0, Math.round(r.top)), width: 1440, height: Math.round(Math.min(r.height, 900 - r.top)) }
  })
  const worst = p05Luminance(await page.screenshot({ clip: box }))
  const inkRatio = contrast(hexLum('#16324F'), worst)
  const linkRatio = contrast(hexLum('#1C4585'), worst)
  ok('footer ink clears AA over the world', inkRatio >= 4.5, `${inkRatio.toFixed(2)}:1 (darkest 5% behind the type)`)
  ok('footer link clears AA over the world', linkRatio >= 4.5, `${linkRatio.toFixed(2)}:1`)
  await page.close()
}

// ---- entrance: on time, and gone ----
// Budget raised 3.7s → 6.5s (batch 2, five held beats) → 10.5s (batch 4, where every puff now
// crossfades over a window longer than its own travel so nothing can blink in or out). Nick
// authorised the length explicitly: "doesnt matter if it takes even more time". The check
// still exists for the one thing that would be a bug — an entrance that never LEAVES.
{
  const page = await openPage(browser, 1440, 900)
  const t0 = Date.now()
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' })
  for (const t of [1200, 2200, 3200, 4200, 5200, 6200, 7000]) {
    const wait = t - (Date.now() - t0)
    if (wait > 0) await new Promise(r => setTimeout(r, wait))
    await page.screenshot({ path: `${OUT}/check-entrance-${t}.png` })
  }
  const wait = 10500 - (Date.now() - t0)
  if (wait > 0) await new Promise(r => setTimeout(r, wait))
  const gone = await page.evaluate(() => !document.querySelector('.fixed.z-\\[100\\]'))
  ok('entrance is finished inside 10.5s', gone, 'overlay unmounted')
  await page.close()
}

// ---- reduced motion: nothing may be left invisible ----
{
  const page = await openPage(browser, 1440, 900, false, 'reduce')
  const errors = []
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })
  await page.goto(`${BASE}/?jump=0`, { waitUntil: 'networkidle0' })
  await ready(page)
  const st = await page.evaluate(() => ({
    layers: [...document.querySelectorAll('main img')].map(i => ({
      src: i.getAttribute('src').split('/').pop(), op: +getComputedStyle(i).opacity })),
    video: !!document.querySelector('video'),
  }))
  const invisible = st.layers.filter(l => l.op < 0.05)
  ok('reduced motion renders every layer', invisible.length === 0,
     invisible.length ? invisible.map(l => l.src).join(', ') : `${st.layers.length} layers, all visible`)
  ok('reduced motion plays no video', !st.video, `video=${st.video}`)
  ok('no console errors', errors.length === 0, errors.join(' | ') || 'clean')
  await page.close()
}

// ---- the social card actually exists and actually resolves ----
// A relative og:image produces no preview on any platform, and that is exactly what shipped
// until 2026-07-27. This asserts both halves: absolute, and reachable from where it claims to
// be. At Stage 8 the host changes to dreamsign.rs — if the tag is not swapped, this fails.
{
  const page = await openPage(browser, 1200, 800)
  await page.goto(`${BASE}/?jump=0`, { waitUntil: 'networkidle0' })
  const meta = await page.evaluate(() => ({
    image: document.querySelector('meta[property="og:image"]')?.content ?? '',
    title: document.querySelector('meta[property="og:title"]')?.content ?? '',
    canonical: document.querySelector('link[rel="canonical"]')?.href ?? '',
    h1: document.querySelectorAll('h1').length,
    noAlt: [...document.querySelectorAll('img')].filter(i => !i.hasAttribute('alt')).length,
  }))
  const absolute = /^https?:\/\//.test(meta.image)
  ok('og:image is an absolute URL', absolute, meta.image || '(missing)')

  let reachable = false, note = 'not attempted (url not absolute)'
  if (absolute) {
    try {
      const res = await fetch(meta.image, { method: 'GET' })
      const buf = Buffer.from(await res.arrayBuffer())
      reachable = res.ok && buf.length > 5000
      note = `${res.status} · ${(buf.length / 1024).toFixed(1)} KB`
    } catch (e) { note = String(e.message || e) }
  }
  ok('og:image resolves to a real image', reachable, note)
  ok('og:title and canonical are present', !!meta.title && !!meta.canonical, meta.canonical || '(no canonical)')
  ok('exactly one h1', meta.h1 === 1, `${meta.h1} found`)
  ok('every image carries an alt attribute', meta.noAlt === 0, `${meta.noAlt} missing`)
  await page.close()
}

await browser.close()
console.log(`\n${fail.length ? fail.length + ' FAILED: ' + fail.join(', ') : 'all checks pass'} · shots -> ${OUT}`)
process.exitCode = fail.length ? 1 : 0
