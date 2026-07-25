import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function TypeWriter({ words, className = '' }) {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = words[index % words.length]
    const speed = deleting ? 36 : 70

    const timer = setTimeout(() => {
      if (!deleting && text === current) {
        setTimeout(() => setDeleting(true), 1400)
        return
      }

      if (deleting && text === '') {
        setDeleting(false)
        setIndex((prev) => (prev + 1) % words.length)
        return
      }

      setText((prev) =>
        deleting ? current.slice(0, prev.length - 1) : current.slice(0, prev.length + 1),
      )
    }, speed)

    return () => clearTimeout(timer)
  }, [text, deleting, index, words])

  return (
    <span className={className}>
      <AnimatePresence mode="wait">
        <motion.span
          key={text}
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 1 }}
          className="text-accent"
        >
          {text}
        </motion.span>
      </AnimatePresence>
      <span className="ml-0.5 inline-block h-[1.05em] w-[2px] animate-pulse bg-accent align-[-0.12em]" />
    </span>
  )
}
