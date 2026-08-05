export interface PipelinePhase {
  index: string
  name: string
  summary: string
  steps: string[]
}

export const pipeline: PipelinePhase[] = [
  {
    index: '01',
    name: 'Discover',
    summary: 'Start from the problem, not the stack.',
    steps: ['Idea', 'Research'],
  },
  {
    index: '02',
    name: 'Design',
    summary: 'Decide the shape of the system before writing code.',
    steps: ['Architecture', 'Planning', 'Context Engineering'],
  },
  {
    index: '03',
    name: 'Build',
    summary: 'AI writes the code; the plan and context steer it.',
    steps: ['AI Implementation'],
  },
  {
    index: '04',
    name: 'Validate',
    summary: 'Every AI output is reviewed like it came from a junior engineer.',
    steps: ['Review', 'UX Validation', 'Testing'],
  },
  {
    index: '05',
    name: 'Ship',
    summary: 'Production is the start of the feedback loop, not the end.',
    steps: ['Production', 'Iteration'],
  },
]
