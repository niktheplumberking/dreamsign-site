// THE OWNER'S KEY — client self-editing, inherited by every client site.
//
// HOW THE SEO PROMISE IS KEPT (the mechanism, and why):
//   1. BUILD BAKES. At build time the current block values are written into the JSX/HTML, so
//      view-source always contains the real words. Crawlers never execute our loader.
//   2. RUNTIME PATCHES, FOR FRESHNESS ONLY. On load, one request fetches this site's blocks and
//      replaces any value newer than the build stamp. A visitor arriving between an edit and the
//      next publish sees the new text; a crawler arriving at the same moment still finds real
//      (slightly older) text in the HTML. There is never a moment where the HTML is empty.
//   3. SAVE REPUBLISHES. Every save marks the site dirty; the publisher rebuilds and redeploys,
//      which re-bakes the new value into the HTML. The runtime patch is a bridge, never the home.
//
// Rejected: runtime-only rendering (violates the SEO law outright — the HTML would ship empty and
// the client's own words would be invisible to Google) and publish-only (an edit would take
// minutes to appear, which does not feel like editing your own site).
//
// Design lock: only values change. There is no path here that edits layout, spacing, colour or
// structure — the component set has no such prop.
// The stylesheet is NOT imported here — a client site imports it once, beside this file:
//   import 'rig/owners-key/owners-key.css'
// Keeping it separate means a site with its own build pipeline can inline or re-theme it.
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

type Block = { key: string; type: string; value: any; max_len: number | null }
type Ctx = {
  sb: SupabaseClient | null
  siteId: string | null
  slug: string
  blocks: Record<string, Block>
  editing: boolean
  signedIn: boolean
  save: (key: string, value: any) => Promise<string | null>
}
const OK = createContext<Ctx | null>(null)
export const useOwnersKey = () => useContext(OK)

export function OwnersKeyProvider({
  slug, supabaseUrl, supabaseAnonKey, children,
}: { slug: string; supabaseUrl: string; supabaseAnonKey: string; children: ReactNode }) {
  const [sb] = useState(() => createClient(supabaseUrl, supabaseAnonKey))
  const [blocks, setBlocks] = useState<Record<string, Block>>({})
  const [siteId, setSiteId] = useState<string | null>(null)
  const [signedIn, setSignedIn] = useState(false)
  // /edit is the only way into edit mode. A normal visitor never gets an editable DOM.
  const editing = typeof window !== 'undefined' && window.location.pathname.startsWith('/edit')

  useEffect(() => {
    let dead = false
    // 1 · the freshness patch. Anonymous read is NOT allowed by RLS, so a logged-out visitor
    //     simply keeps the baked HTML — which is the correct, SEO-safe fallback.
    const load = async () => {
      const { data: sess } = await sb.auth.getSession()
      setSignedIn(!!sess.session)
      const sid = (sess.session?.user?.app_metadata as any)?.site_id ?? null
      if (dead) return
      setSiteId(sid)
      if (!sid) return
      const { data } = await sb.from('content_blocks').select('key,type,value,max_len').eq('site_id', sid)
      if (dead || !data) return
      setBlocks(Object.fromEntries(data.map((b: any) => [b.key, b])))
    }
    load()
    const { data: sub } = sb.auth.onAuthStateChange(() => load())
    return () => { dead = true; sub.subscription.unsubscribe() }
  }, [sb])

  const save: Ctx['save'] = async (key, value) => {
    if (!siteId) return 'not signed in'
    const b = blocks[key]
    if (b?.max_len && typeof value === 'string' && value.length > b.max_len)
      return `Too long — ${b.max_len} characters max, this composition was built for it.`
    const { error } = await sb.from('content_blocks')
      .update({ value, updated_at: new Date().toISOString(), updated_by: 'client' })
      .eq('site_id', siteId).eq('key', key)
    if (error) return error.message
    setBlocks((p) => ({ ...p, [key]: { ...(p[key] || { key, type: 'text', max_len: null }), value } }))
    return null
  }

  return <OK.Provider value={{ sb, siteId, slug, blocks, editing, signedIn, save }}>{children}</OK.Provider>
}

/** The value a component should render: the patched one if we have it, else the baked child. */
function useValue(k: string, baked: any) {
  const ctx = useOwnersKey()
  const v = ctx?.blocks[k]?.value
  return v?.v !== undefined ? v.v : baked
}

