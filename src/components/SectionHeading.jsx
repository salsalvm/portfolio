import { motion } from 'framer-motion'

const variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
}

export default function SectionHeading({ title, subtitle, align = 'left' }) {
  return (
    <motion.div
      className={`mb-8 md:mb-10 ${align === 'center' ? 'text-center' : ''}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      variants={variants}
    >
      <div
        className={`mb-3 flex items-center gap-3 ${align === 'center' ? 'justify-center' : ''}`}
      >
        <span className="h-px w-8 bg-accent/70" />
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-accent">
          {subtitle}
        </p>
      </div>
      <h2 className="font-display text-3xl font-bold tracking-[-0.03em] text-text md:text-4xl lg:text-[2.75rem]">
        {title}
      </h2>
      <div
        className={`mt-4 section-rule ${align === 'center' ? 'mx-auto' : ''}`}
        aria-hidden
      />
    </motion.div>
  )
}
