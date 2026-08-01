// GALAXY HOME STRUCTURAL REPLICA — Section 1: Navbar (fixed, centered, floating pill).
// Exact classes; swaps: clover SVG → cloud-D, palette, Serbian links, WhatsApp CTA.
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { WA_LINK } from '../lib/hooks'
import Lockup from './Lockup'

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
  const [marked, setMarked] = useState(false) // the DS mark opens into the full name
  const { pathname } = useLocation()
  return (
    <>
      <div className="fixed top-0 inset-x-0 z-[60] flex justify-center px-4 pt-4 md:pt-6">
        <nav
          className="flex items-center rounded-full bg-[#DCEBF8]/40 backdrop-blur-[15px]
                     border border-white/75 gap-4 md:gap-6 lg:gap-12 px-4 py-3"
          style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.75), 0 6px 24px rgba(22,50,79,0.06)' }}
        >
          {/* the DS mark; hover or keyboard focus opens it into the full name */}
          <Link
            to="/" aria-label="DreamSign — početna"
            className="flex items-baseline leading-none text-[19px] md:text-[24px] rounded-sm
                       outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
            onMouseEnter={() => setMarked(true)}
            onMouseLeave={() => setMarked(false)}
            onFocus={() => setMarked(true)}
            onBlur={() => setMarked(false)}
          >
            <Lockup expanded={marked} />
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm">
            {LINKS.map((l) => (
              <Link key={l.href} to={l.href}
                 aria-current={pathname === l.href ? 'page' : undefined}
                 className={pathname === l.href ? 'text-ink' : 'text-ink/55 hover:text-ink transition-colors'}>
                {l.label}
              </Link>
            ))}
          </div>
          {/* wrapper, not `hidden` on the pill itself: `hidden` and `inline-block` are the same
              display utility, so the later one in Tailwind's sheet always won and the CTA never hid */}
          <span className="hidden sm:block">
            <GlossyPill href={WA_LINK} className="px-6 py-2 text-[15px] whitespace-nowrap">
              Započnite razgovor
            </GlossyPill>
          </span>
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
              <motion.div key={l.href}
                initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ delay: 0.08 * i, duration: 0.5 }}>
                <Link to={l.href} className="text-3xl font-semibold text-ink" onClick={() => setOpen(false)}>
                  {l.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
