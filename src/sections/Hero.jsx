import { motion } from 'framer-motion'
import { FiDownload, FiMail, FiArrowDown } from 'react-icons/fi'
import { personal } from '../data'
import Button from '../components/Button'
import SocialLinks from '../components/SocialLinks'
import TypeWriter from '../components/TypeWriter'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] flex-col justify-start overflow-x-clip section-pad !pb-28 !pt-[5.5rem] sm:!pt-28 lg:justify-center lg:!pb-24 lg:!pt-28"
    >
      <div className="pointer-events-none absolute inset-0 grid-noise opacity-40" />
      <div className="pointer-events-none absolute -left-24 top-1/4 h-56 w-56 rounded-full bg-accent/10 blur-[90px] sm:h-72 sm:w-72" />
      <div className="pointer-events-none absolute -right-16 bottom-1/4 h-48 w-48 rounded-full bg-accent-soft/10 blur-[80px] sm:h-64 sm:w-64" />

      <div className="container-max relative flex w-full flex-col items-center lg:grid lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-10 xl:gap-14">
        {/* Mobile: compact profile + identity stack */}
        <div className="flex w-full flex-col items-center lg:contents">
          <motion.div
            className="relative mb-5 aspect-square w-36 shrink-0 sm:mb-6 sm:w-44 md:w-48 lg:order-2 lg:mb-0 lg:w-full lg:max-w-[21rem]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="profile-ring absolute inset-0 rounded-full p-[2.5px] sm:p-[3px]">
              <div className="h-full w-full rounded-full bg-bg" />
            </div>
            <div className="absolute inset-[6px] overflow-hidden rounded-full bg-bg-elevated sm:inset-[9px]">
              <img
                src={personal.profileImage}
                alt={`${personal.name} profile`}
                className="profile-photo"
              />
            </div>
          </motion.div>

          <div className="relative w-full max-w-xl text-center lg:order-1 lg:max-w-none lg:text-left">
            <motion.div
              className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-2.5 py-1 sm:mb-4 sm:px-3 sm:py-1.5"
              custom={0}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex h-full w-full rounded-full bg-accent" />
              </span>
              <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-accent sm:text-[11px] sm:tracking-[0.22em]">
                Available for opportunities
              </span>
            </motion.div>

            <motion.h1
              className="font-display text-[2rem] font-bold leading-[1.08] tracking-[-0.03em] text-text sm:text-5xl md:text-6xl lg:text-[4.1rem]"
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              {personal.name}
            </motion.h1>

            <motion.div
              className="mt-2.5 min-h-[1.5rem] text-[0.9rem] font-medium text-muted sm:mt-4 sm:min-h-[1.75rem] sm:text-base md:text-lg"
              custom={2}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              <TypeWriter words={personal.roles} />
            </motion.div>

            <motion.p
              className="mx-auto mt-3 max-w-[22rem] text-[0.85rem] leading-relaxed text-muted sm:mt-5 sm:max-w-lg sm:text-[0.95rem] md:text-base lg:mx-0"
              custom={3}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              {personal.headline}
            </motion.p>

            <motion.div
              className="mt-5 flex w-full flex-row gap-2.5 sm:mt-7 sm:flex-wrap sm:justify-center sm:gap-3 lg:justify-start"
              custom={4}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              <Button
                href={personal.resumeUrl}
                download
                className="min-w-0 flex-1 px-3 text-xs sm:flex-none sm:px-6 sm:text-sm"
              >
                <FiDownload className="shrink-0" />
                <span className="truncate">Resume</span>
              </Button>
              <Button
                href="#contact"
                variant="secondary"
                className="min-w-0 flex-1 px-3 text-xs sm:flex-none sm:px-6 sm:text-sm"
              >
                <FiMail className="shrink-0" />
                <span className="truncate">Contact</span>
              </Button>
            </motion.div>

            <motion.div
              className="mt-5 flex justify-center sm:mt-7 lg:justify-start"
              custom={5}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              <SocialLinks social={personal.social} />
            </motion.div>
          </div>
        </div>
      </div>

      <motion.a
        href="#about"
        className="absolute bottom-24 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-muted transition-colors hover:text-accent md:flex lg:bottom-8"
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
