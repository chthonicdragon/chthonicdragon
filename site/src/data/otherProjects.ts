export interface OtherProject {
  name: string
  kind: string
  description: string
  tags: string[]
  url?: string
}

export const otherProjects: OtherProject[] = [
  {
    name: 'Hermes',
    kind: 'Experiment',
    description:
      'A personal AI agent experiment running on a dedicated server. A write-up is not published yet; I will add details only once they can be documented accurately.',
    tags: ['Personal agent', 'Experiment'],
  },
  {
    name: 'Songvideo Studio',
    kind: 'Client project',
    description:
      'A web app built to a client’s requirements that turns a song or lyrics into a vertical video: AI storyboard, media search, and server-side FFmpeg rendering. Source and screenshots are private.',
    tags: ['Client work', 'LLM workflow', 'FFmpeg', 'Supabase'],
  },
  {
    name: 'Esoterica Astro Engine',
    kind: 'Open source',
    description: 'Astrology calculation API built with Python, FastAPI, Kerykeion, and Swiss Ephemeris.',
    tags: ['Python', 'FastAPI', 'Open source'],
    url: 'https://github.com/chthonicdragon/esoterica-astro-engine',
  },
]
