// The baked content — the SEO half of the Owner's Key. `bk(key, fallback)` returns the
// client's current value from src/content.generated.json (written by tools/bake.mjs, which
// runs the factory rig's bake before every deploy), so the words live in the built HTML.
// The runtime provider patches anything newer than the build; a crawler never needs it.
//
// The fallback is the component's own hardcoded copy — if a key is ever missing from a
// bake, the site renders the approved words, never a hole.
import generated from '../content.generated.json'

type Baked = {
  slug: string
  siteId: string
  bakedAt: string
  blocks: Record<string, string>
  supabaseUrl?: string
  supabaseAnonKey?: string
}
const baked = generated as Baked

export const SITE_SLUG = baked.slug

export function bk(key: string, fallback: string): string {
  const v = baked.blocks[key]
  return v !== undefined && v !== '' && v !== `[${key}]` ? v : fallback
}

/** Supabase coordinates for the runtime provider — stamped by tools/bake.mjs from the
    factory .env, never hand-typed. Both are public by nature (RLS is the wall); until the
    anon key lands in the factory .env the provider stays off and the site simply serves
    the baked words. Editing waits; rendering never does. */
export const SUPABASE_URL = baked.supabaseUrl ?? ''
export const SUPABASE_ANON_KEY = baked.supabaseAnonKey ?? ''
export const OK_ENABLED = SUPABASE_URL !== '' && SUPABASE_ANON_KEY !== ''
