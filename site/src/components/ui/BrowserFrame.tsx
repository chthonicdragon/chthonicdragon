import { useState } from 'react'
import { cn } from '@/lib/utils'

interface BrowserFrameProps {
  src: string
  label: string
  url: string
  className?: string
  priority?: boolean
}

export function BrowserFrame({ src, label, url, className, priority }: BrowserFrameProps) {
  const [failed, setFailed] = useState(false)

  return (
    <figure
      className={cn(
        'overflow-hidden rounded-xl border border-border bg-bg-elevated shadow-[0_20px_60px_-30px_rgba(0,0,0,0.6)]',
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-border bg-bg-elevated-2 px-4 py-2.5">
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-fg/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-fg/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-fg/15" />
        </span>
        <span className="ml-2 truncate rounded-full bg-bg px-3 py-1 font-mono text-[11px] text-fg-subtle">
          {url}
        </span>
      </div>
      <div className="relative aspect-[16/10] w-full">
        {!failed ? (
          <img
            src={src}
            alt={label}
            loading={priority ? 'eager' : 'lazy'}
            onError={() => setFailed(true)}
            className="h-full w-full object-cover object-top"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-grid bg-radial-fade">
            <span className="text-sm font-medium text-fg-muted">{label}</span>
            <span className="text-xs text-fg-subtle">Screenshot pending</span>
          </div>
        )}
      </div>
      <figcaption className="sr-only">{label}</figcaption>
    </figure>
  )
}
