import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { Section } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Reveal } from '@/components/ui/Reveal'
import { pipeline } from '@/data/pipeline'
import { cn } from '@/lib/utils'

export function HowIBuild() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <Section id="how-i-build">
      <Container>
        <SectionHeader
          title="How I build"
          description="Five phases, repeated on every feature. AI moves fast inside them. It doesn't replace them."
        />
        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-5">
          {pipeline.map((phase, i) => {
            const isOpen = openIndex === i
            return (
              <Reveal key={phase.name} delay={i * 0.05}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  onMouseEnter={() => setOpenIndex(i)}
                  className={cn(
                    'group flex h-full w-full flex-col items-start gap-3 bg-bg p-6 text-left transition-colors duration-200 hover:bg-bg-elevated',
                  )}
                >
                  <span className="font-mono text-xs text-fg-subtle">{phase.index}</span>
                  <span className="text-base font-semibold text-fg">{phase.name}</span>
                  <span className="text-sm leading-relaxed text-fg-muted">{phase.summary}</span>

                  <span className="mt-auto flex items-center gap-1 pt-4 text-xs text-fg-subtle">
                    {phase.steps.length} step{phase.steps.length > 1 ? 's' : ''}
                    <ChevronDown
                      className={cn('h-3.5 w-3.5 transition-transform duration-200', isOpen && 'rotate-180')}
                    />
                  </span>

                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="flex w-full flex-col gap-1.5 overflow-hidden"
                      >
                        {phase.steps.map((step) => (
                          <li
                            key={step}
                            className="rounded-md border border-border bg-bg-elevated-2 px-2.5 py-1.5 text-xs text-fg-muted"
                          >
                            {step}
                          </li>
                        ))}
                      </motion.ul>
                    ) : null}
                  </AnimatePresence>
                </button>
              </Reveal>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}
