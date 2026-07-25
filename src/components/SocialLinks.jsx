import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa6'
import { motion } from 'framer-motion'

const iconMap = {
  github: FaGithub,
  linkedin: FaLinkedin,
  email: FaEnvelope,
}

export default function SocialLinks({ social, className = '', size = 18 }) {
  const items = [
    { key: 'github', href: social.github, label: 'GitHub' },
    { key: 'linkedin', href: social.linkedin, label: 'LinkedIn' },
    { key: 'email', href: social.email, label: 'Email' },
  ]

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {items.map(({ key, href, label }) => {
        const Icon = iconMap[key]
        return (
          <motion.a
            key={key}
            href={href}
            target={key === 'email' ? undefined : '_blank'}
            rel={key === 'email' ? undefined : 'noopener noreferrer'}
            aria-label={label}
            className="glass flex h-10 w-10 items-center justify-center rounded-full text-muted transition-colors hover:border-border-strong hover:text-accent sm:h-11 sm:w-11"
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon size={size} />
          </motion.a>
        )
      })}
    </div>
  )
}
