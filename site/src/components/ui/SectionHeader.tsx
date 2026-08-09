import type { ReactNode } from 'react'
import { Reveal } from '@/components/ui/Reveal'
import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeader({ eyebrow, title, description, align = 'left', className }: SectionHeaderProps) {
  return (
    <Reveal
      className={cn(
        'max-w-2xl',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      {eyebrow ? <span className="text-sm font-medium tracking-wide text-accent">{eyebrow}</span> : null}
      <h2 className={cn('text-balance text-3xl font-semibold tracking-tight text-fg sm:text-4xl', eyebrow ? 'mt-3' : '')}>{title}</h2>
      {description ? (
        <p className="mt-4 text-balance text-base leading-relaxed text-fg-muted">{description}</p>
      ) : null}
    </Reveal>
  )
}
