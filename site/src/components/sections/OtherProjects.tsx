import { ArrowUpRight } from 'lucide-react'
import { Section } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Reveal } from '@/components/ui/Reveal'
import { Tag } from '@/components/ui/Tag'
import { otherProjects, type OtherProject } from '@/data/otherProjects'

function Card({ project }: { project: OtherProject }) {
  const body = (
    <>
      <span className="text-xs font-medium uppercase tracking-wide text-accent">{project.kind}</span>
      <div className="mt-2 flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold text-fg">{project.name}</h3>
        {project.url ? (
          <ArrowUpRight className="h-4 w-4 shrink-0 text-fg-subtle transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg" />
        ) : null}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-fg-muted">{project.description}</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <Tag key={tag} className="pointer-events-none px-3 py-1 text-xs">
            {tag}
          </Tag>
        ))}
      </div>
    </>
  )
  const base = 'group flex h-full flex-col rounded-2xl border border-border bg-bg-elevated p-6'
  return project.url ? (
    <a
      href={project.url}
      target="_blank"
      rel="noreferrer"
      className={`${base} transition-colors duration-200 hover:border-border-strong hover:bg-bg-elevated-2`}
    >
      {body}
    </a>
  ) : (
    <div className={base}>{body}</div>
  )
}

export function OtherProjects() {
  return (
    <Section id="other-projects">
      <Container>
        <SectionHeader eyebrow="Additional work" title="Experiments and smaller projects" />
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {otherProjects.map((project, i) => (
            <Reveal key={project.name} delay={i * 0.08}>
              <Card project={project} />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  )
}
