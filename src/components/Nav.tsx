// N2 floating glass pill, light-tuned. Mobile menu is BUILT, not omitted (nav law).
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { WA_LINK } from '../lib/hooks'
import { EASE_B } from '../lib/motion'

const LINKS = [
  { label: 'Početna', href: '/' },
  { label: 'Radovi', href: '/radovi' },
  { label: 'Usluge', href: '/usluge' },
  { label: 'Kontakt', href: '/kontakt' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <nav className="fixed top-4 inset-x-0 z-50 mx-auto w-[min(880px,calc(100%-2rem))] liquid-glass rounded-full px-5 py-2.5 flex items-center justify-between">
        <a href="/" className="flex items-center gap-1.5" aria-label="DreamSign — početna">
          <img src="/media/brand/cloud-d.webp" alt="" className="h-8 w-auto" />
          <span className="flex items-baseline leading-none">
            <span className="font-semibold text-ink text-[17px] tracking-tight">ream</span>
            <span className="font-script text-accent text-[24px] ml-0.5">Sign</span>
          </span>
        </a>
        <div className="hidden md:flex items-center gap-8">
          {LINKS.map((l, i) => (
            <a key={l.href} href={l.href}
               className={`text-sm font-medium transition-opacity hover:opacity-70 ${i === 0 ? 'text-ink' : 'text-ink/60'}`}>
              {l.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <a href={WA_LINK} target="_blank" rel="noopener"
             className="hidden sm:inline-block rounded-full bg-accent text-bg text-sm font-medium px-5 py-2 transition-transform hover:scale-105">
            Započnite razgovor
          </a>
          <button className="md:hidden p-1 text-ink" aria-label={open ? 'Zatvori meni' : 'Otvori meni'} onClick={() => setOpen(!open)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden flex flex-col items-center justify-center gap-8"
            style={{ background: 'rgba(245,249,253,0.96)', backdropFilter: 'blur(18px)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            {LINKS.map((l, i) => (
              <motion.a key={l.href} href={l.href} className="text-3xl font-semibold text-ink"
                initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ delay: 0.08 * i, duration: 0.5, ease: EASE_B }}
                onClick={() => setOpen(false)}>
                {l.label}
              </motion.a>
            ))}
            <motion.a href={WA_LINK} target="_blank" rel="noopener"
              className="mt-4 rounded-full bg-accent text-bg font-medium px-8 py-3.5 cta-glow"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5, ease: EASE_B }}>
              Započnite razgovor
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
