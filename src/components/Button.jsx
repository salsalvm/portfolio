import { motion } from 'framer-motion'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors duration-300'

const variants = {
  primary:
    'bg-accent text-white hover:bg-accent-soft shadow-[0_0_0_1px_rgba(0,155,107,0.4),0_12px_40px_rgba(0,155,107,0.25)]',
  secondary:
    'glass text-text hover:border-border-strong hover:bg-accent-dim',
  ghost:
    'border border-border text-muted hover:text-text hover:border-border-strong',
}

export default function Button({
  children,
  href,
  onClick,
  variant = 'primary',
  className = '',
  download,
  target,
  rel,
  type = 'button',
}) {
  const classes = `${base} ${variants[variant]} ${className}`

  if (href) {
    return (
      <motion.a
        href={href}
        download={download}
        target={target}
        rel={rel}
        className={classes}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
      >
        {children}
      </motion.a>
    )
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={classes}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.button>
  )
}
