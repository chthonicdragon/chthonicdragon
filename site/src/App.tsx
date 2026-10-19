import { MotionConfig } from 'framer-motion'
import { KnowledgeGraphBackground } from '@/components/effects/KnowledgeGraphBackground'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/sections/Hero'
import { About } from '@/components/sections/About'
import { HowIBuild } from '@/components/sections/HowIBuild'
import { Principles } from '@/components/sections/Principles'
import { SelectedWork } from '@/components/sections/SelectedWork'
import { Research } from '@/components/sections/Research'
import { OtherProjects } from '@/components/sections/OtherProjects'
import { Stack } from '@/components/sections/Stack'
import { CurrentFocus } from '@/components/sections/CurrentFocus'
import { Contact } from '@/components/sections/Contact'

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-fg focus:px-4 focus:py-2 focus:text-sm focus:text-bg"
      >
        Skip to content
      </a>
      <KnowledgeGraphBackground />
      <Header />
      <main id="main">
        <Hero />
        <About />
        <HowIBuild />
        <Principles />
        <SelectedWork />
        <Research />
        <OtherProjects />
        <Stack />
        <CurrentFocus />
        <Contact />
      </main>
      <Footer />
    </MotionConfig>
  )
}

export default App
