import { KnowledgeGraphBackground } from '@/components/effects/KnowledgeGraphBackground'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/sections/Hero'
import { About } from '@/components/sections/About'
import { HowIBuild } from '@/components/sections/HowIBuild'
import { Principles } from '@/components/sections/Principles'
import { FeaturedProject } from '@/components/sections/FeaturedProject'
import { OtherProjects } from '@/components/sections/OtherProjects'
import { Stack } from '@/components/sections/Stack'
import { CurrentFocus } from '@/components/sections/CurrentFocus'
import { Timeline } from '@/components/sections/Timeline'
import { Contact } from '@/components/sections/Contact'

function App() {
  return (
    <>
      <KnowledgeGraphBackground />
      <Header />
      <main>
        <Hero />
        <About />
        <HowIBuild />
        <Principles />
        <FeaturedProject />
        <OtherProjects />
        <Stack />
        <CurrentFocus />
        <Timeline />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App
