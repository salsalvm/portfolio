import { motion } from 'framer-motion'
import { about } from '../data'
import SectionHeading from '../components/SectionHeading'
import GlassCard from '../components/GlassCard'
import SectionAccent from '../components/SectionAccent'

export default function About() {
  return (
    <section id="about" className="section-pad overflow-hidden">
      <SectionAccent side="left" />
      <div className="container-max">
        <SectionHeading title={about.title} subtitle={about.subtitle} />

        <div className="grid items-start gap-8 lg:grid-cols-[1.35fr_0.9fr] lg:gap-10">
          <motion.div
            className="relative space-y-4 border-l border-accent/25 pl-5 md:pl-6"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55 }}
          >
            {about.summary.map((paragraph, index) => (
              <p
                key={paragraph}
                className={`leading-relaxed text-muted ${
                  index === 0 ? 'text-base text-text/90 md:text-lg' : 'text-sm md:text-base'
                }`}
              >
                {paragraph}
              </p>
            ))}
          </motion.div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {about.highlights.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.94 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.45 }}
              >
                <GlassCard className="h-full p-4 sm:p-5" hover={false}>
                  <p className="font-display text-2xl font-bold tracking-tight text-accent md:text-3xl">
                    {item.value}
                  </p>
                  <p className="mt-1.5 text-[10px] uppercase tracking-[0.16em] text-muted sm:text-xs">
                    {item.label}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
