import { useEffect, useState } from 'react'
import { Container } from '@/components/ui/Container'
import { LinkButton } from '@/components/ui/Button'
import { site } from '@/data/site'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '#work', label: 'Work' },
  { href: '#how-i-build', label: 'How I Build' },
  { href: '#stack', label: 'Stack' },
  { href: '#contact', label: 'Contact' },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
        scrolled ? 'border-b border-border bg-bg/80 backdrop-blur-md' : 'border-b border-transparent',
      )}
    >
      <Container className="flex h-16 items-center justify-between">
        <a href="#top" className="text-sm font-semibold tracking-tight text-fg">
          {site.name}
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-fg-muted transition-colors hover:text-fg"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <LinkButton href="#contact" variant="secondary" size="sm">
          Get in touch
        </LinkButton>
      </Container>
    </header>
  )
}
