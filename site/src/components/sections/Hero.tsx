import { motion } from 'framer-motion'
import { Container } from '@/components/ui/Container'
import { Button, LinkButton } from '@/components/ui/Button'
import { site } from '@/data/site'
import { heroStats } from '@/data/hero'

const ease = [0.16, 1, 0.3, 1] as const

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden border-b border-border">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid bg-radial-fade" />
      <Container className="relative flex min-h-[88vh] flex-col justify-center pt-16 pb-16">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="text-sm font-medium tracking-wide text-accent"
        >
          {site.name}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease }}
          className="mt-4 text-balance text-5xl font-semibold tracking-tight text-fg sm:text-6xl md:text-7xl"
        >
          {site.role}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.16, ease }}
          className="mt-6 max-w-xl text-balance text-lg leading-relaxed text-fg-muted"
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
            View Projects
          </LinkButton>
          <Button
            variant="secondary"
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Contact
          </Button>
        </motion.div>
      </Container>

      <div className="relative border-t border-border bg-bg-elevated/40">
        <Container>
          <dl className="grid grid-cols-1 divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {heroStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.08, ease }}
                className="flex flex-col gap-1 py-6 sm:px-8 sm:first:pl-0 sm:last:pr-0"
              >
                <dt className="order-2 text-sm text-fg-subtle">{stat.label}</dt>
                <dd className="order-1 text-3xl font-semibold tracking-tight text-fg">{stat.value}</dd>
              </motion.div>
            ))}
          </dl>
        </Container>
      </div>
    </section>
  )
}
