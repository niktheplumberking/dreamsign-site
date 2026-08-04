// The inner-page hero. Batch 18 (owner): flip mode is now the homepage hero's TWIN —
// same seat (pt-23/21vh), same type sizes, same subtitle position, same cloud-CTA seat,
// same trust-facts row on the base line. Only the words differ. The classic mode (script
// above the giant word) stays for /kontakt.
import { motion, useTransform } from 'motion/react'
import { useWorld } from './World'
import { EditableText } from '../ok/OwnersKey'
import CloudButton from './CloudButton'
import { TRUST_ROW } from '../lib/trust'

const GLOW = { textShadow: '0 2px 26px rgba(245,249,253,0.95), 0 0 10px rgba(245,249,253,0.85)' }

export default function PageHero({
  script,
  title,
  sub,
  left,
  right,
  titleK,
  more,
  flip = false,
  trust = false,
}: {
  /** the Great Vibes word; in flip mode this is the PRIMARY word on top */
  script: string
  /** the giant word; in flip mode it renders in the quill underneath */
  title: string
  /** the one supporting line under the duet (flip mode) */
  sub?: string
  /** optional bottom row, flush left / flush right (classic mode) */
  left?: string
  right?: string
  titleK?: string
  /** optional cloud button — scrolls to the target section */
  more?: { label: string; targetId: string }
  /** homepage-twin duet order */
  flip?: boolean
  /** the four contract facts on the hero's base line (homepage grammar) */
  trust?: boolean
}) {
  const { p, reduced, vh } = useWorld()
  const skyY = useTransform(p, [0, vh], ['0%', '8%'])
  const fgY = useTransform(p, [0, vh], ['0%', '15%'])

  const glide = () => {
    const el = document.getElementById(more!.targetId)
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - 40
    window.scrollTo({ top, behavior: 'smooth' })
  }

  const cloudCta = more && (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="mt-6 flex flex-col items-center sm:mt-9"
    >
      <CloudButton label={more.label} onClick={glide} reduced={reduced} />
      {trust && (
        <ul className="mt-1 flex max-w-[20rem] flex-wrap items-center justify-center gap-x-3 gap-y-1 px-2 sm:hidden" style={GLOW}>
          {TRUST_ROW.map((t, i) => (
            <li key={t} className="flex items-center gap-x-3">
              <span className="whitespace-nowrap text-[10.5px] font-semibold uppercase tracking-[0.1em] text-ink">{t}</span>
              {i < TRUST_ROW.length - 1 && <span aria-hidden className="h-1 w-1 shrink-0 rounded-full bg-ink/40" />}
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  )

  return (
    <section data-beat="hero" className={`relative w-full overflow-hidden z-10 ${flip ? 'h-screen' : 'flex h-screen flex-col'}`}>
      <motion.img
        src="/media/hero-sky-still.webp" alt=""
        className="absolute inset-0 h-[120%] w-full object-cover z-0"
        style={reduced ? undefined : { y: skyY }}
      />

      {flip ? (
        /* THE HOMEPAGE TWIN — identical seat, sizes and rhythm */
        <div className="relative z-40 flex flex-col items-center px-5 pt-[23vh] text-center sm:px-6 md:pt-[21vh]">
          <motion.h1
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="leading-none"
          >
            <span
              className="block whitespace-nowrap font-semibold tracking-tight
                         text-[clamp(2.6rem,9vw,7.5rem)] bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(to bottom, #16324F 30%, #2E5F9E 100%)',
                padding: '0.25em 0.1em',
                margin: '-0.25em -0.1em',
              }}
            >
              {script}
            </span>
            <span
              className="mt-[0.02em] block font-script font-normal leading-[0.95] text-accent
                         text-[clamp(3.1rem,10.6vw,8.4rem)]"
              style={GLOW}
            >
              {titleK ? <EditableText k={titleK}>{title}</EditableText> : title}
            </span>
          </motion.h1>
          {sub && (
            <p
              className="mt-6 max-w-[46ch] text-balance font-medium text-ink/85
                         text-[clamp(1rem,1.9vw,1.35rem)] leading-relaxed sm:mt-7"
              style={GLOW}
            >
              {sub}
            </p>
          )}
          {cloudCta}
        </div>
      ) : (
        <div className="relative z-40 mx-auto flex w-full max-w-[88rem] flex-1 flex-col items-center justify-center px-5 pb-[9vh] sm:px-10 text-center">
          <motion.p
            aria-hidden
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative z-20 -mb-[0.55em] font-script font-normal leading-none text-accent
                       text-[clamp(3rem,9vw,7.5rem)]"
            style={{ textShadow: '0 2px 22px rgba(245,249,253,0.9)' }}
          >
            {script}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="w-full leading-none"
          >
            <span
              className="block w-full whitespace-nowrap font-semibold uppercase tracking-tight
                         text-[clamp(4.2rem,17vw,15rem)] leading-[0.85] bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(to bottom, #16324F 30%, #2E5F9E 100%)',
                padding: '0.12em 0.05em',
                margin: '-0.12em -0.05em',
                filter: 'drop-shadow(0 10px 26px rgba(22,50,79,0.20))',
              }}
            >
              {titleK ? <EditableText k={titleK}>{title}</EditableText> : title}
            </span>
          </motion.h1>

          {(left || right) && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-4 flex w-full items-center justify-between px-1 sm:mt-7 sm:px-6
                         text-[13px] sm:text-[16px] font-semibold tracking-wide text-ink/85"
              style={{ textShadow: '0 2px 18px rgba(245,249,253,0.9)' }}
            >
              <span className="text-left">{left}</span>
              <span className="text-right">{right}</span>
            </motion.div>
          )}

          {cloudCta}
        </div>
      )}

      {/* the four facts on the hero's base line (desktop) — homepage grammar */}
      {trust && (
        <motion.ul
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.75 }}
          className="absolute inset-x-0 bottom-[4.5vh] z-40 hidden flex-wrap items-center justify-center
                     gap-x-4 gap-y-1.5 px-4 sm:flex sm:gap-x-5"
          style={GLOW}
        >
          {TRUST_ROW.map((t, i) => (
            <li key={t} className="flex items-center gap-x-4 sm:gap-x-5">
              <span
                className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.12em] text-ink sm:text-[12.5px]"
                style={{ textShadow: '0 1px 14px rgba(255,255,255,0.98), 0 0 5px rgba(255,255,255,0.9)' }}
              >
                {t}
              </span>
              {i < TRUST_ROW.length - 1 && (
                <span aria-hidden className="h-1 w-1 shrink-0 rounded-full bg-ink/40" />
              )}
            </li>
          ))}
        </motion.ul>
      )}

      {/* the bank closes the stage (homepage geometry in flip mode) */}
      <motion.img
        src="/media/hero-bank-fade.webp" alt=""
        className={`absolute left-0 right-0 z-30 w-full select-none object-cover pointer-events-none ${
          flip ? '-top-[8%] h-[126%] object-bottom' : 'bottom-[-2%] h-[74%] object-bottom'
        }`}
        style={reduced ? undefined : { y: fgY }}
      />
    </section>
  )
}
