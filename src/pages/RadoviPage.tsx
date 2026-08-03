// /radovi — batch 13: Nick built the layout himself (AI Studio reference, 2026-08-03) and
// the factory executes it 1/1: hero (script into giant RADOVI + name/role row), three
// project sections in three different frame geometries (bento 5/7 · full-bleed strip ·
// edge columns 25/50/25), the SVE O NAMA composition (HIS COPY, VERBATIM, LOCKED), and
// the FAQ split. Skin, faces, world and motion stay ours; his navy → our ink, his red →
// our signature blue. Every tile is a REAL capture of the live client sites.
//
// JUNCTION LAW: the ink frames are content plates mid-beat. Every beat boundary is padded
// with ≥320px of open sky on each side (SkyGap), so the seams the rig scans stay seams.
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { World, WorldLayer, SeamBridge, Beat } from '../components/World'
import PageHero from '../components/PageHero'
import LandingCTA from '../components/LandingCTA'
import Ground from '../components/Ground'
import { GlossyPill } from '../components/Nav'
import { MASK } from '../lib/masks'
import { WA_LINK } from '../lib/hooks'
import { bk } from '../lib/content'
import { usePageMeta } from '../lib/meta'
import { PAGE_SCHEMA } from '../lib/schema'

/* ---------------------------------------------------------------- shared pieces */

/** the breathing sky each beat boundary demands (≥320px on both sides of a seam) */
const SkyGap = () => <div aria-hidden style={{ height: 'max(44vh, 500px)' }} />

/** the tilted script word floating up-left above a giant headline (reference geometry) */
function TiltScript({ word }: { word: string }) {
  return (
    <motion.span
      aria-hidden
      initial={{ opacity: 0, scale: 0.85, rotate: -16, y: 15 }}
      whileInView={{ opacity: 1, scale: 1, rotate: -12, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="pointer-events-none absolute -top-7 left-0 z-20 block sm:-top-9 sm:-left-4 lg:-top-11 lg:-left-8
                 font-script font-normal leading-none text-accent text-[clamp(2.2rem,4.5vw,3.9rem)]"
      style={{ textShadow: '0 2px 16px rgba(245,249,253,0.85)' }}
    >
      {word}
    </motion.span>
  )
}

/** the giant condensed section headline, ink gradient (the homepage h1's own ramp) */
function GiantH2({ children, align = 'center' }: { children: React.ReactNode; align?: 'center' | 'left' }) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, delay: 0.15 }}
      // whitespace-nowrap + a wider-than-container box: bg-clip-text paints NOTHING outside
      // the element, so a word wider than its box loses letters (the first cut showed
      // "PROJEK" — Inter Tight is wider than the reference's condensed face)
      className={`w-[115%] max-w-none whitespace-nowrap pt-6 font-semibold uppercase tracking-tight leading-[0.85]
                  text-[clamp(3rem,7.6vw,7.4rem)] bg-clip-text text-transparent
                  ${align === 'left' ? 'text-center lg:text-left' : 'text-center'}`}
      style={{
        backgroundImage: 'linear-gradient(to bottom, #16324F 30%, #2E5F9E 100%)',
        padding: '0.18em 0.05em',
        margin: '-0.12em calc(-7.5% - 0.05em)',
        filter: 'drop-shadow(0 4px 14px rgba(22,50,79,0.14))',
      }}
    >
      {children}
    </motion.h2>
  )
}

/** one bento tile: a real capture of the live site, panning gently on the world's scroll */
function Tile({ src, alt, href, className = '', delay = 0 }: {
  src: string; alt: string; href: string; className?: string; delay?: number
}) {
  return (
    <motion.a
      href={href} target="_blank" rel="noopener"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay }}
      className={`group relative block overflow-hidden rounded-2xl border border-white/70 bg-white shadow-md ${className}`}
    >
      <img
        src={src} alt={alt} decoding="async" loading="lazy"
        className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
      />
    </motion.a>
  )
}

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7, delay: 0.12 * i },
})

