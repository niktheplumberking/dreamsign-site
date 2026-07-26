// EYES — the junction pass. Reads every seam out of the DOM (data-beat), parks it at the
// centre of the viewport, shoots desktop + 390px, scores each one, then runs the jank meter.
// A visible section line is a fail (Nick's law).
//
//   node tools/eyes-junctions.mjs
//   TAG=r2 BASE=https://dreamsign-preview.vercel.app node tools/eyes-junctions.mjs
import fs from 'node:fs'
import { launch, openPage, ready, beats, fullWidthStep, verdict, bandHex, jank, BASE, OUT, DEVICES } from './lib.mjs'

const TAG = process.env.TAG || 'r1'
const browser = await launch()
const report = []

for (const dev of DEVICES) {
  const page = await openPage(browser, dev.w, dev.h, dev.mobile)
  await page.goto(`${BASE}/?jump=0`, { waitUntil: 'networkidle0' })
  await ready(page)

  const b = await beats(page)
  console.log(`\n=== ${dev.id} — page ${b.page}px / viewport ${b.vh} ===`)
  b.list.forEach(x => console.log(`   ${x.name.padEnd(9)} top ${String(x.top).padStart(5)}  h ${x.height}`))

  const hero = b.list.find(x => x.name === 'hero')
  const heroEdge = hero.top + hero.height
  const sample = await page.screenshot({ clip: { x: 0, y: heroEdge - 60, width: dev.w, height: 60 } })
  console.log(`   hero bottom edge (as composited) -> ${bandHex(sample, 40, 60)}`)

  const junctions = b.list.slice(1).map((beat, i) => ({
    name: `${b.list[i].name}->${beat.name}`,
    y: i === 0 ? heroEdge : beat.top,
  }))

  for (const j of junctions) {
    const target = Math.max(0, Math.round(j.y - dev.h / 2))
    await page.goto(`${BASE}/?jump=${target}`, { waitUntil: 'networkidle0' })
    await ready(page)
    const buf = await page.screenshot()
    const file = `${OUT}/${TAG}-${dev.id}-${j.name.replace(/[^a-z]+/gi, '-')}.png`
    fs.writeFileSync(file, buf)
    // the 25vh hero overlap means the seam's effects reach well past the centre line
    const mid = Math.round(dev.h / 2)
    const scan = fullWidthStep(buf, mid - 300, mid + 300)
    const v = verdict(scan.delta)
    report.push({ dev: dev.id, junction: j.name, y: j.y, step: scan.delta, at: scan.y, verdict: v, file })
    console.log(`   ${j.name.padEnd(20)} y=${String(j.y).padStart(5)}  fullWidthStep ${String(scan.delta).padStart(5)}  ${v}`)
  }

  await page.goto(`${BASE}/?jump=0`, { waitUntil: 'networkidle0' })
  await ready(page)
  await page.screenshot({ path: `${OUT}/${TAG}-${dev.id}-fullpage.png`, fullPage: true })
  await page.close()
}

{
  const page = await openPage(browser, 1440, 900)
  const errors = []
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })
  page.on('pageerror', e => errors.push('pageerror: ' + e.message))
  await page.goto(`${BASE}/?jump=0`, { waitUntil: 'networkidle0' })
  await ready(page)
  const j = await jank(page)
  console.log(`\n=== jank: p95 ${j.p95}ms · max ${j.max}ms · ${j.verdict} (law <50ms) ===`)
  console.log(`=== console errors: ${errors.length ? errors.join(' | ') : 'none'} ===`)
  report.push({ jank: j, consoleErrors: errors })
  await page.close()
}

fs.writeFileSync(`${OUT}/${TAG}-report.json`, JSON.stringify(report, null, 2))
await browser.close()
const fails = report.filter(r => r.verdict === 'FAIL').length
console.log(`\n${fails} FAIL · shots -> ${OUT}`)
