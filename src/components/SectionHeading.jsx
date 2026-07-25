import { motion } from 'framer-motion'

const variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
}

export default function SectionHeading({ title, subtitle, align = 'left' }) {
  return (
    <motion.div
      className={`mb-6 sm:mb-8 md:mb-10 ${align === 'center' ? 'text-center' : ''}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      variants={variants}
    >
      <div
        className={`mb-2.5 flex items-center gap-2.5 sm:mb-3 sm:gap-3 ${align === 'center' ? 'justify-center' : ''}`}
      >
        <span className="h-px w-6 bg-accent/70 sm:w-8" />
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-accent sm:text-xs sm:tracking-[0.28em]">
          {subtitle}
        </p>
      </div>
      <h2 className="font-display text-[1.75rem] font-bold tracking-[-0.03em] text-text sm:text-3xl md:text-4xl lg:text-[2.75rem]">
        {title}
      </h2>
      <div
        className={`mt-4 section-rule ${align === 'center' ? 'mx-auto' : ''}`}
        aria-hidden
      />
    </motion.div>
  )
}
