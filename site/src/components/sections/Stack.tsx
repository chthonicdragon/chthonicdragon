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
        <SectionHeader eyebrow="Skills and tools" title="What I use, and how" description="Grouped by how I actually relate to each tool, so the list is not read as expertise in everything on it." />
        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {stack.map((group, i) => (
            <Reveal key={group.label} delay={i * 0.06}>
              <h3 className="text-sm font-semibold text-fg">{group.label}</h3>
              <p className="mt-1 text-sm text-fg-subtle">{group.note}</p>
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
