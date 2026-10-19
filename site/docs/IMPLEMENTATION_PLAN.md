# Implementation plan: Portfolio V2

Branch: `codex/portfolio-v2-positioning`. No AGENTS.md/CLAUDE.md exists in this repository, so there is nothing to update there.

## Audit findings (current main before V2)

| File | Finding | Action |
| --- | --- | --- |
| `src/data/site.ts` | Old role/tagline, "Voronezh", "open to remote", 40+/220+ metrics | Rewritten |
| `src/data/hero.ts` | Metric strip (40+ routes, 220+ PRs, 4–5 months) | Deleted; availability line instead |
| `src/data/project.ts` | Only EsotericaOS, stale metrics, "Live Demo", missing screenshots | Replaced by `caseStudies.ts` (EsotericaOS + Rejuv) |
| `src/data/otherProjects.ts` | Vague "personal AI workflows" | Hermes, Songvideo, Astro Engine |
| `src/data/principles.ts` | "Architecture, state, security, and payments get done by hand" misleading | Reworded to review-based ownership |
| `src/data/stack.ts` | Flat list implying expertise | Three tiers (used / operated / learning) |
| `src/data/timeline.ts`, `Timeline.tsx` | Stale metrics, EsotericaOS-only | Removed; status moved to Current Focus |
| `Contact.tsx` | "remote AI product engineering" only; LinkedIn "Coming soon" | International/relocation copy; LinkedIn omitted until confirmed |
| `index.html`, `public/og-image.png`, `sitemap.xml` | Metrics in meta and OG image; canonical unconfirmed | Updated; OG regenerated |
| `public/screenshots/` | No image files | Screenshots not rendered |
| `index.css` | `--color-fg-subtle` ≈4.0:1 on background | Lightened to pass 4.5:1 |
| Framer Motion | Not honoring reduced motion | `MotionConfig reducedMotion="user"` |

## Pass 1 (this PR)

1. Docs in `site/docs/`. 2. Data layer rewrite. 3. `CaseStudy` component (two big cases), `Research` section, Experiments/Additional section, tiered Stack, Current Focus with statuses. 4. Contact and SEO. 5. A11y: skip link, reduced motion, contrast. 6. QA: `npm run lint`, `npm run build`, headless-browser smoke at 1440/768/390.

Section order: Hero, About, How I Build, Principles, Selected Work, Research, Experiments and Additional Work, Skills, Current Focus, Contact. Research was placed before Additional Work as specified; Hermes sits inside Additional Work (as an "Experiment") rather than in its own section.

## Blockers and dependencies

- No screenshot files; owner must supply real captures (EsotericaOS) and permission.
- No Hermes evidence; owner input needed.
- Songvideo: client consent; repo private, so no link.
- Canonical domain, public email, LinkedIn unconfirmed.
- Live site could not be checked from the build environment.

## Acceptance criteria

See task section 11. Mapped here: claims limited to `PROJECT_EVIDENCE.md`; no overflow at 390 px; lint/build pass; no missing images; metadata valid.

## Next passes (not in this PR)

- **Genesis / Build / Esoterica scenes.** No document or repo history of this concept was found in this repository (git log has 8 commits, none mention it). It is a proposal only, not an accepted decision: restrained, optional, canvas-based scenes layered on the existing knowledge-graph background, with static fallback.
- Research Case Study after a real, reproducible evaluation experiment exists.
- Real screenshots and short product demos.
- LinkedIn, final domain, launch checklist, optional Russian localization.
- Publications/writing system.
