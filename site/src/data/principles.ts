export interface Principle {
  title: string
  description: string
}

export const principles: Principle[] = [
  {
    title: 'Context over cleverness',
    description:
      'Every agent task starts with written intent, constraints, and acceptance criteria, not a clever prompt and hope.',
  },
  {
    title: 'Match scrutiny to risk',
    description:
      'Routine changes get a precise spec and a light review. Architecture, auth, payments, and data migrations get tighter specs, stronger models, and closer human review before anything ships.',
  },
  {
    title: 'Verify, do not assume',
    description:
      'A passing build is not proof of working behavior. I separate what was tested, what was only reasoned about, and what is still unverified, and I say which is which.',
  },
  {
    title: 'Modular and re-runnable',
    description:
      'Features are split into small modules, and migrations and operations are written to be safely repeated, so production does not depend on remembering what already happened.',
  },
]
