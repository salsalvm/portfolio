import { motion } from 'framer-motion'
import { FaGithub } from 'react-icons/fa6'
import { FiExternalLink } from 'react-icons/fi'
import GlassCard from './GlassCard'
import Button from './Button'

export default function ProjectCard({ project, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <GlassCard className="overflow-hidden p-0" hover={false}>
        <div className="relative overflow-hidden">
          <motion.img
            src={project.image}
            alt={project.name}
            className="h-40 w-full object-cover sm:h-48 md:h-56"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.5 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
        </div>

        <div className="space-y-4 p-4 sm:space-y-5 sm:p-5 md:p-7">
          <div>
            <h3 className="font-display text-xl font-semibold tracking-tight text-text sm:text-2xl md:text-3xl">{project.name}</h3>
            <p className="mt-2.5 text-sm leading-relaxed text-muted md:text-base">
              {project.overview}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-border bg-accent-dim px-3 py-1 text-xs text-accent"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-accent">
                Responsibilities
              </h4>
              <ul className="space-y-2 text-sm text-muted">
                {project.responsibilities.map((item) => (
                  <li key={item} className="leading-relaxed">
                    · {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-accent">
                Challenges Solved
              </h4>
              <ul className="space-y-2 text-sm text-muted">
                {project.challenges.map((item) => (
                  <li key={item} className="leading-relaxed">
                    · {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-accent">
              Key Features
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.features.map((feature) => (
                <span
                  key={feature}
                  className="rounded-full border border-border px-3 py-1 text-xs text-text/80"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            <Button href={project.github} target="_blank" rel="noopener noreferrer" variant="secondary">
              <FaGithub />
              GitHub
            </Button>
            <Button href={project.liveDemo} target="_blank" rel="noopener noreferrer">
              <FiExternalLink />
              {project.liveDemoLabel || 'Live Demo'}
            </Button>
          </div>
        </div>
      </GlassCard>
    </motion.article>
  )
}
