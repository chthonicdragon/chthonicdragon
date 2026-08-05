import { Section } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Reveal } from '@/components/ui/Reveal'
import { Tag } from '@/components/ui/Tag'
import { stack } from '@/data/stack'

export function Stack() {
  return (
    <Section id="stack">
      <Container>
        <SectionHeader eyebrow="Building with" title="The tools behind the process" />
        <div className="mt-14 grid gap-8 sm:grid-cols-2">
          {stack.map((group, i) => (
            <Reveal key={group.label} delay={i * 0.06}>
              <h3 className="text-sm font-medium text-fg-subtle">{group.label}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <Tag key={item}>{item}</Tag>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  )
}
