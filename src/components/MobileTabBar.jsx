import { FiHome, FiUser, FiCode, FiFolder, FiMail } from 'react-icons/fi'
import { useActiveSection } from '../hooks/useActiveSection'

const tabs = [
  { id: 'home', label: 'Home', href: '#home', icon: FiHome },
  { id: 'about', label: 'About', href: '#about', icon: FiUser },
  { id: 'skills', label: 'Skills', href: '#skills', icon: FiCode },
  { id: 'projects', label: 'Work', href: '#projects', icon: FiFolder },
  { id: 'contact', label: 'Contact', href: '#contact', icon: FiMail },
]

const tabIds = tabs.map((tab) => tab.id)

export default function MobileTabBar() {
  const activeId = useActiveSection(tabIds)

  const handleNav = (href) => {
    const id = href.replace('#', '')
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-[60] px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 lg:hidden"
      aria-label="Mobile navigation"
    >
      <div className="glass-strong mx-auto flex max-w-md items-stretch justify-between gap-1 rounded-2xl px-2 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const active = activeId === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleNav(tab.href)}
              className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-1 py-2 transition-colors ${
                active ? 'bg-accent-dim text-accent' : 'text-muted'
              }`}
            >
              <Icon size={18} strokeWidth={active ? 2.4 : 2} />
              <span className="truncate text-[10px] font-medium tracking-wide">
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
