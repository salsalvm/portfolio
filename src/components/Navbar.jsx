import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { HiMenuAlt3, HiX } from 'react-icons/hi'
import { navigation, personal } from '../data'
import { useActiveSection } from '../hooks/useActiveSection'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const sectionIds = navigation.links.map((link) => link.id)
  const activeId = useActiveSection(sectionIds)

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const handleNav = (href) => {
    setOpen(false)
    const id = href.replace('#', '')
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className="fixed inset-x-0 top-0 z-[60]">
      <div className="px-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6 lg:px-12 lg:pt-4">
        <nav className="container-max glass-strong flex items-center justify-between rounded-2xl px-3 py-2.5 sm:px-5 sm:py-3">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault()
              handleNav('#home')
            }}
            className="font-display text-base font-semibold tracking-tight text-text sm:text-lg"
          >
            {personal.firstName}
            <span className="text-accent"> {personal.lastName}</span>
          </a>

          <ul className="hidden items-center gap-0.5 lg:flex">
            {navigation.links.map((link) => {
              const active = activeId === link.id
              return (
                <li key={link.id}>
                  <button
                    type="button"
                    onClick={() => handleNav(link.href)}
                    className={`relative rounded-full px-2.5 py-2 text-[13px] transition-colors xl:px-3 ${
                      active ? 'text-accent' : 'text-muted hover:text-text'
                    }`}
                  >
                    {link.label}
                    {active && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 -z-10 rounded-full bg-accent-dim"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                </li>
              )
            })}
          </ul>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-text lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <HiX size={20} /> : <HiMenuAlt3 size={20} />}
          </button>
        </nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-bg/70 backdrop-blur-sm"
              aria-label="Close menu overlay"
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="absolute inset-x-3 top-[4.75rem] max-h-[min(70vh,28rem)] overflow-y-auto rounded-2xl border border-border bg-bg-elevated p-3 shadow-2xl sm:inset-x-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <ul className="flex flex-col gap-1">
                {navigation.links.map((link) => (
                  <li key={link.id}>
                    <button
                      type="button"
                      onClick={() => handleNav(link.href)}
                      className={`w-full rounded-xl px-4 py-3.5 text-left text-sm ${
                        activeId === link.id
                          ? 'bg-accent-dim text-accent'
                          : 'text-muted active:bg-white/5'
                      }`}
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
