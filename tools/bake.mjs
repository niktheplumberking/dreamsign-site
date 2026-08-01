// Site-side bake wrapper: runs the factory rig's bake (block values -> the build), then
// stamps the Supabase coordinates from the FACTORY .env into the generated JSON so the
// runtime provider and the bundle never hardcode them by hand.
//   node tools/bake.mjs
// Runs at the desk (the .env lives in the factory root, never in this repo). The anon key
// is public by design (RLS is the wall) — the service key is never read here beyond what
// the rig bake itself needs.
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const SITE = path.resolve(import.meta.dirname, '..')
const FACTORY = path.resolve(SITE, '../../..')
const OUT = path.join(SITE, 'src/content.generated.json')

execFileSync('node', [path.join(FACTORY, 'rig/owners-key/bake.mjs'), 'dreamsign', OUT], { stdio: 'inherit' })

const env = {}
for (const l of fs.readFileSync(path.join(FACTORY, '.env'), 'utf8').split('\n')) {
  const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '')
}

const j = JSON.parse(fs.readFileSync(OUT, 'utf8'))
j.supabaseUrl = env.SUPABASE_URL || ''
j.supabaseAnonKey = env.SUPABASE_ANON_KEY || '' // empty until Nick copies it from the dashboard
fs.writeFileSync(OUT, JSON.stringify(j, null, 2))
console.log(`supabase coordinates stamped (anon key ${j.supabaseAnonKey ? 'present' : 'ABSENT — editing stays off'})`)
