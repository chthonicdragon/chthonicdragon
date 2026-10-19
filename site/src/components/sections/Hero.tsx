import { motion } from 'framer-motion'
import { Container } from '@/components/ui/Container'
import { LinkButton } from '@/components/ui/Button'
import { site } from '@/data/site'

const ease = [0.16, 1, 0.3, 1] as const

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden border-b border-border">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-radial-fade" />
      <Container className="relative flex min-h-[88vh] flex-col justify-center pt-16 pb-16">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="text-sm font-medium tracking-wide text-accent"
        >
          {site.name} · {site.role}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease }}
          className="mt-4 max-w-4xl text-balance text-4xl font-semibold tracking-tight text-fg sm:text-5xl md:text-6xl"
        >
          {site.headline}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.16, ease }}
          className="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-fg-muted"
        >
          {site.tagline}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.24, ease }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <LinkButton href="#work" variant="primary">
            View Work
          </LinkButton>
          <LinkButton href="#research" variant="secondary">
            Research Interests
          </LinkButton>
          <LinkButton href="#contact" variant="ghost">
            Contact
          </LinkButton>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.34, ease }}
          className="mt-10 text-sm text-fg-subtle"
        >
          {site.availability}
        </motion.p>
      </Container>
    </section>
  )
}
