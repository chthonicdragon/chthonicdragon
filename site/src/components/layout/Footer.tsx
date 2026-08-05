import { Container } from '@/components/ui/Container'
import { site } from '@/data/site'

export function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <Container className="flex flex-col items-center justify-between gap-4 text-sm text-fg-subtle sm:flex-row">
        <p>© {new Date().getFullYear()} {site.name}. Built with React, Vite, and Tailwind.</p>
        <a href="#top" className="transition-colors hover:text-fg-muted">
          Back to top
        </a>
      </Container>
    </footer>
  )
}
