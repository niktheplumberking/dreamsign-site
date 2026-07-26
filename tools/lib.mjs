// Shared plumbing for the Eyes tools. No deps of its own: it borrows puppeteer-core and
// pngjs from wherever they already exist on this machine (factory root first).
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

const CANDIDATES = [
  process.env.WFACT_MODULES,
  path.resolve(process.cwd(), 'node_modules'),
  'C:/Users/nicol/OneDrive/Desktop/dreamsign-factory/node_modules',
  path.resolve(import.meta.dirname ?? '.', '../../../../node_modules'),
].filter(Boolean)

function borrow(name) {
  for (const base of CANDIDATES) {
    const p = path.join(base, name)
    if (fs.existsSync(p)) return require(p)
  }
  try { return require(name) } catch { /* fall through */ }
  throw new Error(`cannot find ${name}. Set WFACT_MODULES to a node_modules folder that has it, or npm i -D ${name}`)
}

export const puppeteer = borrow('puppeteer-core')
export const { PNG } = borrow('pngjs')

export const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe'
export const BASE = process.env.BASE || 'http://localhost:5178'
export const OUT = process.env.EYES_OUT || path.resolve(import.meta.dirname ?? '.', '../.eyes')
fs.mkdirSync(OUT, { recursive: true })

export const DEVICES = [
  { id: 'desk', w: 1440, h: 900, mobile: false },
  { id: 'mob', w: 390, h: 844, mobile: true },
]

export async function launch() {
  return puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required', '--force-device-scale-factor=1'],
  })
}

/** a page with motion FORCED ON — headless Chrome reports prefers-reduced-motion: reduce */
export async function openPage(browser, w, h, mobile = false, motion = 'no-preference') {
  const page = await browser.newPage()
  await page.setViewport({ width: w, height: h, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile })
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: motion }])
  return page
}

/** the site's dev contract: ?jump=<y> lands the scroll, window.__ready flips when settled */
export async function ready(page, settle = 800) {
  await page.waitForFunction('window.__ready === true', { timeout: 20000 })
  await new Promise(r => setTimeout(r, settle))
}

export async function beats(page) {
  return page.evaluate(() => {
    const list = []
    document.querySelectorAll('[data-beat]').forEach(el => {
      const r = el.getBoundingClientRect()
      list.push({ name: el.dataset.beat, top: Math.round(r.top + window.scrollY), height: Math.round(r.height) })
    })
    return { list, page: document.documentElement.scrollHeight, vh: window.innerHeight }
  })
}

/**
 * A section line is a sharp step that runs the FULL width. Metric: for each row, the MEDIAN
 * across x of |row(y) - row(y-1)|. Text edges move only some columns; a line moves them all.
 * Scale is 0-255. Under 4 passes, 4-8 is a watch, 8 or over fails.
 */
export function fullWidthStep(buf, y0, y1) {
  const png = PNG.sync.read(buf)
  const d = new Float64Array(Math.ceil(png.width / 2))
  let worst = 0, worstY = 0
  for (let y = Math.max(1, y0); y < Math.min(png.height, y1); y++) {
    let n = 0
    for (let x = 0; x < png.width; x += 2) {
      const a = (png.width * y + x) << 2, b = (png.width * (y - 1) + x) << 2
      d[n++] = Math.max(
        Math.abs(png.data[a] - png.data[b]),
        Math.abs(png.data[a + 1] - png.data[b + 1]),
        Math.abs(png.data[a + 2] - png.data[b + 2]),
      )
    }
    const row = Array.from(d.slice(0, n)).sort((p, q) => p - q)
    const med = row[Math.floor(n / 2)]
    if (med > worst) { worst = med; worstY = y }
  }
  return { delta: +worst.toFixed(2), y: worstY }
}

export const verdict = d => (d < 4 ? 'PASS' : d < 8 ? 'WATCH' : 'FAIL')

/** average hex of a horizontal band — used to sample a seam colour off the render */
export function bandHex(buf, y0, y1) {
  const png = PNG.sync.read(buf)
  let r = 0, g = 0, b = 0, n = 0
  for (let y = Math.max(0, y0); y < Math.min(png.height, y1); y++) {
    for (let x = 0; x < png.width; x += 4) {
      const i = (png.width * y + x) << 2
      r += png.data[i]; g += png.data[i + 1]; b += png.data[i + 2]; n++
    }
  }
  const h = v => Math.round(v / n).toString(16).padStart(2, '0')
  return ('#' + h(r) + h(g) + h(b)).toUpperCase()
}

export const luminance = (r, g, b) => {
  const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4) }
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}
export const contrast = (l1, l2) => (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
export const hexLum = hex => luminance(
  parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16))

/** darkest 5% luminance of a screenshot region — the honest worst case behind text */
export function p05Luminance(buf) {
  const png = PNG.sync.read(buf)
  const l = []
  for (let y = 0; y < png.height; y += 2) for (let x = 0; x < png.width; x += 4) {
    const i = (png.width * y + x) << 2
    l.push(luminance(png.data[i], png.data[i + 1], png.data[i + 2]))
  }
  l.sort((a, b) => a - b)
  return l[Math.floor(l.length * 0.05)]
}

/** real scroll through the whole page, frame times sampled — law: max frame < 50ms */
export async function jank(page, steps = 60) {
  const frames = await page.evaluate(async n => {
    const times = []
    let last = performance.now(), raf = 0
    const tick = () => { const t = performance.now(); times.push(t - last); last = t; raf = requestAnimationFrame(tick) }
    raf = requestAnimationFrame(tick)
    const total = document.documentElement.scrollHeight - window.innerHeight
    for (let i = 0; i <= n; i++) {
      window.scrollTo(0, Math.round((total * i) / n))
      await new Promise(r => setTimeout(r, 60))
    }
    cancelAnimationFrame(raf)
    return times.slice(3)
  }, steps)
  frames.sort((a, b) => a - b)
  const p95 = frames[Math.floor(frames.length * 0.95)]
  const max = frames[frames.length - 1]
  return { p95: +p95.toFixed(1), max: +max.toFixed(1), verdict: max < 50 ? 'PASS' : 'FAIL' }
}
