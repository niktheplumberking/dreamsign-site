# Why vercel.json carries these headers

The notes below lived as `"//"` keys inside `vercel.json` (commit `aa8c3e8`, the 50-point
security audit). **Vercel validates that file against a strict schema and rejects unknown
properties** — `Invalid vercel.json - headers[0] should NOT have additional property "//"` —
so every deploy failed with the comments in place. The keys were removed in batch 50 and the
reasoning moved here; **no header key or value was changed.**

## The header block (`source: "/(.*)"`)

Security response headers. Five items of the 50-point audit (31–35) failed for the same
reason: this file had no headers block at all, so the platform defaults shipped.

**Content-Security-Policy** — `script-src` stays `'self'` with NO `unsafe-inline`: the only
inline `<script>` on the page is the JSON-LD block, and a JSON-LD data block is not executed,
so browsers do not subject it to `script-src`. `style-src` DOES need `unsafe-inline` — React
and motion set element styles directly, and there is no way around that short of nonces this
static host cannot mint. `worker-src`/`blob:` is three.js, which builds its loaders as object
URLs. `connect-src` names the one Supabase project the Owner's Key talks to and nothing else,
so a script that somehow got in still cannot phone anywhere.

**`connect-src blob:` (added in batch 50).** The first deploy that actually carried these
headers broke the 3D cloud D on the homepage: `THREE.GLTFLoader: Couldn't load texture
blob:…` — three.js unpacks the GLB's embedded texture into a `blob:` URL and then *fetches*
it, which `connect-src` governs. `blob:` was already allowed for `img-src`, `media-src`,
`worker-src` and `child-src`; it belongs in `connect-src` for the same reason. A blob URL is
minted by this document and is same-origin — it cannot reach anything off-site, so the
directive's purpose (a smuggled script cannot phone home) is untouched.

**cal.com (added in batch 58).** The booking card embeds Nick's cal.com event, which needs
four holes in the wall and gets exactly four: `script-src https://app.cal.com` (their
`embed.js`, and only from that host), `frame-src` + `child-src` for the booking iframe, and
`connect-src` for the handshake the embed makes with its own origin. Nothing else was
loosened — no `unsafe-inline`, no wildcard, no `img-src` opening: the calendar's own images
load *inside* their iframe, which is governed by cal.com's CSP, not ours. Worth knowing what
this buys them: a third party we now execute code from could, in principle, read this page.
That is the price of any embed; it is contained to two pages, it loads only after the visitor
clicks, and the site holds no visitor data for it to read.

**Permissions-Policy** — everything this site does not use, switched off, so a compromised
script cannot even ask.

## The asset block (`source: "/assets/(.*)"`)

Hashed build assets never change under their own name, so they may be cached forever.
