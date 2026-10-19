import { Section } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Reveal } from '@/components/ui/Reveal'
import { research } from '@/data/research'

export function Research() {
  return (
    <Section id="research">
      <Container>
        <SectionHeader eyebrow={research.eyebrow} title={research.title} />
        <div className="mt-12 grid gap-12 lg:grid-cols-[1.1fr_1fr]">
          <Reveal className="space-y-5">
            {research.vision.map((p) => (
              <p key={p} className="text-lg leading-relaxed text-fg-muted">
                {p}
              </p>
            ))}
            <p className="text-lg leading-relaxed text-fg">{research.motivation}</p>
            <p className="border-l-2 border-accent-dim pl-4 text-sm leading-relaxed text-fg-subtle">
              {research.caveat}
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <ul className="divide-y divide-border border-y border-border">
              {research.topics.map((topic) => (
                <li key={topic.title} className="py-4">
                  <h3 className="text-sm font-semibold text-fg">{topic.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-fg-muted">{topic.description}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}
