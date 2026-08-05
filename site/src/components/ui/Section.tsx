import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface SectionProps extends HTMLAttributes<HTMLElement> {
  id: string
  border?: boolean
}

export function Section({ id, className, border = true, ...props }: SectionProps) {
  return (
    <section
      id={id}
      className={cn('py-20 sm:py-28', border && 'border-t border-border', className)}
      {...props}
    />
  )
}
