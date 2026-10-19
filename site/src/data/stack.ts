export interface StackGroup {
  label: string
  note: string
  items: string[]
}

export const stack: StackGroup[] = [
  {
    label: 'Personally operated',
    note: 'What I use directly, day to day.',
    items: [
      'Claude',
      'ChatGPT',
      'Gemini',
      'Codex',
      'Prompt and context design',
      'Task decomposition',
      'Code review of agent output',
      'GitHub pull-request workflow',
      'Linux VPS administration',
    ],
  },
  {
    label: 'Used in AI-assisted projects',
    note: 'Present in my projects, mostly written with agents. Not claimed as personal expertise.',
    items: [
      'React',
      'TypeScript',
      'Vite',
      'Tailwind CSS',
      'Express',
      'Supabase / PostgreSQL',
      'Python / FastAPI',
      'Docker',
      'FFmpeg',
      'Three.js',
    ],
  },
  {
    label: 'Learning and research interests',
    note: 'Where I am investing next.',
    items: [
      'LLM evaluation',
      'Model behavior',
      'Interpretability',
      'AI safety',
      'Agent reliability',
      'ML fundamentals',
    ],
  },
]
