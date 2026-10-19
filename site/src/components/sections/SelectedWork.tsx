import { ArrowUpRight } from 'lucide-react'
import { Section } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Reveal } from '@/components/ui/Reveal'
import { LinkButton } from '@/components/ui/Button'
import { BrowserFrame } from '@/components/ui/BrowserFrame'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { GithubIcon } from '@/components/ui/icons'
import { UmbraSpirit } from '@/components/effects/UmbraSpirit'
import { caseStudies, type CaseStudy } from '@/data/caseStudies'

function Fact({ label, children }: { label: string; children: string }) {
  return (
    <div>
      <h4 className="text-xs font-medium uppercase tracking-wide text-fg-subtle">{label}</h4>
      <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{children}</p>
    </div>
  )
}

function Case({ study }: { study: CaseStudy }) {
  return (
    <article id={study.id} aria-labelledby={`${study.id}-title`} className="scroll-mt-24">
      <div className={study.id === 'esoterica-os' ? 'grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]' : undefined}>
      <Reveal className="max-w-2xl">
        <span className="text-sm font-medium tracking-wide text-accent">{study.eyebrow}</span>
        <h3 id={`${study.id}-title`} className="mt-3 text-balance text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
          {study.name}
        </h3>
        <p className="mt-4 text-balance text-base leading-relaxed text-fg-muted">{study.summary}</p>
        <div className="mt-8 flex flex-wrap gap-4">
          {study.links.map((link, i) => (
            <LinkButton
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              variant={i === 0 ? 'primary' : 'secondary'}
            >
              {i === 0 ? null : <GithubIcon className="h-4 w-4" />}
              {link.label}
              {i === 0 ? <ArrowUpRight className="h-4 w-4" /> : null}
            </LinkButton>
          ))}
        </div>
      </Reveal>
      {study.id === 'esoterica-os' ? (
        <Reveal delay={0.1} className="relative mx-auto w-full max-w-[420px]">
          <UmbraSpirit />
          <p className="mt-2 text-center text-xs text-fg-subtle">
            Umbra, the AI guide, condensing out of falling code. A stylised rendering, not a product screenshot.
          </p>
        </Reveal>
      ) : null}
      </div>

      {study.screenshots.length > 0 ? (
        <Reveal delay={0.1} className="mt-12 grid gap-6 lg:grid-cols-2">
          {study.screenshots.map((shot) => (
            <BrowserFrame key={shot.id} src={`/screenshots/${shot.id}.png`} label={shot.label} url={shot.url} />
          ))}
        </Reveal>
      ) : null}

      <Reveal delay={0.1} className="mt-12 grid gap-8 border-t border-border pt-10 md:grid-cols-2">
        <Fact label="Why it matters">{study.why}</Fact>
        <Fact label="My role">{study.role}</Fact>
      </Reveal>

      <Reveal delay={0.12} className="mt-10 grid gap-8 md:grid-cols-2">
        {study.sections.map((section) => (
          <div key={section.title}>
            <h4 className="text-xs font-medium uppercase tracking-wide text-fg-subtle">{section.title}</h4>
            <ul className="mt-3 space-y-3">
              {section.items.map((item) => (
                <li key={item.text} className="flex items-start justify-between gap-4 text-sm leading-relaxed text-fg-muted">
                  <span>{item.text}</span>
                  {item.status ? <StatusBadge status={item.status} /> : null}
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <h4 className="text-xs font-medium uppercase tracking-wide text-fg-subtle">Decisions and challenges</h4>
          <ul className="mt-3 space-y-3">
            {study.decisions.map((d) => (
              <li key={d} className="flex gap-3 text-sm leading-relaxed text-fg-muted">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                {d}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      <Reveal delay={0.14} className="mt-10 rounded-xl border border-border bg-bg-elevated p-5">
        <Fact label="Current status">{study.statusLine}</Fact>
        <p className="mt-3 text-xs leading-relaxed text-fg-subtle">{study.note}</p>
      </Reveal>
    </article>
  )
}

export function SelectedWork() {
  return (
    <Section id="work">
      <Container>
        <SectionHeader
          eyebrow="Selected work"
          title="Two projects, with their real status"
          description="One live product and one early-stage research project. Each claim below is labeled as implemented, in progress, or planned."
        />
        <div className="mt-16 space-y-24">
          {caseStudies.map((study) => (
            <Case key={study.id} study={study} />
          ))}
        </div>
      </Container>
    </Section>
  )
}
