import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function Tag({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-border bg-bg-elevated px-3.5 py-1.5 text-sm text-fg-muted transition-colors hover:border-border-strong hover:text-fg',
        className,
      )}
      {...props}
    />
  )
}
