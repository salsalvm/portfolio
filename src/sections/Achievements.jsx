import { motion } from 'framer-motion'
import { achievements } from '../data'
import SectionHeading from '../components/SectionHeading'
import GlassCard from '../components/GlassCard'
import AnimatedCounter from '../components/AnimatedCounter'

export default function Achievements() {
  return (
    <section id="achievements" className="section-pad">
      <div className="container-max">
        <SectionHeading title={achievements.title} subtitle={achievements.subtitle} />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06, duration: 0.45 }}
            >
              <GlassCard className="h-full p-5 md:p-6" hover>
                <AnimatedCounter
                  value={item.value}
                  suffix={item.suffix}
                  className="font-display text-3xl font-bold tracking-tight text-accent md:text-4xl"
                />
                <h3 className="mt-2.5 text-base font-medium text-text">{item.label}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
