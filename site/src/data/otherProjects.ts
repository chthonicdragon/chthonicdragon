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
      'My own experimental AI agent, run on a separate VPS. A detailed write-up will follow once it can be documented and shown accurately.',
    tags: ['Personal agent', 'Experiment'],
  },
  {
    name: 'Songvideo Studio',
    kind: 'Commercial client project',
    description:
      'A commercial web app built for a client: it turns a song or lyrics into a vertical video with an AI storyboard, media search, and server-side FFmpeg rendering. Deployed on Cloud.ru and accepted by the client. Source and demonstrations are private; public materials are shared by agreement.',
    tags: ['Client work', 'LLM workflow', 'FFmpeg', 'Cloud.ru'],
  },
  {
    name: 'Esoterica Astro Engine',
    kind: 'Open source',
    description:
      'An open-core HTTP service for astrology calculations: natal planets, house cusps, aspects, and transits. Built on Kerykeion and Swiss Ephemeris with FastAPI. Calculation only, no interpretation. AGPL-3.0.',
    tags: ['Python', 'FastAPI', 'AGPL-3.0'],
    url: 'https://github.com/chthonicdragon/esoterica-astro-engine',
  },
]
