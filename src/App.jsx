import { useEffect, useState } from 'react'
import { personal } from './data'
import { initAnalytics } from './lib/analytics'
import { trackUniqueVisitor } from './lib/visitors'
import LoadingScreen from './components/LoadingScreen'
import ScrollProgress from './components/ScrollProgress'
import Navbar from './components/Navbar'
import MobileTabBar from './components/MobileTabBar'
import BackToTop from './components/BackToTop'
import Footer from './components/Footer'
import Hero from './sections/Hero'
import About from './sections/About'
import Skills from './sections/Skills'
import Experience from './sections/Experience'
import Projects from './sections/Projects'
import Education from './sections/Education'
import Contact from './sections/Contact'

export default function App() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    initAnalytics(personal.gaMeasurementId || import.meta.env.VITE_GA_MEASUREMENT_ID)
    trackUniqueVisitor()
  }, [])

  useEffect(() => {
    const { seo, siteUrl } = personal

    document.title = seo.title

    const setMeta = (selector, attribute, value) => {
      const element = document.querySelector(selector)
      if (element) element.setAttribute(attribute, value)
    }

    setMeta('meta[name="description"]', 'content', seo.description)
    setMeta('meta[name="keywords"]', 'content', seo.keywords)
    setMeta('link[rel="canonical"]', 'href', `${siteUrl}/`)
    setMeta('meta[property="og:title"]', 'content', seo.title)
    setMeta('meta[property="og:description"]', 'content', seo.description)
    setMeta('meta[property="og:url"]', 'content', `${siteUrl}/`)
    setMeta('meta[property="og:image"]', 'content', seo.ogImage)
    setMeta('meta[name="twitter:title"]', 'content', seo.title)
    setMeta('meta[name="twitter:description"]', 'content', seo.description)
    setMeta('meta[name="twitter:image"]', 'content', seo.ogImage)

    const timer = setTimeout(() => setReady(true), 1200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <LoadingScreen ready={ready} />
      <ScrollProgress />
      <Navbar />
      <main className="pb-24 lg:pb-0">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Education />
        <Contact />
      </main>
      <Footer />
      <MobileTabBar />
      <BackToTop />
    </>
  )
}
