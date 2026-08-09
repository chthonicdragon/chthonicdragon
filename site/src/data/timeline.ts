export interface TimelineStage {
  stage: string
  title: string
  description: string
}

export const timeline: TimelineStage[] = [
  {
    stage: 'Foundation',
    title: 'Architecture and core systems',
    description:
      'Product idea turned into a working architecture: data model, auth, and the first application routes.',
  },
  {
    stage: 'Expansion',
    title: 'From app to platform',
    description:
      'Grew to 40+ routes: knowledge graphs, recurring workflows, an AI guide with memory and tool calling, and 3D interactive experiences.',
  },
  {
    stage: 'Production hardening',
    title: 'Built to run without supervision',
    description:
      'Payments, subscription limits, a marketplace, automated tests, idempotent migrations, SEO, and monitoring: the parts that matter after launch.',
  },
  {
    stage: 'Now',
    title: 'Operating and iterating',
    description:
      'EsotericaOS runs in production with a 220+ pull request history. Open to bringing the same process to a new team.',
  },
]
