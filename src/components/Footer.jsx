import { personal } from '../data'
import SocialLinks from './SocialLinks'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border section-pad !py-12">
      <div className="container-max flex flex-col items-center justify-between gap-6 md:flex-row">
        <div>
          <p className="font-display text-xl font-semibold tracking-tight text-text">
            {personal.name}
          </p>
          <p className="mt-1 text-sm text-muted">
            Senior Flutter Developer · Mobile Engineer · Full Stack Developer
          </p>
        </div>

        <SocialLinks social={personal.social} />

        <p className="text-sm text-muted">
          © {year} {personal.name}. Built with React & Tailwind.
        </p>
      </div>
    </footer>
  )
}
