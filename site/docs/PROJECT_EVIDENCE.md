# Project evidence matrix

Last audited: 2026-10-19 (second pass: rejuv, Music_workspace and esoterica-astro-engine were cloned read-only and inspected; Rejuv tests were run locally; no code of other repositories was changed).

Status: **Confirmed** (artifact seen) · **Partial** (artifact exists, behavior not verified live) · **Planned** · **Unknown**.
Public-safe: **Yes** · **No** · **Requires permission**.

READMEs, mocks, scripted tests and plans are not evidence of live production behavior. Production claims need a live check or a verified report. The audit environment could not reach `esoterica-os.ru` (proxy returned 403), so no live check was possible.

## Matrix

| Project | Public claim | Evidence URL/path | Evidence type | Status | Public-safe | Caveat / next check |
| --- | --- | --- | --- | --- | --- | --- |
| EsotericaOS | Self-initiated AI-native platform: knowledge graph, journal/ritual tracking, AI guide, community and subscription features | `chthonicdragon/esoterica-os` README, `docs/ACTIVE_GOALS_2026-10.md` (private repo); public `esoterica-os-showcase/README.md` | Docs + showcase | Partial | Yes (showcase text); No (private source paths/details) | Live site not verified from audit env. Owner to confirm what is publicly reachable. |
| EsotericaOS | Stack: React/TypeScript/Vite, Express, self-hosted Supabase/Postgres | esoterica-os README ("Стек") | Repo README | Confirmed | Yes | Repo says React 18 (not 19). The portfolio site itself uses React 19. |
| EsotericaOS | Umbra AI assistant with tools/memory | Showcase README, esoterica-os `ACTIVE_GOALS` | Docs | Partial | Yes | Autonomy (#475), metering (#467), quota hardening (#468) are P0/P2 goals or draft PRs (#461, #462, #465). Do not call them production-ready. |
| EsotericaOS | Approach to cost control, security, testing, and AI-integration review | `ACTIVE_GOALS_2026-10.md` (private) | Internal roadmap | Planned / in progress | Yes (approach only) | The public case describes the approach and marks metering and server-side limits as In progress. Specific vulnerabilities and access-control findings stay in the project's internal docs and are not published. |
| EsotericaOS | "40+ routes", "220+ PRs", "4–5 months", "2,400+ tests" | Showcase README | Self-reported | Unknown | No | Removed from the site. PR numbers already exceed 600; repo created 2026-03-04. Re-measure before reuse. |
| EsotericaOS | Screenshots (graph, Umbra, tarot) | `site/public/screenshots/` holds only a README | None | Unknown | Requires permission | No image files exist; site shows no screenshots. Owner to supply real captures. |
| Rejuv | Open, agent-native infrastructure for intervention evidence and benchmarks; pre-alpha | `chthonicdragon/rejuv` README, `docs/roadmap.md`, `docs/foundation-audit-2026-09-26.md` | Public repo docs | Confirmed (docs) | Yes | Public repo; status "pre-alpha / research infrastructure". |
| Rejuv | InterventionEpisode models + exported JSON Schema, source-adapter interface, release fingerprints, versioned readers with migrations | `src/rejuv/models.py`, `contracts/v0_1_0/`, `sources.py`, `releases.py`, `versioning.py`, `schemas/intervention_episode.schema.json`, `tests/` | Code + tests (run 2026-10-19) | Confirmed (code) | Yes | `pytest`: 32 passed, 1 failed. The failure is in `tests/test_schema_contract.py` (`SEMVER_RE` is a raw string with doubled backslashes, so it never matches `0.1.0`). It is a test bug, but it makes `scripts/verify.py` exit non-zero on main. Reported to the owner; shown on the site as In progress. Roadmap lists #10, #11, #12, #14, #15 as open P0. |
| Rejuv | RB01 benchmark, historical replay, RejuvGym | README, roadmap | Plan | Planned | Yes (as planned) | Phases 1–5 unchecked. Real-data ingestion is explicitly paused by the audit. |
| Rejuv | 500–2,000 reviewed episodes | README "MVP" | Target | Planned | Yes (as target only) | No corpus exists. Never present as collected. |
| Rejuv | Not clinical / not medical / no longevity claims | README non-goals | Repo docs | Confirmed | Yes | Keep non-goals visible on the site. |
| Hermes | Owner's own experimental AI agent, run on a separate VPS | None found: no repo, docs or config in the accessible account | Owner statement only | Unknown | Requires permission | Owner confirmed it is their own experiment on a separate VPS; supporting materials to follow. Site keeps a short description only. Do not publish models, tools, memory design, autonomy, VPS details, diagrams, or screenshots until evidence is supplied. |
| Songvideo Studio | Commercial client web app: text/song to 9:16 video via AI storyboard, media search, FFmpeg render; deployed on Cloud.ru and accepted by the client | `chthonicdragon/Music_workspace` README, `docs/SONGVIDEO_FINAL_INTEGRATION_20261010.md`, `docs/SONGVIDEO_HARDENING_20261016.md`, `docs/CLOUD_RU_*` | Repo docs + owner statement | Partial | Requires permission | Repo is private. The 2026-10-05 `V1_READINESS_AUDIT.md` is superseded. Docs confirm a real local render stored in Object Storage (2026-10-10) and a first production test on Cloud.ru with a hardening pass (2026-10-16). Written client acceptance was **not** found in the docs; "accepted by the client" and the Cloud.ru deployment rest on the owner's statement. Client does not object to a mention; screenshots, name, and demos are to be agreed separately. |
| Esoterica Astro Engine | Open-core HTTP astrology calculation service (Kerykeion, Swiss Ephemeris, FastAPI); natal planets, house cusps, aspects, transits; no interpretation | `chthonicdragon/esoterica-astro-engine` README, `pyproject.toml`, `LICENSE`, `NOTICE` | Repo README + metadata | Confirmed (docs) | Yes | README read 2026-10-19. License AGPL-3.0-only. Swiss Ephemeris data is not bundled. Tests were not run. The earlier site wording ("open-source API") was loosened to "open-core" to match the README. |
| Owner profile | Open to international work/relocation, interests in safety/welfare/consciousness | Owner statement | Self-reported | Confirmed (by owner) | Yes | No credentials, publications or lab affiliations are claimed. |
| Owner profile | English level | Owner statement (≈B1) | Self-reported | Confirmed (by owner) | No | Not published as a level. |

## Needs owner confirmation (summary)

1. Hermes: supporting materials (owner will provide later).
2. Songvideo: which public materials and screenshots may be shown; written acceptance record if one exists.
3. EsotericaOS: real screenshots and the list of working features (to be agreed separately).
4. Contacts: professional email and LinkedIn (current email is temporary).
5. Name: "Daniil G." for now; full professional name before publication.
6. Domain: canonical URL is provisional; verify before publication.
