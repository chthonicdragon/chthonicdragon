import { Section } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Reveal } from '@/components/ui/Reveal'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { focusItems } from '@/data/focus'

export function CurrentFocus() {
  return (
    <Section id="focus">
      <Container>
        <SectionHeader
          eyebrow="Current focus"
          title="What I am working toward"
          description="Plans are labeled as plans. Nothing on this list is completed research."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {focusItems.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.06} className="rounded-2xl border border-border bg-bg-elevated p-6">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-base font-semibold text-fg">{item.title}</h3>
                <StatusBadge status={item.status} />
              </div>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">{item.description}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  )
}
