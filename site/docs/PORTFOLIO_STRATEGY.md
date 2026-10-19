# Portfolio strategy

Source of truth for positioning. Last updated: 2026-10-19. Scope: `site/` in `chthonicdragon/chthonicdragon`.

## Purpose

A standalone, evidence-based portfolio for CVs, LinkedIn, applications to AI startups, AI labs and research initiatives. A visitor should understand within 5–10 seconds what Daniil G. does and what he can prove.

## Audiences

1. Hiring managers and founders at AI-native startups (primary).
2. Research-adjacent teams: evaluation, model behavior, safety, welfare (secondary, long-term).
3. Collaborators and the research community (tertiary).

## Positioning

- **Primary:** AI Product Builder · Agentic Systems · AI Research Interests.
- **Secondary:** AI agent orchestration; AI-native product development; LLM workflows; model evaluation; context engineering; AI safety research interests; human-AI interaction.
- **Never used as the headline title:** Senior Software Engineer, Research Scientist, ML Engineer, AI Consciousness Researcher. No claim of authoring an ML algorithm.

Product competence is the main pillar; the research direction is the second. The site must not turn into a philosophy essay or an esoteric-app landing page.

## Two career tracks (do not swap silently)

| Track | Focus | Horizon | Evidence today |
| --- | --- | --- | --- |
| A | AI Product / Agentic Systems | Near-term professional entry | EsotericaOS, Songvideo Studio, Hermes (unconfirmed) |
| B | AI Model Behavior / Safety / Welfare | Long-term research path | Rejuv (evaluation/provenance discipline, pre-alpha), stated research interests |

Track B is presented as interest and direction, not as qualification. Changing the emphasis between tracks is a decision for the owner and must be recorded here.

## Differentiators

- Real shipped products built through coordinated AI agents, with honest limits.
- Process discipline: specs, decomposition, review, tests, release readiness (visible in project docs: audits, readiness reports, RFCs).
- A personal motivation (model behavior, welfare, consciousness as an open question) backed by practical work rather than replacing it.

## Narrative

1. I build and ship products by directing AI coding agents.
2. I own requirements, review, verification and release decisions.
3. AI coding agents carry out a large share of the implementation; I own product requirements, task design, coordination, verification, integrations, and release decisions. The site never implies that the code was written solo.
4. Building with agents made me want to understand model behavior and evaluation, so that is where I am heading.

## Project priority

1. **EsotericaOS**: main implemented case (live product, private source, public showcase).
2. **Rejuv**: second case, explicitly pre-alpha research infrastructure.
3. **Hermes**: small experiment card, no architecture claims until confirmed.
4. **Songvideo Studio**: real commercial client project, kept as a small additional case (details and demos only as agreed with the owner). **Esoterica Astro Engine**: additional work.

## Relocation and availability

Open to international opportunities, remote collaboration and relocation. The site never claims open vacancies, visa status or foreign work authorization. Location is published as "Russia" only (no city).

## Tone

Clear, human, respectful, intellectual, soberly ambitious. Banned: "passionate AI enthusiast", "visionary", "disruptor", "revolutionizing the future", unverified statistics, claims of exceptionality.

## Design direction

Keep the existing stack (React 19, TypeScript, Vite 8, Tailwind 4, Framer Motion). Dark editorial/research look, short headlines, compact paragraphs, restrained motion (`prefers-reduced-motion` honored), real screenshots only. 3D/cinematic scenes are out of scope for this pass (see IMPLEMENTATION_PLAN).

## Success criteria

- Role and agent-orchestration practice are clear in the first screen.
- No impression of single-handedly written code.
- Every public claim maps to a row in `PROJECT_EVIDENCE.md` with status Confirmed/Partial, or is clearly labeled as an interest or plan.
- Research interests are stated with epistemic care.
- Lint and build pass; layout works at 390/768/1440 px.
