// GALAXY HOME STRUCTURAL REPLICA — Section 4: Content/Description block (inside mountain wrapper).
// Exact container/typography values; content + palette swapped (h1 for SEO weight).
import { WA_LINK } from '../../lib/hooks'
import { GlossyPill } from '../Nav'

export default function Opis() {
  return (
    <div className="flex flex-col items-center px-5 sm:px-6 py-16 md:py-32 text-center">
      <h1
        className="max-w-[600px] text-sm sm:text-base md:text-lg font-medium text-ink/90 leading-relaxed"
        style={{ textShadow: '2px 4px 26px rgba(245, 249, 253, 0.9)' }}
      >
        Pravimo sajtove koji pretvaraju posetioce u kupce — mi pretvaramo vaše poslovne snove
        u realnost, a na vama je da potpisujete ugovore.
      </h1>
      <GlossyPill href={WA_LINK} className="mt-6 sm:mt-7 px-8 sm:px-10 py-2.5 sm:py-3 text-base sm:text-lg">
        Započnite razgovor
      </GlossyPill>
    </div>
  )
}
