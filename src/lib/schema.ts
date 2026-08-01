// schema.org JSON-LD — the Stage 6 schema plan from the story map: Organization + WebSite
// sitewide, LocalBusiness (Ruma 22400, RS), BreadcrumbList per page. Injected per route by
// usePageMeta so the prerendered HTML of every page carries its own structured data.
// Facts come from lib/marks.ts (the APR register) — never retyped here.
import { LEGAL } from './marks'
import { SITE_ORIGIN } from './meta'

const ORGANIZATION = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': SITE_ORIGIN + '/#organization',
  name: 'DreamSign',
  legalName: LEGAL.name,
  url: SITE_ORIGIN + '/',
  logo: SITE_ORIGIN + '/media/brand/cloud-dream.webp',
  email: LEGAL.email,
  telephone: LEGAL.phone,
  vatID: LEGAL.pib,
  taxID: LEGAL.registrationNo,
  founder: { '@type': 'Person', name: LEGAL.owner },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Dušana Jerkovića 42',
    postalCode: '22400',
    addressLocality: 'Ruma',
    addressCountry: 'RS',
  },
}

const WEBSITE = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': SITE_ORIGIN + '/#website',
  url: SITE_ORIGIN + '/',
  name: 'DreamSign',
  inLanguage: 'sr',
  publisher: { '@id': SITE_ORIGIN + '/#organization' },
}

const LOCAL_BUSINESS = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': SITE_ORIGIN + '/#localbusiness',
  name: 'DreamSign',
  description: 'Izrada sajtova koji prodaju — dizajn, SEO i održavanje za firme u Srbiji.',
  url: SITE_ORIGIN + '/',
  telephone: LEGAL.phone,
  email: LEGAL.email,
  image: SITE_ORIGIN + '/media/og-home.jpg',
  priceRange: 'ponuda posle prvog razgovora',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Dušana Jerkovića 42',
    postalCode: '22400',
    addressLocality: 'Ruma',
    addressCountry: 'RS',
  },
  areaServed: { '@type': 'Country', name: 'Srbija' },
  parentOrganization: { '@id': SITE_ORIGIN + '/#organization' },
}

/** breadcrumb for an inner page: Početna → <name> */
export function breadcrumb(name: string, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Početna', item: SITE_ORIGIN + '/' },
      { '@type': 'ListItem', position: 2, name, item: SITE_ORIGIN + path },
    ],
  }
}

export const HOME_SCHEMA = [ORGANIZATION, WEBSITE, LOCAL_BUSINESS]
export const PAGE_SCHEMA = (name: string, path: string) => [
  ORGANIZATION,
  WEBSITE,
  breadcrumb(name, path),
]
