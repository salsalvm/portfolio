import { motion } from 'framer-motion'
import GlassCard from './GlassCard'

export default function TimelineItem({
  title,
  subtitle,
  meta,
  period,
  body,
  index,
}) {
  return (
    <motion.div
      className="relative grid gap-3 sm:gap-6 md:grid-cols-[160px_1fr] lg:grid-cols-[180px_1fr]"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <div className="md:pt-2">
        <p className="text-sm font-medium text-accent">{period}</p>
        {meta && <p className="mt-1 text-xs text-muted">{meta}</p>}
      </div>

      <div className="relative pl-5 sm:pl-6 md:pl-10">
        <span className="absolute left-0 top-3 h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_0_5px_rgba(0,155,107,0.15)] sm:h-3 sm:w-3 md:left-3" />
        <span className="absolute left-[4px] top-6 bottom-[-2rem] w-px bg-border sm:left-[5px] md:left-[17px]" />

        <GlassCard className="p-4 sm:p-6 md:p-8" hover={false}>
          <h3 className="font-display text-lg font-semibold tracking-tight text-text sm:text-xl md:text-2xl">{title}</h3>
          <p className="mt-1 text-sm text-muted">{subtitle}</p>
          {body}
        </GlassCard>
      </div>
    </motion.div>
  )
}
