import type { Status } from '@/data/caseStudies'
import { cn } from '@/lib/utils'

const styles: Record<Status, string> = {
  Implemented: 'border-accent/40 text-accent-fg',
  'In progress': 'border-border-strong text-fg-muted',
  Planned: 'border-dashed border-border-strong text-fg-subtle',
}

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={cn('shrink-0 rounded-full border px-2.5 py-0.5 text-xs', styles[status])}>{status}</span>
  )
}