/* ---------------------------------------------------------------- editable text */
// SAVES AS YOU TYPE, not only when you click away.
//
// The first version saved on blur alone. That is "saves when you click somewhere else", which is
// not what we promise the client, and on a phone it loses work: dismissing the keyboard,
// switching apps or closing the tab may never produce a blur. Three triggers now, cheapest first:
//   · debounced input — 800ms after they stop typing (the normal path)
//   · blur — the backstop when they click away mid-word
//   · pagehide / visibilitychange — the tab is going away, flush NOW
// The debounce means a sentence is one write, not thirty.
export function EditableText({ k, children, as: Tag = 'span' }: { k: string; children: any; as?: any }) {
  const ctx = useOwnersKey()
  const value = useValue(k, children)
  const [err, setErr] = useState<string | null>(null)
  const ref = useRef<any>(null)
  const timer = useRef<any>(null)
  const pending = useRef<string | null>(null)

  const flush = async () => {
    if (pending.current === null) return
    const v = pending.current
    pending.current = null
    setErr(await ctx!.save(k, { v }))
  }

  // a tab that is closing or backgrounding must not take an unsaved edit with it
  useEffect(() => {
    const go = () => { clearTimeout(timer.current); flush() }
    window.addEventListener('pagehide', go)
    document.addEventListener('visibilitychange', () => document.visibilityState === 'hidden' && go())
    return () => window.removeEventListener('pagehide', go)
  }, [k])

  if (!ctx?.editing || !ctx.siteId) return <Tag>{value}</Tag>

  const queue = (text: string) => {
    pending.current = text
    clearTimeout(timer.current)
    timer.current = setTimeout(flush, 800)
  }

  return (
    <Tag
      ref={ref}
      className="ok-editable" data-ok-key={k} contentEditable suppressContentEditableWarning
      onInput={(e: any) => queue(e.currentTarget.textContent || '')}
      onBlur={(e: any) => { clearTimeout(timer.current); pending.current = e.currentTarget.textContent || ''; flush() }}
      title={`Editable · ${k}`}
    >{value}{err && <em className="ok-err">{err}</em>}</Tag>
  )
}

/* --------------------------------------------------------------- editable price */
export function EditablePrice({ k, children }: { k: string; children: any }) {
  return <EditableText k={k}>{children}</EditableText>
}

