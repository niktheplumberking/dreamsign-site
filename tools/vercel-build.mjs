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
import fs from 'node:fs'
import { execSync } from 'node:child_process'
import { install, resolveBuildId, detectBrowserPlatform, Browser } from '@puppeteer/browsers'
import path from 'node:path'

const run = (cmd, env = {}) => execSync(cmd, { stdio: 'inherit', env: { ...process.env, ...env } })

console.log('→ vite build')
run('npm run build')

// A browser that is already here beats one we download. GitHub's ubuntu runners ship Chrome at
// /usr/bin/google-chrome WITH its shared libraries, which is the whole reason the build runs there
// and not on Vercel's container: downloading chrome-headless-shell onto Vercel's builder succeeds
// and then refuses to launch — `libnspr4.so: cannot open shared object file` — and you cannot
// apt-get the libraries in, because there is no root and no apt.
let chrome = process.env.CHROME_PATH
if (chrome && fs.existsSync(chrome)) {
  console.log(`→ using the browser already present at ${chrome}`)
} else {
  const cacheDir = process.env.PUPPETEER_CACHE_DIR || path.join(process.env.TMPDIR || '/tmp', 'chrome')
  console.log(`→ no CHROME_PATH; installing chrome-headless-shell into ${cacheDir}`)
  const platform = detectBrowserPlatform()
  if (!platform) throw new Error('could not detect the browser platform for this builder')
  const buildId = await resolveBuildId(Browser.CHROMEHEADLESSSHELL, platform, 'stable')
  chrome = (await install({ browser: Browser.CHROMEHEADLESSSHELL, buildId, cacheDir })).executablePath
  console.log(`→ chrome-headless-shell ${buildId} at ${chrome}`)
}

console.log('→ prerender')
run('node tools/prerender.mjs', { CHROME_PATH: chrome })
console.log('→ build complete')
