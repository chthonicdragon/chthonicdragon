export interface Principle {
  title: string
  description: string
}

export const principles: Principle[] = [
  {
    title: 'Context over cleverness',
    description:
      'Every AI-assisted task starts with written intent, decomposition, and explicit confidence levels, not a clever prompt and hope.',
  },
  {
    title: 'Match effort to risk',
    description:
      'Mechanical, repeatable changes get delegated to lighter models with a precise plan. Architecture, state, security, and payments get done by hand.',
  },
  {
    title: 'Modular from the first commit',
    description:
      'Features are split into types, pure logic, hooks, and components from the start. Files that grow past a few hundred lines get split, not left alone.',
  },
  {
    title: 'Idempotent by default',
    description:
      'Migrations and infrastructure changes are written to be safely re-run. Production operations should never depend on remembering what already happened.',
  },
]