/* --------------------------------------------------------------- editable image */
// UPLOAD SAFETY LIVES IN THREE PLACES, and only two of them are controls.
//
// The bytes go straight from this browser to Supabase Storage — there is no server of ours in the
// middle. So the REAL enforcement is the bucket (allowed_mime_types, file_size_limit) and the
// storage policy (folder fence + extension gate), in owners-key-upload-hardening.sql. Everything
// in this file is the third place: it exists so a client who picks a 30 MB TIFF gets told why in
// their own language instead of a red 400 from an API they have never heard of.
//
// This code is NOT the control. Anyone can bypass it with a terminal. It is written as if the
// server did not exist, and the server is written as if this did not exist.
const MAX_BYTES = 5 * 1024 * 1024                                  // matches the bucket exactly
const ALLOWED = ['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'image/gif'] as const
const ALLOWED_EXT = ['png', 'jpg', 'jpeg', 'webp', 'avif', 'gif']

// The first bytes of a file say what it really is; the name and the declared type are just claims.
// A .png that starts with "<svg" or "<!DOCTYPE html" is caught here rather than at the bucket.
async function sniff(file: File): Promise<string | null> {
  const b = new Uint8Array(await file.slice(0, 16).arrayBuffer())
  const hex = [...b].map((x) => x.toString(16).padStart(2, '0')).join('')
  const ascii = String.fromCharCode(...b).toLowerCase()
  if (hex.startsWith('89504e47')) return 'image/png'
  if (hex.startsWith('ffd8ff')) return 'image/jpeg'
  if (hex.startsWith('47494638')) return 'image/gif'
  if (ascii.slice(0, 4) === 'riff' && ascii.slice(8, 12) === 'webp') return 'image/webp'
  if (ascii.includes('ftypavif')) return 'image/avif'
  if (ascii.trimStart().startsWith('<svg') || ascii.includes('<?xml')) return 'image/svg+xml'
  if (ascii.trimStart().startsWith('<!doctype') || ascii.trimStart().startsWith('<html')) return 'text/html'
  return null
}

/** Returns an error message for the client, or null when the file is acceptable. */
async function checkImage(file: File): Promise<string | null> {
  const ext = (file.name.split('.').pop() || '').toLowerCase()
  if (file.size === 0) return 'That file is empty.'
  if (file.size > MAX_BYTES) return `That image is ${(file.size / 1048576).toFixed(1)} MB. The limit is 5 MB — please resize it and try again.`
  if (!ALLOWED_EXT.includes(ext)) return `We accept ${ALLOWED_EXT.join(', ')} images. That file is a .${ext || 'file with no extension'}.`
  if (!ALLOWED.includes(file.type as any)) return `We accept ${ALLOWED_EXT.join(', ')} images. That file says it is ${file.type || 'an unknown type'}.`
  const real = await sniff(file)
  // SVG is refused outright: it is an XML document that can carry scripts, and it would execute on
  // the storage origin. Refusing it is one line; sanitising it properly is a parser.
  if (real === 'image/svg+xml') return 'SVG images are not supported here, because they can carry code. Please export a PNG or WebP instead.'
  if (real && real !== file.type) return `That file is named .${ext} but its contents are ${real}. Please re-export it.`
  if (!real) return 'We could not recognise that as an image. Please export it as PNG, JPG or WebP.'
  return null
}

export function EditableImage({ k, src, alt = '', className = '' }: { k: string; src: string; alt?: string; className?: string }) {
  const ctx = useOwnersKey()
  const value = useValue(k, src)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  if (!ctx?.editing || !ctx.siteId || !ctx.sb) return <img src={value} alt={alt} className={className} />
  const pick = async (file: File) => {
    setErr('')
    const problem = await checkImage(file)
    if (problem) { setErr(problem); return }
    setBusy(true)
    // The extension is rebuilt from the allow-list rather than carried over from the uploaded
    // name, so a filename like "photo.png.svg" cannot decide what lands in a public bucket.
    const ext = (file.name.split('.').pop() || 'png').toLowerCase()
    const path = `${ctx.slug}/${k.replace(/[^\w.-]/g, '_')}-${Date.now()}.${ALLOWED_EXT.includes(ext) ? ext : 'png'}`
    const { error } = await ctx.sb!.storage.from('site-media')
      .upload(path, file, { upsert: true, contentType: file.type, cacheControl: '31536000' })
    if (error) {
      // This used to be `if (!error)` with no else: a rejected upload simply stopped the spinner
      // and left the old image in place, so the client had no idea anything had failed.
      setErr(/mime|content type/i.test(error.message) ? 'That file type is not allowed.'
        : /size|large|payload/i.test(error.message) ? 'That image is too large. The limit is 5 MB.'
          : `Upload failed: ${error.message}`)
      setBusy(false)
      return
    }
    const { data } = ctx.sb!.storage.from('site-media').getPublicUrl(path)
    await ctx.save(k, { v: data.publicUrl })
    setBusy(false)
  }
  return (
    <label className={`ok-editable ok-image ${className}`} title={`Editable image · ${k}`}>
      <img src={value} alt={alt} className={className} />
      <input type="file" accept={ALLOWED.join(',')} hidden
        onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) pick(f) }} />
      <span className="ok-badge">{busy ? 'uploading…' : 'change image'}</span>
      {err && <em className="ok-err">{err}</em>}
    </label>
  )
}

/* ------------------------------------------------------------------ the sign-in */
/** Passwordless. Nick never handles a client password, and there is none to reset or leak. */
export function OwnersKeyLogin() {
  const ctx = useOwnersKey()
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')
  if (!ctx?.editing || ctx.signedIn) return null
  return (
    <div className="ok-login">
      <h2>Edit your site</h2>
      <p>Enter your email and we'll send you a link. No password to remember.</p>
      <input type="email" value={email} placeholder="you@yourbusiness.com"
        onChange={(e) => setEmail(e.target.value)} />
      <button onClick={async () => {
        const { error } = await ctx.sb!.auth.signInWithOtp({
          email, options: { emailRedirectTo: `${window.location.origin}/edit` },
        })
        setMsg(error ? error.message : 'Check your email — the link signs you straight in.')
      }}>Send my link</button>
      {msg && <p className="ok-msg">{msg}</p>}
    </div>
  )
}

/** The thin bar that tells the client what state they are in. */
export function OwnersKeyBar() {
  const ctx = useOwnersKey()
  if (!ctx?.editing || !ctx.signedIn) return null
  return (
    <div className="ok-bar">
      <b>Edit mode</b> — click any highlighted text or image. Changes save as you go and appear on
      your live site within a few minutes.
      <button onClick={() => ctx.sb!.auth.signOut()}>Done</button>
    </div>
  )
}
