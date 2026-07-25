import { AnimatePresence, motion } from 'framer-motion'

export default function LoadingScreen({ ready }) {
  return (
    <AnimatePresence>
      {!ready && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-bg"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.55, ease: 'easeInOut' } }}
        >
          <div className="absolute inset-0 grid-noise opacity-40" />
          <div className="relative flex flex-col items-center gap-6">
            <motion.div
              className="flex h-20 w-20 items-center justify-center rounded-[1.4rem] border border-border-strong bg-accent-dim"
              animate={{ scale: [1, 1.06, 1], rotate: [0, 2, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span className="font-display text-3xl text-accent">SV</span>
            </motion.div>
            <div className="h-[2px] w-40 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full bg-accent"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted">Loading portfolio</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
