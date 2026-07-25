import { motion } from 'framer-motion'
import { FiDownload, FiMail, FiArrowDown } from 'react-icons/fi'
import { personal } from '../data'
import Button from '../components/Button'
import SocialLinks from '../components/SocialLinks'
import TypeWriter from '../components/TypeWriter'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-x-clip section-pad !py-24 md:!py-28"
    >
      <div className="pointer-events-none absolute inset-0 grid-noise opacity-40" />
      <div className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-accent/10 blur-[100px]" />
      <div className="pointer-events-none absolute -right-16 bottom-1/4 h-64 w-64 rounded-full bg-accent-soft/10 blur-[90px]" />

      <div className="container-max relative grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8 xl:gap-12">
        <div className="relative">
          <motion.div
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5"
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-accent">
              Available for opportunities
            </span>
          </motion.div>

          <motion.h1
            className="font-display text-[2.75rem] font-bold leading-[1.05] tracking-[-0.03em] text-text sm:text-5xl md:text-6xl lg:text-[4.1rem]"
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            {personal.name}
          </motion.h1>

          <motion.div
            className="mt-4 min-h-[1.75rem] text-base font-medium text-muted md:text-lg"
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <TypeWriter words={personal.roles} />
          </motion.div>

          <motion.p
            className="mt-5 max-w-lg text-[0.95rem] leading-relaxed text-muted md:text-base"
            custom={3}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            {personal.headline}
          </motion.p>

          <motion.div
            className="mt-7 flex flex-wrap gap-3"
            custom={4}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <Button href={personal.resumeUrl} download>
              <FiDownload />
              Download Resume
            </Button>
            <Button href="#contact" variant="secondary">
              <FiMail />
              Contact Me
            </Button>
          </motion.div>

          <motion.div
            className="mt-7"
            custom={5}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <SocialLinks social={personal.social} />
          </motion.div>
        </div>

        <motion.div
          className="relative mx-auto aspect-square w-full max-w-[18.5rem] sm:max-w-[20.5rem] lg:max-w-[22rem]"
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="profile-ring absolute inset-0 rounded-full p-[3px]">
            <div className="h-full w-full rounded-full bg-bg" />
          </div>

          <div className="absolute inset-[8px] overflow-hidden rounded-full bg-bg-elevated sm:inset-[10px]">
            <img
              src={personal.profileImage}
              alt={`${personal.name} profile`}
              className="profile-photo"
            />
          </div>
        </motion.div>
      </div>

      <motion.a
        href="#about"
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-muted transition-colors hover:text-accent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 6, 0] }}
        transition={{
          opacity: { delay: 1.2, duration: 0.5 },
          y: { delay: 1.4, duration: 1.8, repeat: Infinity, ease: 'easeInOut' },
        }}
      >
        <span className="text-[10px] uppercase tracking-[0.28em]">Scroll</span>
        <FiArrowDown size={16} />
      </motion.a>
    </section>
  )
}
