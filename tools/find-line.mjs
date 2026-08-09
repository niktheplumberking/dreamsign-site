// Which element is drawing that line? Hides every absolutely-positioned layer in turn and
// re-measures the band. The one whose removal drops the step is the culprit. This is how you
// tell a real seam from a feature painted inside an asset — never guess, kill-test it.
//
//   JUMP=573 node tools/find-line.mjs                  (390px by default)
//   W=1440 H=900 JUMP=2248 Y0=150 Y1=750 node tools/find-line.mjs
import { launch, openPage, ready, fullWidthStep, BASE } from './lib.mjs'

const W = +(process.env.W || 390)
const H = +(process.env.H || 844)
const JUMP = +(process.env.JUMP || Math.round(H / 2))
const Y0 = +(process.env.Y0 || 0)
const Y1 = +(process.env.Y1 || H)

const browser = await launch()
const page = await openPage(browser, W, H, W < 500)
await page.goto(`${BASE}${process.env.ROUTE || "/"}?jump=${JUMP}`, { waitUntil: 'networkidle0' })
await ready(page)

const count = await page.evaluate(() => {
  window.__layers = [...document.querySelectorAll('main *')].filter(el => {
    const cs = getComputedStyle(el)
    return cs.position === 'absolute' || cs.position === 'fixed'
  })
  return window.__layers.length
})

const base = fullWidthStep(await page.screenshot(), Y0, Y1)
console.log(`baseline step ${base.delta} at y=${base.y} · ${count} absolute layers · scanning ${Y0}-${Y1}`)

for (let i = 0; i < count; i++) {
  const info = await page.evaluate(idx => {
    const el = window.__layers[idx]
    el.dataset.prevVis = el.style.visibility
    el.style.visibility = 'hidden'
    const r = el.getBoundingClientRect()
    return {
      tag: el.tagName,
      what: el.getAttribute('src') || (el.className || '').toString().slice(0, 64),
      top: Math.round(r.top), h: Math.round(r.height),
    }
  }, i)
  await new Promise(r => setTimeout(r, 120))
  const s = fullWidthStep(await page.screenshot(), Y0, Y1)
  await page.evaluate(idx => {
    const el = window.__layers[idx]
    el.style.visibility = el.dataset.prevVis || ''
  }, i)
  if (s.delta < base.delta - 1) {
    console.log(`  CULPRIT  ${base.delta} -> ${s.delta}  ${info.tag} ${info.what}  (top ${info.top}, h ${info.h})`)
  }
}

await browser.close()
