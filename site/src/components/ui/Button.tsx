import { type AnchorHTMLAttributes, type ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'md' | 'sm'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

interface LinkButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant
  size?: Size
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-50'

const variantClasses: Record<Variant, string> = {
  primary: 'bg-fg text-bg hover:bg-fg/90 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]',
  secondary: 'bg-bg-elevated text-fg border border-border hover:border-border-strong hover:bg-bg-elevated-2',
  ghost: 'text-fg-muted hover:text-fg',
}

const sizeClasses: Record<Size, string> = {
  md: 'h-11 px-5 text-sm',
  sm: 'h-9 px-4 text-sm',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(base, variantClasses[variant], sizeClasses[size], className)}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <a
        ref={ref}
        className={cn(base, variantClasses[variant], sizeClasses[size], className)}
        {...props}
      />
    )
  },
)
LinkButton.displayName = 'LinkButton'
