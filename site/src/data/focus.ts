import type { Status } from '@/data/caseStudies'

export interface FocusItem {
  title: string
  description: string
  status: Status
}

export const focusItems: FocusItem[] = [
  {
    title: 'AI evaluation',
    description: 'Learning how to design and run repeatable evaluations of model behavior.',
    status: 'In progress',
  },
  {
    title: 'Agent reliability',
    description: 'Improving how I specify, constrain, and verify agent work in my own projects.',
    status: 'In progress',
  },
  {
    title: 'Safety and model behavior',
    description: 'Reading and studying safety, interpretability, and welfare research.',
    status: 'In progress',
  },
  {
    title: 'A small reproducible experiment',
    description: 'A modest, documented evaluation experiment I can publish honestly. Nothing has been run yet.',
    status: 'Planned',
  },
]
