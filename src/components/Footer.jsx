import { personal } from '../data'
import SocialLinks from './SocialLinks'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border section-pad !pb-28 !pt-10 lg:!py-12">
      <div className="container-max flex flex-col items-center gap-5 text-center md:flex-row md:justify-between md:text-left">
        <div>
          <p className="font-display text-lg font-semibold tracking-tight text-text sm:text-xl">
            {personal.name}
          </p>
          <p className="mt-1 text-xs text-muted sm:text-sm">
            Senior Flutter Developer · Mobile Engineer · Full Stack Developer
          </p>
        </div>

        <SocialLinks social={personal.social} />

        <p className="text-xs text-muted sm:text-sm">
          © {year} {personal.name}. Built with React & Tailwind.
        </p>
      </div>
    </footer>
  )
}
