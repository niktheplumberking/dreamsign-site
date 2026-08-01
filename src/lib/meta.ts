// Per-route head management. index.html carries the homepage's tags as the baseline;
// this hook rewrites them on route mount so every prerendered page (tools/prerender.mjs
// snapshots the DOM head per route) ships its own title/description/canonical/OG in the
// static HTML — the view-source law. Client-side navigation gets the same values live.
import { useEffect } from 'react'

/** LAUNCH SWAP (Stage 8): becomes https://dreamsign.rs the day the domain is live.
    tools/checks.mjs asserts og:image is absolute and resolves, so a stale host fails loudly. */
export const SITE_ORIGIN = 'https://dreamsign-preview.vercel.app'

export type PageMeta = {
  /** document title, used verbatim (story-map SEO block) */
  title: string
  description: string
  /** route path starting with '/', e.g. '/radovi' */
  path: string
  /** og:title/og:description default to title/description when omitted */
  ogTitle?: string
  ogDescription?: string
  /** absolute-ized against SITE_ORIGIN; defaults to the home card */
  ogImage?: string
  ogImageAlt?: string
  /** schema.org JSON-LD blocks for this page (managed script tag) */
  schema?: object[]
  /** noindex pages (404) */
  noindex?: boolean
}

function setMeta(selector: string, attr: 'content' | 'href', value: string) {
  const el = document.head.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null
  if (el) el.setAttribute(attr, value)
}

export function usePageMeta(m: PageMeta) {
  useEffect(() => {
    const url = SITE_ORIGIN + (m.path === '/' ? '/' : m.path)
    const ogImage = SITE_ORIGIN + (m.ogImage ?? '/media/og-home.jpg')
    const ogTitle = m.ogTitle ?? m.title
    const ogDesc = m.ogDescription ?? m.description

    document.title = m.title
    setMeta('meta[name="description"]', 'content', m.description)
    setMeta('link[rel="canonical"]', 'href', url)
    setMeta('meta[property="og:title"]', 'content', ogTitle)
    setMeta('meta[property="og:description"]', 'content', ogDesc)
    setMeta('meta[property="og:url"]', 'content', url)
    setMeta('meta[property="og:image"]', 'content', ogImage)
    if (m.ogImageAlt) setMeta('meta[property="og:image:alt"]', 'content', m.ogImageAlt)
    setMeta('meta[name="twitter:title"]', 'content', ogTitle)
    setMeta('meta[name="twitter:description"]', 'content', ogDesc)
    setMeta('meta[name="twitter:image"]', 'content', ogImage)

    // robots: the 404 page and every /edit surface opt out
    const isEdit = window.location.pathname.startsWith('/edit')
    let robots = document.head.querySelector('meta[name="robots"]') as HTMLMetaElement | null
    if (m.noindex || isEdit) {
      if (!robots) {
        robots = document.createElement('meta')
        robots.name = 'robots'
        document.head.appendChild(robots)
      }
      robots.content = 'noindex, nofollow'
    } else if (robots) {
      robots.remove()
    }

    // one managed JSON-LD script per page
    const id = 'ds-schema'
    document.getElementById(id)?.remove()
    if (m.schema?.length) {
      const s = document.createElement('script')
      s.type = 'application/ld+json'
      s.id = id
      s.textContent = JSON.stringify(m.schema.length === 1 ? m.schema[0] : m.schema)
      document.head.appendChild(s)
    }
  }, [m.title, m.description, m.path]) // eslint-disable-line react-hooks/exhaustive-deps
}
