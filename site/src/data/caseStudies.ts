export type Status = 'Implemented' | 'In progress' | 'Planned'

export interface CaseSection {
  title: string
  items: { text: string; status?: Status }[]
}

export interface CaseLink {
  label: string
  href: string
}

export interface CaseStudy {
  id: string
  eyebrow: string
  name: string
  summary: string
  why: string
  role: string
  sections: CaseSection[]
  decisions: string[]
  links: CaseLink[]
  statusLine: string
  note: string
  screenshots: { id: string; label: string; url: string }[]
}

export const caseStudies: CaseStudy[] = [
  {
    id: 'esoterica-os',
    eyebrow: 'Main case · live product',
    name: 'EsotericaOS',
    summary:
      'A self-initiated AI-native platform that connects personal knowledge, structured records, recurring practice workflows, an AI guide, and community features in one web application.',
    why: 'It is where I learned what AI-assisted development takes beyond a demo: authorization, cost control, migrations, and living with a product after release.',
    role: 'Product owner. I defined the concept and priorities, wrote requirements, decomposed work for AI coding agents, reviewed and tested results, and handle releases and server operations. Agents wrote most of the code.',
    sections: [
      {
        title: 'Selected systems',
        items: [
          { text: 'Web app in React and TypeScript with an Express backend and self-hosted Supabase/Postgres' },
          { text: 'Umbra, an AI guide with retrieval, memory, and tool calls' },
          { text: 'Personal knowledge graph and structured journal, ritual, and goal records' },
          { text: 'Automated tests, SQL migrations, and written audits and roadmaps' },
        ],
      },
      {
        title: 'Current work',
        items: [
          { text: 'AI usage metering and real per-run cost measurement', status: 'In progress' },
          { text: 'Server-side quota enforcement and Free/PRO gating', status: 'In progress' },
          { text: 'Umbra background autonomy with consent and budget limits', status: 'Planned' },
        ],
      },
    ],
    decisions: [
      'An internal audit found client-side and quota-accounting weaknesses, so new agentic features were paused until server-side budgets and permissions are in place.',
      'AI features are treated as costs to meter, not free functionality; "unlimited AI" is deliberately not offered.',
      'Personal context stays within a controlled provider boundary instead of falling back to any available model.',
    ],
    links: [
      { label: 'Live product', href: 'https://esoterica-os.ru' },
      { label: 'Public showcase', href: 'https://github.com/chthonicdragon/esoterica-os-showcase' },
    ],
    statusLine:
      'Live product with an ongoing roadmap. Production source is private. Several newer Umbra capabilities exist only as draft pull requests or plans and are not described as live.',
    note: 'The showcase repository documents the product and process without exposing commercial code.',
    screenshots: [],
  },
  {
    id: 'rejuv',
    eyebrow: 'Second case · pre-alpha research infrastructure',
    name: 'Rejuv',
    summary:
      'Open, agent-native infrastructure for describing, replaying, and benchmarking the outcomes of biological interventions. The first domain is the biology of aging.',
    why: 'It applies the same discipline I want in AI evaluation work: explicit provenance, uncertainty, and benchmarks designed to resist data contamination.',
    role: 'Project author and product owner, working with AI coding agents. I set scope and non-goals, run design reviews and a self-audit, and decide what must be fixed before real data is ingested.',
    sections: [
      {
        title: 'Foundations',
        items: [
          { text: 'InterventionEpisode: the core record (context, intervention, time, measurements, outcomes, evidence)', status: 'Implemented' },
          { text: 'Machine-readable schemas, source-adapter and release-manifest contracts, versioned readers, and a test suite', status: 'Implemented' },
          { text: 'Contract alignment, provenance topology, study/control semantics, and reproducible fingerprints', status: 'In progress' },
          { text: 'Real-data corpus, RB01 benchmark, and historical replay with contamination control', status: 'Planned' },
          { text: 'RejuvGym: evaluating how agents choose the next experiment', status: 'Planned' },
        ],
      },
    ],
    decisions: [
      'A self-audit found that the Python, JSON Schema, and benchmark semantics disagree in places, so real-data ingestion is paused until those gaps are closed.',
      'Uncertainty and missingness are first-class data rather than empty fields.',
      'Explicit non-goals: not a clinical tool, not a medical device, not a longevity recommendation app.',
    ],
    links: [{ label: 'Repository', href: 'https://github.com/chthonicdragon/rejuv' }],
    statusLine:
      'Pre-alpha. No curated corpus has been published, no benchmark has been released, and nothing here is a scientific result or a medical claim.',
    note: 'Not clinical decision support. It must not be used to prescribe or optimize treatment for people.',
    screenshots: [],
  },
]
