// Re-runnable recipe for the social preview card (1200×630).
//
// It composes the card INSIDE the running site so it inherits the real self-hosted fonts,
// the real sky and the real cloud wordmark — no separate design file to drift out of sync.
// Re-run it whenever the wordmark or the sky asset changes:
//
//   npm run build && npx vite preview --port 5178 --strictPort
//   node tools/og-card.mjs
//
// Output: public/media/og-home.jpg
import fs from 'node:fs'
import path from 'node:path'
import { launch, openPage, ready, BASE } from './lib.mjs'

const OUT = path.resolve(import.meta.dirname ?? '.', '../public/media/og-home.jpg')

const browser = await launch()
const page = await openPage(browser, 1280, 800)
await page.goto(`${BASE}/?jump=0`, { waitUntil: 'networkidle0' })
await ready(page)

await page.evaluate(() => {
  const card = document.createElement('div')
  card.id = 'og-card'
  card.style.cssText = `
    position: fixed; left: 0; top: 0; width: 1200px; height: 630px; z-index: 99999;
    overflow: hidden; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 26px;
    background: #DCEBF8;`
  card.innerHTML = `
    <img src="/media/hero-sky-still.webp"
         style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover" />
    <img src="/media/hero-bank-fade.webp"
         style="position:absolute;left:0;right:0;bottom:-16%;width:100%;height:62%;
                object-fit:cover;object-position:bottom" />
    <div style="position:relative;display:flex;align-items:baseline;line-height:1;
                font-size:150px;white-space:nowrap">
      <img src="/media/brand/cloud-dream.webp"
           style="height:0.74em;width:auto;max-width:none;
                  filter:drop-shadow(0 2px 8px rgba(22,50,79,0.22))" />
      <span style="font-family:'Great Vibes',cursive;font-size:1.12em;margin-left:-0.11em;
                   line-height:1;padding:0.5em 0;margin-top:-0.5em;margin-bottom:-0.5em;
                   background-image:linear-gradient(to bottom,#16324F,#6FA5D8);
                   -webkit-background-clip:text;background-clip:text;color:transparent">Sign</span>
    </div>
    <p style="position:relative;margin:0;font-family:'Inter Tight',system-ui,sans-serif;
              font-weight:500;font-size:29px;color:#16324F;text-align:center;max-width:900px;
              text-shadow:0 2px 18px rgba(255,255,255,0.9)">
      Pravimo sajtove koji pretvaraju posetioce u kupce.
    </p>`
  document.body.appendChild(card)
})

await page.waitForFunction(() =>
  [...document.querySelectorAll('#og-card img')].every(i => i.complete && i.naturalWidth > 0))
await new Promise(r => setTimeout(r, 600))

const el = await page.$('#og-card')
await el.screenshot({ path: OUT, type: 'jpeg', quality: 90 })

const kb = (fs.statSync(OUT).size / 1024).toFixed(1)
console.log(`og-home.jpg written — 1200×630, ${kb} KB`)
await browser.close()
