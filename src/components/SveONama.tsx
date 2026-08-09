// SVE O NAMA — Nick's own composition, shared by /radovi and /usluge (batch 28).
// THE DEFAULT COPY IS HIS, VERBATIM, AND LOCKED (owner's instruction 2026-08-03: "dont
// touch SVE O NAMA") — /radovi renders it untouched. Batch 30 (owner): ONLY the words
// may differ between pages — "revert to the layout we used to have and just change the
// text. Nothing else, period." Every class below is identical for both pages; no size
// or position override exists.
import { motion } from 'motion/react'

export default function SveONama({
  wordTop = 'SVE',
  wordFloat = 'O',
  wordBottom = 'NAMA',
  para1 = 'Naša strast je vođenje klijenata da pronađu svoj jedinstveni glas u svetu vizuelnih komunikacija, kreirajući brendove sa smislom i emocijom, bez da budemo samo još jedan u nizu. Otkrijte lepotu autentičnosti i snagu izuzetnog dizajna.',
  para2 = 'Kroz pažljivo osmišljene strategije i posvećenost detaljima, stvaramo vizuelne identitete i digitalna iskustva koja inspirišu i ostavljaju trajan utisak.',
  circle = true,
}: {
  wordTop?: string
  wordFloat?: string
  wordBottom?: string
  para1?: string
  para2?: string
  /** batch 32 (owner): /usluge hands its ring to the process wheel — the circle is
      deleted there and lives on the wheel instead; /radovi keeps it untouched */
  circle?: boolean
}) {
  return (
    <>
    {/* ── PHONES (batch 51, owner) ─────────────────────────────────────────────────
        The composition below is absolute inside a full SCREEN: on a phone that stretched
        the four pieces to the four corners, so „NAMA" sat a whole viewport under the text
        with voids between everything. Here the same five elements stand in flow, in the
        same reading order, tight and aligned to one left edge — the words keep their step
        (O to the right, NAMA indented) but nothing is pinned to a screen edge. Below sm
        only; every class in the desktop block is the original, untouched. ------------- */}
    <div className="relative w-full select-none px-6 text-ink sm:hidden">
      {circle && (
        <div
          aria-hidden
          className="pointer-events-none absolute -left-[120px] top-[38%] z-0 h-[420px] w-[420px] -translate-y-1/2 rounded-full border border-ink/25"
        />
      )}
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 font-bold uppercase leading-[0.82] tracking-tight text-ink"
      >
        <span className="block text-[4.2rem]">{wordTop}</span>
        <span className="block pl-[42%] text-[4.2rem]">{wordFloat}</span>
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-20 mt-8 flex flex-col gap-5"
      >
        <p className="text-[15px] font-medium leading-relaxed text-ink/95">{para1}</p>
        <p className="text-[15px] font-medium leading-relaxed text-ink/95">{para2}</p>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        aria-hidden
        className="relative z-10 mt-6 pl-[14%] font-bold uppercase leading-[0.82] tracking-tight text-ink text-[4.2rem]"
      >
        {wordBottom}
      </motion.p>
    </div>

    {/* ── sm AND UP: the original composition, exactly as approved ───────────────── */}
    <div className="relative hidden h-screen max-h-screen min-h-screen w-full select-none flex-col justify-between px-6 text-ink sm:flex sm:px-10 lg:px-14">
      {/* the thin decorative circle poking off the left edge */}
      {circle && (
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 z-0 -translate-y-1/2 rounded-full border border-ink/25
                     -left-[100px] h-[480px] w-[480px] sm:-left-[140px] sm:h-[680px] sm:w-[680px]
                     md:-left-[180px] md:h-[850px] md:w-[850px] lg:-left-[200px] lg:h-[1020px] lg:w-[1020px]"
        />
      )}

      {/* the lone floating word, upper right */}
      <motion.span
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none absolute z-10 block -translate-y-1/2 font-bold uppercase leading-none tracking-tight text-ink
                   top-[28%] right-[14%] text-[5.25rem] sm:top-[32%] sm:right-[18%] sm:text-[7.75rem]
                   md:right-[22%] md:text-[min(9.75rem,10.4vw)] lg:top-[35%] lg:right-[25%] lg:text-[min(11.75rem,9.6vw)] xl:text-[min(13.25rem,10.2vw)]"
        aria-hidden
      >
        {wordFloat}
      </motion.span>

      {/* centre-left text block */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="absolute z-20 w-full max-w-xs -translate-y-1/2 px-2 text-left
                   top-[55%] left-[14%] sm:top-[58%] sm:left-[18%] sm:max-w-md md:left-[22%] lg:max-w-lg"
      >
        <p className="text-base font-medium leading-relaxed text-ink/95 sm:text-lg lg:text-xl xl:text-[1.375rem]">
          {para1}
        </p>
      </motion.div>

      {/* lower-right text block */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="absolute z-20 w-full max-w-xs px-2 text-left
                   bottom-20 right-8 sm:bottom-28 sm:right-16 sm:max-w-md md:right-24 lg:bottom-36 lg:right-32 lg:max-w-lg"
      >
        <p className="text-base font-medium leading-relaxed text-ink/95 sm:text-lg lg:text-xl xl:text-[1.375rem]">
          {para2}
        </p>
      </motion.div>

      {/* top word and bottom word, stepping right — the section's h2 reads whole */}
      <h2 className="pointer-events-none relative z-10 mx-auto flex h-full w-full max-w-[1700px] flex-col justify-between pt-20 pb-4 sm:pt-24 sm:pb-6 lg:pt-28">
        <motion.span
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="block w-full pl-10 text-left font-bold uppercase leading-[0.8] tracking-tight text-ink
                     text-[4.5rem] sm:pl-24 sm:text-[7rem] md:pl-36 md:text-[min(9rem,9.6vw)] lg:pl-48 lg:text-[min(11rem,9vw)] xl:text-[min(13rem,10vw)]"
        >
          {wordTop}
        </motion.span>
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="-mt-4 block w-full pl-16 text-left font-bold uppercase leading-[0.8] tracking-tight text-ink
                     text-[4.5rem] sm:-mt-6 sm:pl-36 sm:text-[7rem] md:pl-52 md:text-[min(9rem,9.6vw)] lg:-mt-8 lg:pl-64 lg:text-[min(11rem,9vw)] xl:text-[min(13rem,10vw)]"
        >
          {wordBottom}
        </motion.span>
      </h2>
    </div>
    </>
  )
}
