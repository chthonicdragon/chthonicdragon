# Project evidence matrix

Last audited: 2026-10-19 (read-only, via the GitHub API; no code of other repositories was changed).

Status: **Confirmed** (artifact seen) · **Partial** (artifact exists, behavior not verified live) · **Planned** · **Unknown**.
Public-safe: **Yes** · **No** · **Requires permission**.

READMEs, mocks, scripted tests and plans are not evidence of live production behavior. Production claims need a live check or a verified report. The audit environment could not reach `esoterica-os.ru` (proxy returned 403), so no live check was possible.

## Matrix

| Project | Public claim | Evidence URL/path | Evidence type | Status | Public-safe | Caveat / next check |
| --- | --- | --- | --- | --- | --- | --- |
| EsotericaOS | Self-initiated AI-native platform: knowledge graph, journal/ritual tracking, AI guide, community and subscription features | `chthonicdragon/esoterica-os` README, `docs/ACTIVE_GOALS_2026-10.md` (private repo); public `esoterica-os-showcase/README.md` | Docs + showcase | Partial | Yes (showcase text); No (private source paths/details) | Live site not verified from audit env. Owner to confirm what is publicly reachable. |
| EsotericaOS | Stack: React/TypeScript/Vite, Express, self-hosted Supabase/Postgres | esoterica-os README ("Стек") | Repo README | Confirmed | Yes | Repo says React 18 (not 19). The portfolio site itself uses React 19. |
| EsotericaOS | Umbra AI assistant with tools/memory | Showcase README, esoterica-os `ACTIVE_GOALS` | Docs | Partial | Yes | Autonomy (#475), metering (#467), quota hardening (#468) are P0/P2 goals or draft PRs (#461, #462, #465). Do not call them production-ready. |
| EsotericaOS | Cost/quota controls | `ACTIVE_GOALS_2026-10.md`: quota-bypass risk found; metering and gating are in progress | Internal roadmap | Planned / in progress | Yes (as "in progress") | Production invariants not verified. |
| EsotericaOS | "40+ routes", "220+ PRs", "4–5 months", "2,400+ tests" | Showcase README | Self-reported | Unknown | No | Removed from the site. PR numbers already exceed 600; repo created 2026-03-04. Re-measure before reuse. |
| EsotericaOS | Screenshots (graph, Umbra, tarot) | `site/public/screenshots/` holds only a README | None | Unknown | Requires permission | No image files exist; site shows no screenshots. Owner to supply real captures. |
| Rejuv | Open, agent-native infrastructure for intervention evidence and benchmarks; pre-alpha | `chthonicdragon/rejuv` README, `docs/roadmap.md`, `docs/foundation-audit-2026-09-26.md` | Public repo docs | Confirmed (docs) | Yes | Public repo; status "pre-alpha / research infrastructure". |
| Rejuv | InterventionEpisode schema, provenance chain, source adapters, release manifests, versioning/historical readers | README, RFC-0001..0003, roadmap (`#13` checked), `tests/` (models, schema contract, versioning, verify script) | Repo docs + tests | Partial | Yes | Tests exist but were not run in this audit. Roadmap lists #10, #11, #12, #14, #15 as open P0. |
| Rejuv | RB01 benchmark, historical replay, RejuvGym | README, roadmap | Plan | Planned | Yes (as planned) | Phases 1–5 unchecked. Real-data ingestion is explicitly paused by the audit. |
| Rejuv | 500–2,000 reviewed episodes | README "MVP" | Target | Planned | Yes (as target only) | No corpus exists. Never present as collected. |
| Rejuv | Not clinical / not medical / no longevity claims | README non-goals | Repo docs | Confirmed | Yes | Keep non-goals visible on the site. |
| Hermes | Personal AI agent on a dedicated VPS | None found: no repo, docs or config in the accessible account | Owner statement only | Unknown | Requires permission | **Needs owner confirmation.** Site states only that it is an experiment. Do not publish models, tools, memory design, autonomy, VPS details or diagrams. (Code search hits for "Hermes" in esoterica-os are Greek-deity content, unrelated.) |
| Songvideo Studio | Client web app: text/song to 9:16 video via AI storyboard, media search, FFmpeg render | `chthonicdragon/Music_workspace` README, `docs/V1_READINESS_AUDIT.md` (private repo) | Repo docs | Partial | Requires permission | Repo is private. Readiness audit (2026-10-05) lists live integrations, deployment and client handoff as BLOCKED/unverified. Client's written consent needed for name, screenshots, details. Cloud.ru / Container Jobs not seen in the docs read; not claimed. |
| Esoterica Astro Engine | Open-source astrology API (Python, FastAPI, Kerykeion, Swiss Ephemeris) | `chthonicdragon/esoterica-astro-engine` (public, Python) | Public repo existence | Partial | Yes | README/contents not read in this audit. Description is carried over from the earlier site. |
| Owner profile | Open to international work/relocation, interests in safety/welfare/consciousness | Owner statement | Self-reported | Confirmed (by owner) | Yes | No credentials, publications or lab affiliations are claimed. |
| Owner profile | English level | Owner statement (≈B1) | Self-reported | Confirmed (by owner) | No | Not published as a level. |

## Needs owner confirmation (summary)

1. Hermes: anything beyond "personal agent experiment".
2. Songvideo: client consent for public name/screenshots/details; delivery and acceptance status.
3. EsotericaOS: public availability of live site, which features are live, screenshot permission.
4. Esoterica Astro Engine: current state and description.
5. Contacts: public email, LinkedIn.
