import { Section } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Reveal } from '@/components/ui/Reveal'
import { timeline } from '@/data/timeline'

export function Timeline() {
  return (
    <Section id="timeline">
      <Container>
        <SectionHeader eyebrow="Trajectory" title="How the product grew" />
        <div className="relative mt-14 space-y-10 border-l border-border pl-8">
          {timeline.map((stage, i) => (
            <Reveal key={stage.stage} delay={i * 0.06} className="relative">
              <span className="absolute -left-[calc(2rem+5px)] top-1 h-2.5 w-2.5 rounded-full border-2 border-bg bg-accent" />
              <span className="text-xs font-medium uppercase tracking-wide text-accent">{stage.stage}</span>
              <h3 className="mt-2 text-lg font-semibold text-fg">{stage.title}</h3>
              <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-fg-muted">{stage.description}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  )
}
