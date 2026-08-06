import { Mail } from 'lucide-react'
import { Section } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
import { LinkButton } from '@/components/ui/Button'
import { GithubIcon, LinkedinIcon } from '@/components/ui/icons'
import { site } from '@/data/site'

const links = [
  { label: 'GitHub', value: '@chthonicdragon', href: site.github, icon: GithubIcon, external: true },
  { label: 'Email', value: site.email, href: `mailto:${site.email}`, icon: Mail, external: false },
]

export function Contact() {
  return (
    <Section id="contact" className="pb-32">
      <Container>
        <Reveal className="mx-auto max-w-xl text-center">
          <span className="text-sm font-medium tracking-wide text-accent">Contact</span>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
            Open to remote AI product engineering roles.
          </h2>
          <p className="mt-4 text-balance text-base leading-relaxed text-fg-muted">
            Based in {site.location}. Reach out directly: I read everything myself.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mx-auto mt-10 flex max-w-xl flex-col gap-3 sm:flex-row sm:justify-center">
          {links.map((link) => (
            <LinkButton
              key={link.label}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noreferrer' : undefined}
              variant="secondary"
              className="justify-start gap-3 px-5"
            >
              <link.icon className="h-4 w-4 text-fg-subtle" />
              <span className="flex flex-col items-start leading-tight">
                <span className="text-xs text-fg-subtle">{link.label}</span>
                <span>{link.value}</span>
              </span>
            </LinkButton>
          ))}
          <span
            aria-disabled
            className="inline-flex items-center gap-3 rounded-full border border-dashed border-border px-5 py-2.5 text-sm text-fg-subtle"
          >
            <LinkedinIcon className="h-4 w-4" />
            <span className="flex flex-col items-start leading-tight">
              <span className="text-xs">LinkedIn</span>
              <span>Coming soon</span>
            </span>
          </span>
        </Reveal>
      </Container>
    </Section>
  )
}
