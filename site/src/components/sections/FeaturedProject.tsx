import { ArrowUpRight } from 'lucide-react'
import { Section } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
import { LinkButton } from '@/components/ui/Button'
import { BrowserFrame } from '@/components/ui/BrowserFrame'
import { GithubIcon } from '@/components/ui/icons'
import { featuredProject } from '@/data/project'

export function FeaturedProject() {
  return (
    <Section id="work">
      <Container>
        <Reveal className="max-w-2xl">
          <span className="text-sm font-medium tracking-wide text-accent">Featured project</span>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
            {featuredProject.name}
          </h2>
          <p className="mt-4 text-balance text-base leading-relaxed text-fg-muted">
            {featuredProject.description}
          </p>
          <p className="mt-3 text-sm text-fg-subtle">{featuredProject.meta}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <LinkButton href={featuredProject.liveUrl} target="_blank" rel="noreferrer">
              Live Demo
              <ArrowUpRight className="h-4 w-4" />
            </LinkButton>
            <LinkButton href={featuredProject.showcaseUrl} target="_blank" rel="noreferrer" variant="secondary">
              <GithubIcon className="h-4 w-4" />
              GitHub Showcase
            </LinkButton>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="mt-16 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <BrowserFrame
            src={`/screenshots/${featuredProject.screenshots[0].id}.png`}
            label={featuredProject.screenshots[0].label}
            url="esoterica-os.ru"
            priority
            className="lg:row-span-2"
          />
          <BrowserFrame
            src={`/screenshots/${featuredProject.screenshots[1].id}.png`}
            label={featuredProject.screenshots[1].label}
            url="esoterica-os.ru"
          />
          <BrowserFrame
            src={`/screenshots/${featuredProject.screenshots[2].id}.png`}
            label={featuredProject.screenshots[2].label}
            url="esoterica-os.ru/tarot"
          />
        </Reveal>

        <Reveal delay={0.15} className="mt-16 grid gap-x-8 gap-y-6 border-t border-border pt-10 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProject.features.map((feature) => (
            <div key={feature.title}>
              <h3 className="text-sm font-semibold text-fg">{feature.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{feature.description}</p>
            </div>
          ))}
        </Reveal>

        <p className="mt-10 max-w-2xl text-sm leading-relaxed text-fg-subtle">{featuredProject.note}</p>
      </Container>
    </Section>
  )
}
