export interface StackGroup {
  label: string
  items: string[]
}

export const stack: StackGroup[] = [
  {
    label: 'AI',
    items: [
      'Claude',
      'ChatGPT',
      'Gemini',
      'Codex',
      'Prompt design',
      'Context engineering',
      'RAG',
      'Tool workflows',
      'Output evaluation',
    ],
  },
  {
    label: 'Frontend',
    items: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'shadcn/ui', 'Framer Motion', 'Three.js / R3F'],
  },
  {
    label: 'Backend',
    items: ['Express', 'Supabase', 'PostgreSQL', 'REST APIs', 'PWA'],
  },
  {
    label: 'Infrastructure',
    items: ['GitHub', 'Linux', 'VPS', 'Docker', 'systemd', 'Vercel', 'Self-hosted services'],
  },
]
