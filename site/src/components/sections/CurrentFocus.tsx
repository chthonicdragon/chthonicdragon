import { Section } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Reveal } from '@/components/ui/Reveal'
import { focusAreas } from '@/data/focus'

export function CurrentFocus() {
  return (
    <Section id="focus">
      <Container>
        <SectionHeader eyebrow="Current focus" title="Where I'm spending deliberate time" align="center" />
        <Reveal delay={0.08} className="mt-12 flex flex-wrap justify-center gap-3">
          {focusAreas.map((area) => (
            <span
              key={area}
              className="rounded-full border border-border-strong bg-bg-elevated px-5 py-2.5 text-sm font-medium text-fg"
            >
              {area}
            </span>
          ))}
        </Reveal>
      </Container>
    </Section>
  )
}
