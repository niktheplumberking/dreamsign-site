// 404 — a page that wandered above the clouds. Stays in the brand world, offers the two
// real exits (home, WhatsApp), and tells robots not to index it.
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { GlossyPill } from '../components/Nav'
import { WA_LINK } from '../lib/hooks'
import { usePageMeta } from '../lib/meta'

export default function NotFound() {
  usePageMeta({
    title: 'Stranica nije pronađena — DreamSign',
    description: 'Tražena stranica ne postoji. Vratite se na početnu ili nam pišite na WhatsApp.',
    path: '/404',
    noindex: true,
  })

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 text-center">
      <img
        src="/media/hero-sky-still.webp" alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <img
        src="/media/hero-cloud-foreground.webp" alt="" aria-hidden
        className="absolute inset-x-0 bottom-[-6%] w-full object-cover pointer-events-none select-none"
      />
      <div className="relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          className="font-script text-accent leading-none text-[clamp(4rem,14vw,9rem)]"
          aria-hidden
        >
          404
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
          className="ink-gradient mt-2 font-semibold tracking-tight text-[clamp(1.6rem,3.6vw,2.6rem)]"
        >
          Stranica nije pronađena
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mt-4 max-w-[38ch] text-[16px] font-medium leading-relaxed text-ink/70"
          style={{ textShadow: '0 2px 20px rgba(245,249,253,0.9)' }}
        >
          Ova adresa je odlutala iznad oblaka. Vratite se na početnu — ili nam pišite, pa da razgovaramo.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-5"
        >
          <Link
            to="/"
            className="rounded-full border border-accent/50 px-7 py-2.5 text-[15px] font-semibold text-accent
                       transition-colors hover:border-accent hover:text-ink"
          >
            Nazad na početnu
          </Link>
          <GlossyPill href={WA_LINK} className="px-7 py-2.5 text-[15px]">
            Započnite razgovor
          </GlossyPill>
        </motion.div>
      </div>
    </main>
  )
}
