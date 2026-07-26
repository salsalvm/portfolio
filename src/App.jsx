import { useEffect, useState } from 'react'
import { personal } from './data'
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
    document.title = personal.seo.title

    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', personal.seo.description)
    }

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
