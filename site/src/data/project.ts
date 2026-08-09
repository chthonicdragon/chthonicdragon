export const featuredProject = {
  name: 'EsotericaOS',
  description:
    'A production web platform that connects personal knowledge, structured records, AI guidance, recurring workflows, community tools, and subscription features in one system.',
  meta: 'Developed over 4-5 months · 40+ application routes · 220+ merged pull requests',
  liveUrl: 'https://esoterica-os.ru',
  showcaseUrl: 'https://github.com/chthonicdragon/esoterica-os-showcase',
  note: 'The production source is private: it contains commercial code, infrastructure configuration, and internal product logic. The showcase repository documents the architecture publicly.',
  features: [
    {
      title: 'Umbra, the AI guide',
      description: 'RAG, memory, tool calling, and several autonomy levels.',
    },
    {
      title: 'Personal knowledge graphs',
      description: 'Structured records and relations across a user’s data.',
    },
    {
      title: 'Recurring workflows',
      description: 'Ritual, journal, goal, task, and outcome-tracking systems.',
    },
    {
      title: 'Symbolic reference systems',
      description: 'Astrology, numerology, divination, and structured content libraries.',
    },
    {
      title: 'Interactive 3D experiences',
      description: 'Altars and visual interactions built with Three.js / React Three Fiber.',
    },
    {
      title: 'Commercial product surface',
      description: 'Free/PRO limits, payments, a marketplace, community, and public content pages.',
    },
    {
      title: 'Production operations',
      description: 'Automated tests, database migrations, SEO, notifications, and monitoring.',
    },
  ],
  screenshots: [
    { id: 'graph', label: 'Personal knowledge graph' },
    { id: 'umbra', label: 'Umbra, the AI guide' },
    { id: 'tarot', label: 'Tarot reading interface' },
  ],
} as const
