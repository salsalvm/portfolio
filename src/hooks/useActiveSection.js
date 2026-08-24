import { useEffect, useState } from 'react'

/**
 * Tracks which section is active based on scroll position.
 * Prefers the last section whose top has crossed the offset line
 * (more reliable than IntersectionObserver for short vs tall sections).
 */
export function useActiveSection(sectionIds, offset = 120) {
  const [activeId, setActiveId] = useState(sectionIds[0] ?? '')
  const idsKey = sectionIds.join('|')

  useEffect(() => {
    const ids = idsKey ? idsKey.split('|') : []
    if (!ids.length) return undefined

    const update = () => {
      const scrollY = window.scrollY + offset + 1
      let current = ids[0]

      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        if (el.offsetTop <= scrollY) current = id
      }

      // Near page bottom: prefer the last section
      const nearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 80
      if (nearBottom) current = ids[ids.length - 1]

      setActiveId((prev) => (prev === current ? prev : current))
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [idsKey, offset])

  return activeId
}
