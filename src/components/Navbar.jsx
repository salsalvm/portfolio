import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { HiMenuAlt3, HiX } from 'react-icons/hi'
import { navigation, personal } from '../data'
import { useActiveSection } from '../hooks/useActiveSection'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const sectionIds = navigation.links.map((link) => link.id)
  const activeId = useActiveSection(sectionIds)

  const handleNav = (href) => {
    setOpen(false)
    const id = href.replace('#', '')
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className="fixed inset-x-0 top-0 z-[60]">
      <div className="section-pad !py-4">
        <nav className="container-max glass-strong flex items-center justify-between rounded-2xl px-4 py-3 md:px-6">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault()
              handleNav('#home')
            }}
            className="font-display text-lg font-semibold tracking-tight text-text"
          >
            {personal.firstName}
            <span className="text-accent"> {personal.lastName}</span>
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {navigation.links.map((link) => {
              const active = activeId === link.id
              return (
                <li key={link.id}>
                  <button
                    type="button"
                    onClick={() => handleNav(link.href)}
                    className={`relative rounded-full px-3 py-2 text-sm transition-colors ${
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
            className="glass flex h-10 w-10 items-center justify-center rounded-full text-text lg:hidden"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <HiX size={20} /> : <HiMenuAlt3 size={20} />}
          </button>
        </nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="section-pad !pt-0 lg:hidden"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            <div className="container-max glass-strong rounded-2xl p-4">
              <ul className="flex flex-col gap-1">
                {navigation.links.map((link) => (
                  <li key={link.id}>
                    <button
                      type="button"
                      onClick={() => handleNav(link.href)}
                      className={`w-full rounded-xl px-4 py-3 text-left text-sm ${
                        activeId === link.id
                          ? 'bg-accent-dim text-accent'
                          : 'text-muted hover:bg-white/5 hover:text-text'
                      }`}
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
