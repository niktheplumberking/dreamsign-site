// THE BUILD, RUN ON VERCEL'S BUILDER — vite, then a real browser, then prerender.
//
// WHY THIS FILE EXISTS. Until now this project deployed with `vercel build` locally plus
// `vercel deploy --prebuilt`: the bytes that went live came from someone's working directory,
// which meant what was serving had never necessarily existed as a commit. Connecting the repo to
// Vercel fixes that — every deploy is a commit — but it moves the build onto Vercel's container,
// and prerender.mjs needs real Chrome to walk each route and snapshot the DOM. The container has
// no Chrome, so the first git-driven deploy failed.
//
// So the build installs its own browser. chrome-headless-shell rather than full Chrome: it is a
// fraction of the download, and this job only ever loads a page and reads the DOM.
//
// NO GRACEFUL SKIP. prerender.mjs says it in its own header and it is right: a deploy without
// prerendered HTML passes every smoke test and silently breaks the view-source law, which is the
// entire SEO promise. If the browser cannot be installed or cannot launch, this build FAILS.
import { execSync } from 'node:child_process'
import { install, resolveBuildId, detectBrowserPlatform, Browser } from '@puppeteer/browsers'
import path from 'node:path'

const run = (cmd, env = {}) => execSync(cmd, { stdio: 'inherit', env: { ...process.env, ...env } })

console.log('→ vite build')
run('npm run build')

// Vercel's builder gives us a writable /tmp; the cache directory persists within a single build.
const cacheDir = process.env.PUPPETEER_CACHE_DIR || path.join(process.env.TMPDIR || '/tmp', 'chrome')
console.log(`→ installing chrome-headless-shell into ${cacheDir}`)
const platform = detectBrowserPlatform()
if (!platform) throw new Error('could not detect the browser platform for this builder')
const buildId = await resolveBuildId(Browser.CHROMEHEADLESSSHELL, platform, 'stable')
const installed = await install({ browser: Browser.CHROMEHEADLESSSHELL, buildId, cacheDir })
console.log(`→ chrome-headless-shell ${buildId} at ${installed.executablePath}`)

console.log('→ prerender')
run('node tools/prerender.mjs', { CHROME_PATH: installed.executablePath })
console.log('→ build complete')
