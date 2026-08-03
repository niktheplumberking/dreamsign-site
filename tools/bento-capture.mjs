// Re-runnable recipe: the /radovi bento tiles are REAL captures of the three live client
// sites (real-content law — no stock, no placeholders). Different viewports + scroll
// offsets give each tile its own true crop of the site actually rendering.
//   node tools/bento-capture.mjs
// Output: public/media/radovi/bento/*.jpg (jpeg q80, each aspect matched to its tile seat)
import fs from 'node:fs'
import path from 'node:path'
import { launch } from './lib.mjs'

const OUT = path.resolve(import.meta.dirname, '../public/media/radovi/bento')
fs.mkdirSync(OUT, { recursive: true })

const SHOTS = [
  // Bennett & Co — 2-col bento (short / tall + two mediums)
  { url: 'https://www.bennettndco.com', out: 'bennett-1.jpg', w: 1100, h: 460, y: 0 },
  { url: 'https://www.bennettndco.com', out: 'bennett-2.jpg', w: 800, h: 950, y: 1900 },
  { url: 'https://www.bennettndco.com', out: 'bennett-3.jpg', w: 800, h: 900, y: 3400 },
  { url: 'https://www.bennettndco.com', out: 'bennett-4.jpg', w: 800, h: 950, y: 5200 },
  // Metal Kolor — 3 wide cards
  { url: 'https://metal-kolor.rs/', out: 'metalkolor-1.jpg', w: 980, h: 880, y: 0 },
  { url: 'https://metal-kolor.rs/', out: 'metalkolor-2.jpg', w: 980, h: 880, y: 950 },
  { url: 'https://metal-kolor.rs/', out: 'metalkolor-3.jpg', w: 980, h: 880, y: 2000 },
  // Pizzdarija — two edge columns of small/big/small
  { url: 'https://www.pizzdarija.rs/', out: 'pizzdarija-1.jpg', w: 980, h: 460, y: 0 },
  { url: 'https://www.pizzdarija.rs/', out: 'pizzdarija-2.jpg', w: 800, h: 950, y: 700 },
  { url: 'https://www.pizzdarija.rs/', out: 'pizzdarija-3.jpg', w: 980, h: 460, y: 1700 },
  { url: 'https://www.pizzdarija.rs/', out: 'pizzdarija-4.jpg', w: 980, h: 460, y: 400 },
  { url: 'https://www.pizzdarija.rs/', out: 'pizzdarija-5.jpg', w: 800, h: 950, y: 2000 },
  { url: 'https://www.pizzdarija.rs/', out: 'pizzdarija-6.jpg', w: 980, h: 460, y: 2700 },
]

const browser = await launch()
for (const s of SHOTS) {
  const page = await browser.newPage()
  await page.setViewport({ width: s.w, height: s.h, deviceScaleFactor: 1 })
  try {
    await page.goto(s.url, { waitUntil: 'networkidle2', timeout: 45000 })
  } catch { /* late trackers must not kill the shot — capture what rendered */ }
  await new Promise((r) => setTimeout(r, 1800))
  // land the offset (their sites own their scroll; plain scrollTo is enough)
  const max = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight)
  await page.evaluate((yy) => window.scrollTo(0, yy), Math.min(s.y, Math.max(0, max)))
  await new Promise((r) => setTimeout(r, 1600))
  await page.screenshot({ path: path.join(OUT, s.out), type: 'jpeg', quality: 80 })
  const kb = (fs.statSync(path.join(OUT, s.out)).size / 1024).toFixed(0)
  console.log(`${s.out.padEnd(18)} ${s.w}x${s.h} @y${s.y}  ${kb}KB`)
  await page.close()
}
await browser.close()
console.log('bento captures ->', OUT)
