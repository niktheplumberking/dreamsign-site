// The inner-page hero, batch 13 (Nick's reference layout, our skin): a script word
// overlapping DOWN into a giant condensed title, both dead centre, with a full-width
// name/role row under them — over the SAME sky + cloud bank the whole site lives in.
// Layout is the reference's; faces, palette and world are ours (owner's instruction:
// "literally just take layout reference and nothing else").
import { motion, useTransform } from 'motion/react'
import { useWorld } from './World'
import { EditableText } from '../ok/OwnersKey'

export default function PageHero({
  script,
  title,
  left,
  right,
  titleK,
}: {
  /** the Great Vibes word riding above/into the title */
  script: string
  /** the giant condensed h1 */
  title: string
  /** bottom row, flush left */
  left: string
  /** bottom row, flush right */
  right: string
  titleK?: string
}) {
  const { p, reduced, vh } = useWorld()
  const skyY = useTransform(p, [0, vh], ['0%', '8%'])
  const fgY = useTransform(p, [0, vh], ['0%', '15%'])

  return (
    <section data-beat="hero" className="relative flex h-screen w-full flex-col overflow-hidden z-10">
      <motion.img
        src="/media/hero-sky-still.webp" alt=""
        className="absolute inset-0 h-[120%] w-full object-cover z-0"
        style={reduced ? undefined : { y: skyY }}
      />

      <div className="relative z-40 mx-auto flex w-full max-w-[88rem] flex-1 flex-col items-center justify-center px-5 sm:px-10 text-center">
        {/* the script word sits ABOVE and melts INTO the title (reference: negative margin) */}
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

        {/* the two mini texts, flush to the row's edges (reference geometry) */}
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
      </div>

      {/* the bank closes the stage, hugging the section's own bottom edge (mini grammar) */}
      <motion.img
        src="/media/hero-bank-fade.webp" alt=""
        className="absolute left-0 right-0 bottom-[-2%] z-30 h-[74%] w-full select-none object-cover object-bottom pointer-events-none"
        style={reduced ? undefined : { y: fgY }}
      />
    </section>
  )
}
