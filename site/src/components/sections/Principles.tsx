import { Section } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Reveal } from '@/components/ui/Reveal'
import { principles } from '@/data/principles'

export function Principles() {
  return (
    <Section id="principles">
      <Container>
        <SectionHeader
          eyebrow="Engineering principles"
          title="What stays true across every project"
        />
        <div className="mt-14 grid gap-8 sm:grid-cols-2">
          {principles.map((principle, i) => (
            <Reveal key={principle.title} delay={i * 0.06} className="border-t border-border pt-6">
              <h3 className="text-lg font-semibold text-fg">{principle.title}</h3>
              <p className="mt-2 text-balance text-sm leading-relaxed text-fg-muted">{principle.description}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  )
}
