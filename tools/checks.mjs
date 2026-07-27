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

// ---- hero: a still sky, and the bank closing over the wordmark ----
for (const dev of DEVICES) {
  const page = await openPage(browser, dev.w, dev.h, dev.mobile)
  await page.goto(`${BASE}/?jump=0`, { waitUntil: 'networkidle0' })
  await ready(page)
  const geo = await page.evaluate(() => {
    const word = document.querySelector('section[data-beat="hero"] img[src*="cloud-dream"]')
    const r = word.getBoundingClientRect()
    const bank = document.querySelector('img[src*="hero-bank-fade"]')
    return {
      still: !!document.querySelector('img[src*="hero-sky-still"]'),
      video: !!document.querySelector('video'),
      wordTop: Math.round(r.top), wordBottom: Math.round(r.bottom),
      bankZ: bank ? +getComputedStyle(bank).zIndex : null,
      wordZ: +getComputedStyle(word.closest('[class*="z-"]') || word).zIndex || null,
    }
  })
  await page.screenshot({ path: `${OUT}/check-hero-${dev.id}.png` })
  ok(`hero ${dev.id} sky is a still`, geo.still && !geo.video, `still=${geo.still} video=${geo.video}`)
  ok(`hero ${dev.id} bank is above the wordmark`, geo.bankZ > (geo.wordZ ?? 0), `bank z${geo.bankZ} vs word z${geo.wordZ}`)
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
// Budget raised from 3.7s to 6.5s deliberately (change batch 2): the entrance was re-timed
// into five held beats — mark in, hold, push, cover, reverse — because the old one read as
// one rushed 670ms event. The check still exists to catch an entrance that never LEAVES.
{
  const page = await openPage(browser, 1440, 900)
  const t0 = Date.now()
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' })
  for (const t of [1000, 1800, 2600, 3400, 4200, 5000]) {
    const wait = t - (Date.now() - t0)
    if (wait > 0) await new Promise(r => setTimeout(r, wait))
    await page.screenshot({ path: `${OUT}/check-entrance-${t}.png` })
  }
  const wait = 6500 - (Date.now() - t0)
  if (wait > 0) await new Promise(r => setTimeout(r, wait))
  const gone = await page.evaluate(() => !document.querySelector('.fixed.z-\\[100\\]'))
  ok('entrance is finished inside 6.5s', gone, 'overlay unmounted')
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

await browser.close()
console.log(`\n${fail.length ? fail.length + ' FAILED: ' + fail.join(', ') : 'all checks pass'} · shots -> ${OUT}`)
process.exitCode = fail.length ? 1 : 0
