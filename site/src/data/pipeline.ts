export interface PipelinePhase {
  index: string
  name: string
  summary: string
  steps: string[]
}

export const pipeline: PipelinePhase[] = [
  {
    index: '01',
    name: 'Define',
    summary: 'Start from the problem, not the stack.',
    steps: ['Idea', 'Requirements'],
  },
  {
    index: '02',
    name: 'Plan',
    summary: 'Decide the shape of the work before an agent touches code.',
    steps: ['Task decomposition', 'Context and constraints'],
  },
  {
    index: '03',
    name: 'Build',
    summary: 'Agents implement against written specs. I steer and decide.',
    steps: ['AI agent implementation'],
  },
  {
    index: '04',
    name: 'Verify',
    summary: 'Agent output is a proposal, not a result.',
    steps: ['Review', 'Tests'],
  },
  {
    index: '05',
    name: 'Ship',
    summary: 'A release is the start of the feedback loop.',
    steps: ['Release', 'Iteration'],
  },
]
