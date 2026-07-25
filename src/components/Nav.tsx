// GALAXY HOME STRUCTURAL REPLICA — Section 1: Navbar (fixed, centered, floating pill).
// Exact classes; swaps: clover SVG → cloud-D, palette, Serbian links, WhatsApp CTA.
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { WA_LINK } from '../lib/hooks'

const LINKS = [
  { label: 'Početna', href: '/' },
  { label: 'Radovi', href: '/radovi' },
  { label: 'Usluge', href: '/usluge' },
  { label: 'Kontakt', href: '/kontakt' },
]

export function GlossyPill({ href, className = '', children }: { href: string; className?: string; children: React.ReactNode }) {
  return (
    <a
      href={href} target="_blank" rel="noopener"
      className={`rounded-full border border-white/80 font-medium text-ink/80 drop-shadow-sm transition-transform hover:scale-105 inline-block ${className}`}
      style={{
        background:
          'linear-gradient(180deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.10) 76%), radial-gradient(ellipse at 50% 100%, rgba(255,255,255,0.7) 0%, transparent 100%), #A8CEF0',
      }}
    >
      {children}
    </a>
  )
}

export default function Nav() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <div className="fixed top-0 inset-x-0 z-[60] flex justify-center px-4 pt-4 md:pt-6">
        <nav className="flex items-center rounded-full bg-[#DCEBF8]/40 backdrop-blur-[15px] gap-4 md:gap-8 lg:gap-20 px-4 py-3">
          <a href="/" className="flex items-center gap-2" aria-label="DreamSign — početna">
            <img src="/media/brand/cloud-d.webp" alt="" className="h-6 w-auto md:h-7" />
            <span className="text-base md:text-xl font-medium text-ink leading-none">
              Dream<span className="font-script text-accent text-[1.25em] align-middle">Sign</span>
            </span>
          </a>
          <div className="hidden md:flex items-center gap-6 text-sm">
            {LINKS.map((l, i) => (
              <a key={l.href} href={l.href}
                 className={i === 0 ? 'text-ink' : 'text-ink/55 hover:text-ink transition-colors'}>
                {l.label}
              </a>
            ))}
          </div>
          <GlossyPill href={WA_LINK} className="hidden sm:inline-block px-6 py-2 text-[15px]">
            Započnite razgovor
          </GlossyPill>
          <button className="md:hidden flex flex-col justify-center gap-[5px] p-1" aria-label={open ? 'Zatvori meni' : 'Otvori meni'} onClick={() => setOpen(!open)}>
            <motion.span animate={open ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }} className="block h-[2px] w-6 bg-ink rounded" />
            <motion.span animate={open ? { opacity: 0 } : { opacity: 1 }} className="block h-[2px] w-6 bg-ink rounded" />
            <motion.span animate={open ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }} className="block h-[2px] w-6 bg-ink rounded" />
          </button>
        </nav>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 md:hidden flex flex-col items-center justify-center gap-8 bg-bg/95 backdrop-blur-xl"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            {LINKS.map((l, i) => (
              <motion.a key={l.href} href={l.href} className="text-3xl font-semibold text-ink"
                initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ delay: 0.08 * i, duration: 0.5 }}
                onClick={() => setOpen(false)}>
                {l.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
