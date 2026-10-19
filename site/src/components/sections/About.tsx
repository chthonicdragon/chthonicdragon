import { Section } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Reveal } from '@/components/ui/Reveal'
import { about } from '@/data/about'

export function About() {
  return (
    <Section id="about">
      <Container className="grid gap-12 lg:grid-cols-[1fr_1fr]">
        <SectionHeader eyebrow="About" title="Shipping with agents, and being clear about what that means." />
        <div className="space-y-8">
          <Reveal delay={0.06} className="space-y-5">
            {about.paragraphs.map((p) => (
              <p key={p} className="text-lg leading-relaxed text-fg-muted">
                {p}
              </p>
            ))}
          </Reveal>
          <Reveal delay={0.12}>
            <ul className="grid gap-3 border-t border-border pt-6 sm:grid-cols-2">
              {about.responsibilities.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-fg-muted">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="border-l-2 border-accent-dim pl-4 text-sm leading-relaxed text-fg-subtle">{about.limits}</p>
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}
