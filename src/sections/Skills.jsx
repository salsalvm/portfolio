import { motion } from 'framer-motion'
import {
  FiSmartphone,
  FiMonitor,
  FiServer,
  FiDatabase,
  FiLayers,
  FiTool,
} from 'react-icons/fi'
import { skills } from '../data'
import SectionHeading from '../components/SectionHeading'
import GlassCard from '../components/GlassCard'
import SectionAccent from '../components/SectionAccent'

const iconMap = {
  mobile: FiSmartphone,
  frontend: FiMonitor,
  backend: FiServer,
  database: FiDatabase,
  architecture: FiLayers,
  tools: FiTool,
}

export default function Skills() {
  return (
    <section id="skills" className="section-pad overflow-hidden">
      <SectionAccent side="right" />
      <div className="container-max">
        <SectionHeading title={skills.title} subtitle={skills.subtitle} />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {skills.categories.map((category, index) => {
            const Icon = iconMap[category.icon] || FiLayers
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.06, duration: 0.5 }}
              >
                <GlassCard className="h-full p-5" hover>
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-dim text-accent">
                      <Icon size={18} />
                    </span>
                    <h3 className="text-base font-medium text-text">{category.name}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted transition-colors hover:border-border-strong hover:text-accent"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
