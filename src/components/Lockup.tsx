// The mark that becomes the name — ONE gesture, no crossfade, nothing ever fades into
// anything else. The cloud D is nailed down; "ream" is drawn OUT of it and physically
// shoves the hand-signed S to the right, while "ign" is drawn out of the S on the same
// clock. The D's x and y never move: at any point in the transition it is the same
// pixels in the same place, which is what lets the nav run this on hover.
//
// "ream" is not a second asset — it is the rest of cloud-dream.webp, revealed. The gap
// between the D and the r was measured off the file's own alpha channel (2000×678, gap
// at x 546–551 → 27.42% of the width), so the closed state ends inside that gap and the
// cloud letters that emerge are the real ones, perfectly registered.
import { useReducedMotionSafe } from '../lib/hooks'

// Exported: the entrance renders its own transform-only mark (Bennett principle — zero
// layout animation) and must share these exact numbers or the two marks drift apart.
export const ASPECT = 2000 / 678        // cloud-dream.webp
export const D_EDGE = 0.2745            // the D/r gap, as a fraction of the full word

/**
 * How tall the cloud word is set, in em. This is the D/S balance knob, and it was measured,
 * not guessed: the image's ink is 660/678 of its height, and Great Vibes' S inks at 0.920 of
 * its own font-size, which is set at 1.45em here. That put the D at 0.857em against the S's
 * 1.334em — the D was **64%** of the S, which is what read as "the D is too small".
 *
 *   D ink = IMG_H × 660/678      S ink = 1.45 × 0.920 = 1.334em
 *
 * At 1.23em the D inked at 90% of the S; Nick's batch 4 verdict was "too big now — decrease
 * by 15-20%". 1.23 × 0.83 = 1.02em, which inks the D at 0.995em = **75% of the S**: clearly
 * bigger than the original 64%, clearly smaller than the S. Change this one number to retune
 * the whole site: the entrance, the nav and the footer all render this mark.
 */
export const IMG_H = 1.02
const OPEN_W = IMG_H * ASPECT    // the whole word
const SHUT_W = OPEN_W * D_EDGE   // the D alone

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

/** the lift, applied to the whole lockup so the clip boxes can never cut a shadow edge */
const LIFT = 'drop-shadow(0 1px 1.5px rgba(22,50,79,0.28))'

export default function Lockup({
  expanded,
  className = '',
  ms = 720,
  reserveWidth = true,
}: {
  expanded: boolean
  className?: string
  /** how long the push takes. The nav wants a hover-responsive 720ms; the entrance
      opens the same gesture out to ~1.1s because there it is the whole event. */
  ms?: number
  /**
   * Whether an invisible ghost reserves the OPEN width.
   *
   * The nav needs it: the mark must never change footprint or the links beside it jump.
   * The entrance must NOT have it — the reserved width is left-aligned, so the closed DS
   * sat off to the left of an invisible full-name box instead of in the middle of the
   * screen. With no ghost the mark's width is intrinsic, so a centring parent holds it
   * centred while it opens and the word unfolds evenly about the middle.
   */
  reserveWidth?: boolean
}) {
  const reduced = useReducedMotionSafe()
  const dur = reduced ? '0ms' : `${ms}ms`

  const dream = (
    <img
      src="/media/brand/cloud-dream.webp"
      alt=""
      aria-hidden
      className="block w-auto max-w-none select-none"
      style={{ height: `${IMG_H}em` }}
    />
  )
  const script = (t: string) => (
    <span className="font-script font-normal text-[1.45em] leading-none text-accent">{t}</span>
  )

  const live = (
    <span
      className="inline-flex items-baseline"
      style={{ ...(reserveWidth ? { gridArea: '1 / 1' } : null), filter: LIFT }}
    >
      {/* the D holds still; widening this box walks "ream" out from behind it,
          and because it is a real layout width, the S is pushed along in front of it */}
      <span
        className="block overflow-hidden"
        style={{
          width: `${expanded ? OPEN_W : SHUT_W}em`,
          transition: `width ${dur} ${EASE}`,
        }}
      >
        {dream}
      </span>

      {script('S')}

      {/* "ign" rides out of the S on the same clock. Generous vertical insets: the
          Great Vibes g drops well below the baseline and must never be cut. */}
      <span
        className="block"
        style={{
          clipPath: expanded ? 'inset(-45% -16% -45% 0%)' : 'inset(-45% 100% -45% 0%)',
          transition: `clip-path ${dur} ${EASE}`,
        }}
      >
        {script('ign')}
      </span>
    </span>
  )

  // centred mode: intrinsic width, so the parent's centring holds through the whole open
  if (!reserveWidth) {
    return (
      <span className={`relative inline-flex items-baseline leading-none ${className}`} aria-hidden>
        {live}
      </span>
    )
  }

  return (
    <span className={`relative inline-grid items-end leading-none ${className}`} aria-hidden>
      {/* the ghost holds the OPEN width, so the lockup's footprint is constant and
          nothing around it reflows while the name pushes itself open inside */}
      <span className="invisible inline-flex items-baseline" style={{ gridArea: '1 / 1' }}>
        <span className="block overflow-hidden" style={{ width: `${OPEN_W}em` }}>{dream}</span>
        {script('S')}
        {script('ign')}
      </span>
      {live}
    </span>
  )
}
