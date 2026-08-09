export interface OtherProject {
  name: string
  description: string
  tags: string[]
  url: string
}

export const otherProjects: OtherProject[] = [
  {
    name: 'Esoterica Astro Engine',
    description: 'Open-source astrology calculation API built with Python, FastAPI, Kerykeion, and Swiss Ephemeris.',
    tags: ['Python', 'FastAPI', 'Open source'],
    url: 'https://github.com/chthonicdragon/esoterica-astro-engine',
  },
  {
    name: 'Personal AI workflows',
    description:
      'Configured personal AI assistants for research, planning, documentation, development, quality review, and recurring operations, including Hermes-based workflows and multi-model setups.',
    tags: ['Agents', 'Multi-model', 'Automation'],
    url: 'https://github.com/chthonicdragon',
  },
]
