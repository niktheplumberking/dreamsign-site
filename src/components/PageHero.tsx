// The inner-page hero, batch 13/14 (Nick's reference layout, our skin): a script word
// overlapping DOWN into a giant condensed title, dead centre, over the SAME sky + cloud
// bank the whole site lives in. Batch 14: the block rides higher so the script never
// touches the bank, the name/role row became optional (deleted on /radovi), and an
// optional cloud-textured „Pogledajte više" button glides the visitor to the first
// project — the cloud is our own entrance puff, not a drawn shape.
import { motion, useTransform } from 'motion/react'
import { useWorld } from './World'
import { EditableText } from '../ok/OwnersKey'

export default function PageHero({
  script,
  title,
  left,
  right,
  titleK,
  more,
}: {
  /** the Great Vibes word riding above/into the title */
  script: string
  /** the giant condensed h1 */
  title: string
  /** optional bottom row, flush left / flush right */
  left?: string
  right?: string
  titleK?: string
  /** optional cloud button under the title — scrolls to the target section */
  more?: { label: string; targetId: string }
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

  return (
    <section data-beat="hero" className="relative flex h-screen w-full flex-col overflow-hidden z-10">
      <motion.img
        src="/media/hero-sky-still.webp" alt=""
        className="absolute inset-0 h-[120%] w-full object-cover z-0"
        style={reduced ? undefined : { y: skyY }}
      />

      {/* pb lifts the whole block off the bank (batch 14: „Naši" was touching the cloud) */}
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

        {more && (
          <motion.button
            type="button"
            onClick={glide}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="group relative mt-5 grid w-[240px] cursor-pointer place-items-center sm:mt-8 sm:w-[280px]"
            aria-label={`${more.label} — skrolujte do projekata`}
          >
            {/* the button IS a cloud: our own entrance puff carries the label */}
            <motion.span
              aria-hidden
              className="col-start-1 row-start-1 block w-full"
              animate={reduced ? undefined : { y: [0, -6, 0] }}
              transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <img
                src="/media/cloud-puff.webp" alt=""
                className="w-full select-none drop-shadow-[0_10px_26px_rgba(22,50,79,0.22)]
                           transition-transform duration-300 group-hover:scale-105"
              />
              <span className="pointer-events-none absolute inset-0 grid place-items-center pb-[8%]">
                <span className="text-[13.5px] font-semibold uppercase tracking-[0.16em] text-ink/85 sm:text-[15px]">
                  {more.label}
                </span>
              </span>
            </motion.span>
          </motion.button>
        )}
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