/** the paragraph + meta/link line each project carries (the live-links law) */
function ProjectCopy({ text, meta, href, label, align = 'center' }: {
  text: string; meta: string; href: string; label: string; align?: 'center' | 'left'
}) {
  return (
    <>
      <motion.p
        {...fadeUp(2)}
        className={`max-w-lg text-[16px] font-medium leading-relaxed text-ink/75 sm:text-lg lg:text-xl ${
          align === 'left' ? 'text-center lg:text-left' : 'text-center'
        }`}
      >
        {text}
      </motion.p>
      <motion.p
        {...fadeUp(3)}
        className={`mt-5 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ink/55 ${
          align === 'left' ? 'text-center lg:text-left' : 'text-center'
        }`}
      >
        {meta} ·{' '}
        <a href={href} target="_blank" rel="noopener" className="text-accent transition-colors hover:text-ink">
          {label} ↗
        </a>
      </motion.p>
    </>
  )
}

/* ------------------------------------------------- project 1 · Bennett (5/7 bento) */

function ProjekatPrvi() {
  return (
    <div className="grid w-full grid-cols-1 items-center lg:grid-cols-12">
      {/* LEFT 5: centred text block, tilted script above the giant word */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 py-12 text-center sm:px-10 lg:col-span-5 lg:px-14">
        <div className="relative flex w-full max-w-lg flex-col items-center justify-center">
          <TiltScript word="Prvi" />
          <GiantH2>Projekat</GiantH2>
          <div className="mt-6">
            <ProjectCopy
              text="Kompletan identitet i korporativni sajt za studio za web dizajn — od logotipa do lansiranja, građen da osvaja poverenje na prvi pogled."
              meta="Bennett & Co — brend + sajt · SAD"
              href="https://www.bennettndco.com" label="bennettndco.com"
            />
          </div>
        </div>
      </div>

      {/* RIGHT 7: the ink-framed bento — 2 columns (22/50/28 + 48/52), reference geometry */}
      <div className="flex items-center p-4 sm:p-6 lg:col-span-7 lg:p-8 lg:pl-0">
        <div className="grid h-[560px] w-full transform-gpu grid-cols-2 gap-3 overflow-hidden rounded-3xl bg-ink p-3 shadow-xl sm:h-[640px] sm:gap-4 sm:p-4 lg:h-[700px] lg:p-5">
          <div className="flex h-full flex-col gap-3 sm:gap-4">
            <Tile src="/media/radovi/bento/bennett-1.jpg" alt="Bennett & Co — vrh sajta" href="https://www.bennettndco.com" className="h-[22%]" />
            <Tile src="/media/radovi/bento/bennett-2.jpg" alt="Bennett & Co — uvodna poruka" href="https://www.bennettndco.com" className="h-[50%]" delay={0.1} />
            {/* the accent tile: the client's own mark on our ink ground (reference: accent block) */}
            <motion.a
              {...fadeUp(2)}
              href="https://www.bennettndco.com" target="_blank" rel="noopener"
              className="group relative flex h-[28%] items-center justify-center overflow-hidden rounded-2xl border border-white/30 shadow-md"
              style={{ background: 'linear-gradient(135deg, #22385A 0%, #16324F 100%)' }}
            >
              <img src="/media/radovi/bennett-lockup.svg" alt="Bennett & Co logotip"
                   className="w-[62%] max-w-[240px] opacity-95 transition-transform duration-300 group-hover:scale-105 brightness-0 invert" />
            </motion.a>
          </div>
          <div className="flex h-full flex-col gap-3 sm:gap-4">
            <Tile src="/media/radovi/bento/bennett-3.jpg" alt="Bennett & Co — usluge" href="https://www.bennettndco.com" className="h-[48%]" delay={0.15} />
            <Tile src="/media/radovi/bento/bennett-4.jpg" alt="Bennett & Co — radovi" href="https://www.bennettndco.com" className="h-[52%]" delay={0.25} />
          </div>
        </div>
      </div>
    </div>
  )
}

/* --------------------------------------- project 2 · Metal Kolor (full-bleed strip) */

function ProjekatDrugi() {
  return (
    <div className="flex w-full flex-col gap-10 sm:gap-14">
      {/* TOP: title left / paragraph right (6/6, reference geometry) */}
      <div className="mx-auto w-full max-w-[1400px] px-6 sm:px-10 lg:px-14">
        <div className="grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-12">
          <div className="relative flex flex-col items-center text-center lg:col-span-6 lg:items-start lg:text-left">
            <div className="relative flex w-full max-w-lg flex-col items-center lg:items-start">
              <TiltScript word="Drugi" />
              <GiantH2 align="left">Projekat</GiantH2>
            </div>
          </div>
          <div className="flex flex-col items-center lg:col-span-6 lg:items-start lg:justify-self-end">
            <ProjectCopy
              align="left"
              text="Farbara koja snabdeva majstore širom Srema — katalog, galerija i kontakt, posloženi da mušterija za dva klika nađe ono po šta je došla."
              meta="Metal Kolor — web sajt · Srem"
              href="https://metal-kolor.rs/" label="metal-kolor.rs"
            />
          </div>
        </div>
      </div>

      {/* BOTTOM: the full-bleed ink strip, three wide cards edge to edge (no rounding).
          The extra air above it keeps the strip's top edge out of the junction scan band. */}
      <div aria-hidden style={{ height: 'max(8vh, 110px)' }} />
      <div className="w-full">
        <div className="grid min-h-[300px] w-full transform-gpu grid-cols-1 gap-3 bg-ink p-3 shadow-xl sm:min-h-[360px] sm:gap-4 sm:p-4 md:grid-cols-3 lg:h-[440px] lg:p-5">
          <Tile src="/media/radovi/bento/metalkolor-1.jpg" alt="Metal Kolor — vrh sajta" href="https://metal-kolor.rs/" className="h-[320px] md:h-full" />
          <Tile src="/media/radovi/bento/metalkolor-2.jpg" alt="Metal Kolor — katalog" href="https://metal-kolor.rs/" className="h-[320px] md:h-full" delay={0.15} />
          <Tile src="/media/radovi/bento/metalkolor-3.jpg" alt="Metal Kolor — galerija" href="https://metal-kolor.rs/" className="h-[320px] md:h-full" delay={0.3} />
        </div>
      </div>
    </div>
  )
}

/* ------------------------------- project 3 · Pizzdarija (edge columns, 25/50/25) */

function EdgeColumn({ side, shots }: { side: 'left' | 'right'; shots: [string, string, string] }) {
  const r = side === 'left' ? 'rounded-r-xl lg:rounded-r-2xl' : 'rounded-l-xl lg:rounded-l-2xl'
  const frame = side === 'left' ? 'lg:rounded-r-3xl pr-3 lg:pr-4 pl-0' : 'lg:rounded-l-3xl pl-3 lg:pl-4 pr-0'
  const x = side === 'left' ? -20 : 20
  return (
    <div className={`flex h-full min-h-[420px] w-full items-center lg:col-span-3 lg:min-h-[640px]`}>
      <div className={`flex h-full max-h-[780px] w-full transform-gpu flex-col justify-between gap-3 overflow-hidden bg-ink p-3 py-3 shadow-xl sm:gap-4 sm:p-4 ${frame}`}>
        // fixed tile heights below lg: an unconstrained h-full chain resolves from the IMAGE intrinsic size — lazy tiles measured 240px short and every beat below drifted 498px (rig scar)
        {shots.map((src, i) => (
          <motion.a
            key={src}
            href="https://www.pizzdarija.rs/" target="_blank" rel="noopener"
            initial={{ opacity: 0, x }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
            className={`group block w-full overflow-hidden bg-white/10 ${r} ${i === 1 ? 'h-[320px] lg:h-auto lg:min-h-[200px] lg:flex-1' : 'h-[120px] sm:h-[150px] lg:h-[160px]'}`}
          >
            <img src={src} alt="Pizzdarija — prikaz sajta" decoding="async" loading="lazy"
                 className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
          </motion.a>
        ))}
      </div>
    </div>
  )
}

function ProjekatTreci() {
  return (
    <div className="grid w-full grid-cols-1 items-stretch lg:grid-cols-12">
      <EdgeColumn side="left" shots={['/media/radovi/bento/pizzdarija-1.jpg', '/media/radovi/bento/pizzdarija-2.jpg', '/media/radovi/bento/pizzdarija-3.jpg']} />

      <div className="relative z-10 my-auto flex flex-col items-center justify-center px-6 py-12 text-center sm:px-10 lg:col-span-6 lg:px-14">
        <div className="relative flex w-full max-w-lg flex-col items-center justify-center">
          <TiltScript word="Treći" />
          <GiantH2>Projekat</GiantH2>
          <div className="mt-6">
            <ProjectCopy
              text="Picerija sa picom na drva iz Novog Sada — meni, priča i porudžbina na dva klika, u duhu lokala koji miriše na vatru."
              meta="Pizzdarija — web sajt · Novi Sad"
              href="https://www.pizzdarija.rs/" label="pizzdarija.rs"
            />
          </div>
        </div>
      </div>

      <EdgeColumn side="right" shots={['/media/radovi/bento/pizzdarija-4.jpg', '/media/radovi/bento/pizzdarija-5.jpg', '/media/radovi/bento/pizzdarija-6.jpg']} />
    </div>
  )
}

/* ------------------------------------------- SVE O NAMA — Nick's own composition.
   THE COPY IS HIS, VERBATIM, AND LOCKED (owner's instruction 2026-08-03: "dont touch
   SVE O NAMA"). Layout coordinates carried over 1/1; only faces and colours are ours. */

function SveONama() {
  return (
    <div className="relative flex h-screen max-h-screen min-h-screen w-full select-none flex-col justify-between px-6 text-ink sm:px-10 lg:px-14">
      {/* the thin decorative circle poking off the left edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 z-0 -translate-y-1/2 rounded-full border border-ink/25
                   -left-[100px] h-[480px] w-[480px] sm:-left-[140px] sm:h-[680px] sm:w-[680px]
                   md:-left-[180px] md:h-[850px] md:w-[850px] lg:-left-[200px] lg:h-[1020px] lg:w-[1020px]"
      />

      {/* the lone "O", upper right */}
      <motion.span
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none absolute z-10 block -translate-y-1/2 font-bold uppercase leading-none tracking-tight text-ink
                   top-[28%] right-[14%] text-[5.25rem] sm:top-[32%] sm:right-[18%] sm:text-[7.75rem]
                   md:right-[22%] md:text-[9.75rem] lg:top-[35%] lg:right-[25%] lg:text-[11.75rem] xl:text-[13.25rem]"
        aria-hidden
      >
        O
      </motion.span>

      {/* centre-left text block — HIS COPY, VERBATIM */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="absolute z-20 w-full max-w-xs -translate-y-1/2 px-2 text-left
                   top-[55%] left-[14%] sm:top-[58%] sm:left-[18%] sm:max-w-md md:left-[22%] lg:max-w-lg"
      >
        <p className="text-base font-medium leading-relaxed text-ink/95 sm:text-lg lg:text-xl xl:text-[1.375rem]">
          Naša strast je vođenje klijenata da pronađu svoj jedinstveni glas u svetu vizuelnih
          komunikacija, kreirajući brendove sa smislom i emocijom, bez da budemo samo još
          jedan u nizu. Otkrijte lepotu autentičnosti i snagu izuzetnog dizajna.
        </p>
      </motion.div>

      {/* lower-right text block — HIS COPY, VERBATIM */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="absolute z-20 w-full max-w-xs px-2 text-left
                   bottom-20 right-8 sm:bottom-28 sm:right-16 sm:max-w-md md:right-24 lg:bottom-36 lg:right-32 lg:max-w-lg"
      >
        <p className="text-base font-medium leading-relaxed text-ink/95 sm:text-lg lg:text-xl xl:text-[1.375rem]">
          Kroz pažljivo osmišljene strategije i posvećenost detaljima, stvaramo vizuelne
          identitete i digitalna iskustva koja inspirišu i ostavljaju trajan utisak.
        </p>
      </motion.div>

      {/* SVE (top) and NAMA (bottom), stepping right — the section's h2 reads whole */}
      <h2 className="pointer-events-none relative z-10 mx-auto flex h-full w-full max-w-[1700px] flex-col justify-between pt-20 pb-4 sm:pt-24 sm:pb-6 lg:pt-28">
        <motion.span
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="block w-full pl-10 text-left font-bold uppercase leading-[0.8] tracking-tight text-ink
                     text-[4.5rem] sm:pl-24 sm:text-[7rem] md:pl-36 md:text-[9rem] lg:pl-48 lg:text-[11rem] xl:text-[13rem]"
        >
          SVE
        </motion.span>
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="-mt-4 block w-full pl-16 text-left font-bold uppercase leading-[0.8] tracking-tight text-ink
                     text-[4.5rem] sm:-mt-6 sm:pl-36 sm:text-[7rem] md:pl-52 md:text-[9rem] lg:-mt-8 lg:pl-64 lg:text-[11rem] xl:text-[13rem]"
        >
          NAMA
        </motion.span>
      </h2>
    </div>
  )
}

/* --------------------------------------------------------------------- FAQ (5/7) */

const FAQ = [
  {
    q: 'Šta tačno radite?',
    a: 'Pravimo sajtove po meri — dizajn i izradu od nule, redizajn postojećih sajtova, SEO i Google pozicioniranje, oglašavanje i održavanje. Jedan tim, jedan potpis, od prvog razgovora do lansiranja.',
  },
  {
    q: 'Koliko košta sajt?',
    a: 'Nemamo cenovnik — svaki projekat je jedinstven. Posle prvog razgovora dobijate konkretnu ponudu: obim, rok i cenu, pismeno. Razgovor vas ništa ne košta i ni na šta ne obavezuje.',
  },
  {
    q: 'Koliko traje izrada?',
    a: 'Zavisi od obima — zato rok ne pogađamo nego ga ugovaramo. Pre početka potpisujemo ugovor sa jasnim, fiksnim rokom, i njega se držimo.',
  },
  {
    q: 'Da li potpisujemo ugovor?',
    a: 'Uvek. Obim posla, rok i cena stoje na papiru pre nego što počnemo. Bez skrivenih troškova, bez iznenađenja — to je pravilo kuće.',
  },
  {
    q: 'Čiji je sajt kada se završi?',
    a: 'Vaš. Kod i sadržaj prelaze u vaše vlasništvo, a tekstove i slike posle lansiranja menjate sami — bez programera i bez čekanja.',
  },
  {
    q: 'Šta ako nešto zatreba posle lansiranja?',
    a: 'Tu smo — održavanje, podrška i dalje unapređenje sajta. Radite direktno sa vlasnikom, a kada projekat to traži, dolazimo i lično.',
  },
]

function FaqSekcija() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="mx-auto grid w-full max-w-[1500px] grid-cols-1 items-start gap-12 px-6 sm:px-10 lg:grid-cols-12 lg:gap-16 lg:px-14">
      {/* LEFT: eyebrow, heading, the conversation card (reference's booking card, our skin) */}
      <div className="flex h-full flex-col justify-between lg:col-span-5">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-accent" aria-hidden />
            <span className="text-sm font-semibold uppercase tracking-wide text-ink/70">Pitanja</span>
          </div>
          <h2 className="mb-8 text-3xl font-bold leading-[1.15] tracking-tight text-ink sm:text-4xl lg:text-5xl">
            Česta pitanja
          </h2>
        </div>

        <motion.div
          {...fadeUp(1)}
          className="relative mt-4 overflow-hidden rounded-3xl border border-white/80 bg-white/85 p-6 shadow-[0_10px_35px_rgba(22,50,79,0.06)] sm:p-8 lg:mt-12"
        >
          <img src="/media/brand/cloud-d.webp" alt="" aria-hidden className="mb-5 w-16 sm:w-20 drop-shadow-md" />
          <h3 className="mb-2 text-xl font-bold text-ink sm:text-2xl">Niste sigurni odakle da počnete?</h3>
          <p className="mb-6 text-sm leading-relaxed text-ink/70 sm:text-base">
            Dva klika i razgovaramo — bez obaveza. Odgovorićemo na svako pitanje pre nego što bilo šta potpišete.
          </p>
          <GlossyPill href={WA_LINK} className="block w-full px-6 py-3.5 text-center text-[15px] font-semibold">
            Započnite razgovor
          </GlossyPill>
        </motion.div>
      </div>

      {/* RIGHT: the accordion */}
      <div className="flex flex-col gap-4 lg:col-span-7">
        {FAQ.map((f, i) => {
          const isOpen = open === i
          return (
            <div
              key={f.q}
              className={`overflow-hidden rounded-2xl transition-all duration-200 ${
                isOpen ? 'bg-white shadow-[0_8px_30px_rgba(22,50,79,0.06)]' : 'bg-white/70 hover:bg-white/90'
              }`}
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full cursor-pointer items-center justify-between gap-4 p-5 text-left sm:p-6"
                aria-expanded={isOpen}
              >
                <span className="text-base font-semibold text-ink sm:text-lg lg:text-xl">{f.q}</span>
                <span
                  aria-hidden
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-lg font-medium transition-transform duration-200 ${
                    isOpen ? 'rotate-45 bg-tint text-ink' : 'text-ink/55'
                  }`}
                >
                  +
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="a"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-6 text-sm leading-relaxed text-ink/70 sm:px-6 sm:text-base">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------- the page */

export default function RadoviPage() {
  usePageMeta({
    title: 'Radovi — DreamSign | Sajtovi koji donose rezultate',
    description:
      'Izabrani projekti: sajtovi koje smo dizajnirali i izgradili — i rezultati koje su doneli. Pogledajte radove, pa nam pišite na WhatsApp za vaš.',
    path: '/radovi',
    ogImage: '/media/og-radovi.jpg',
    schema: PAGE_SCHEMA('Radovi', '/radovi'),
  })

  return (
    <main>
      <World>
        <PageHero
          script="Naši"
          title="Radovi"
          left="Nikola Šukunda"
          right="Osnivač · DreamSign"
        />

        <div className="relative z-20 -mt-[18vh]">
          <SeamBridge className="top-0 h-[62vh]" />

          <Beat name="projekat-1" layers={
            <WorldLayer
              src="/media/B3-square-sky.webp" eager
              box="-top-[30vh] -bottom-[30vh]"
              imgClass="absolute inset-0 h-[126%] w-full object-cover object-center"
              y={['0%', '-9%']} base={0.85} mask={MASK.sky}
            />
          }>
            <SkyGap />
            <ProjekatPrvi />
            <SkyGap />
          </Beat>

          <Beat name="projekat-2" layers={
            <WorldLayer
              src="/media/bank-soft.webp"
              box="-top-[6vh] -bottom-[8vh]"
              imgClass="absolute left-[-16%] top-[4%] w-[46%] h-auto max-w-none"
              y={['0%', '-10%']} base={0.5} float={{ px: 9, sec: 10 }}
            />
          }>
            <ProjekatDrugi />
            <SkyGap />
          </Beat>

          <Beat name="projekat-3" layers={
            <WorldLayer
              src="/media/bank-soft.webp"
              box="-top-[6vh] -bottom-[8vh]"
              imgClass="absolute right-[-14%] top-[10%] w-[44%] h-auto max-w-none scale-x-[-1]"
              y={['0%', '-8%']} base={0.45} float={{ px: 7, sec: 11, delay: 1.4 }}
            />
          }>
            <SkyGap />
            <ProjekatTreci />
            <SkyGap />
          </Beat>

          <Beat name="o-nama" layers={
            <WorldLayer
              src="/media/B7-vertical-sea.webp"
              box="-top-[30vh] -bottom-[36vh]"
              imgClass="absolute inset-0 h-[128%] w-full object-cover object-center"
              y={['0%', '-10%']} base={0.55} mask={MASK.sea}
            />
          }>
            <SveONama />
          </Beat>

          <Beat name="faq">
            <SkyGap />
            <FaqSekcija />
            <SkyGap />
          </Beat>

          <Ground>
            <Beat name="finale">
              <div className="pt-[24vh]">
                <LandingCTA
                  script={bk('radovi-cta', 'Sledeći rezultat može biti vaš.')}
                  scriptK="radovi-cta"
                  clipId="ds-sign-radovi"
                />
              </div>
            </Beat>
          </Ground>
        </div>
      </World>
    </main>
  )
}
