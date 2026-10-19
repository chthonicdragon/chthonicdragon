# Visual density review and next pass

Measured 2026-10-19 on the production build (headless Chromium, no horizontal overflow at 1440/768/390 px).

| Viewport | Page height | Screens of scrolling |
| --- | --- | --- |
| 1440 x 900 | 9,574 px | about 10.6 |
| 768 x 1024 | 11,780 px | about 11.5 |
| 390 x 844 | 15,194 px | about 18 |

## Findings

- Ten sections, almost all text on a dark background with the same card and list rhythm. Only the hero background (knowledge graph) and the new Umbra rendering are visual; there is no product imagery at all.
- The two case studies each carry four text blocks (why, role, systems, decisions) plus a status box. This is the densest part of the page and reads like a CV.
- On mobile the page is about 18 screens, mostly because About, How I Build, and Principles stack as separate text sections.
- The hero's right half is empty at desktop width.

## Done in this pass

- Umbra scene beside the EsotericaOS case: a canvas port of the EsotericaOS Umbra. Code rain is pulled into a spirit silhouette; the eyes are the almond eyes of the production `UmbraEyesCanvas` (iris, pupil, highlight, blinking, gaze that follows the pointer) and open once the figure has condensed. No orbit ring, eye rings, or corona. The canvas has no box: it is larger than its column, uses `mix-blend-screen` and a radial mask so the rain fades into the page background. It pauses offscreen and in hidden tabs; reduced motion shows the finished static frame. It is labeled as a stylised rendering, not a screenshot.
- Fixed the knowledge-graph background color: it read a hex custom property and built an invalid `hsl()` string, so edges and nodes were not drawn in the accent color.

## Proposal for the next pass

Order by value, each item keeps a static fallback and loads lazily.

1. **Real product demos (highest value).** For EsotericaOS: 3 to 4 owner-approved captures (graph, Umbra chat, journal) and one 10 to 15 s muted loop, served as `<video preload="none" poster>` or WebP. For Rejuv: a real `InterventionEpisode` JSON next to its validated model and the failing-then-passing test output, as an interactive code panel rather than prose. Blocked on owner-supplied captures and permission.
2. **Merge About, How I Build, and Principles** into one scroll sequence: a five-step pipeline diagram (Define, Plan, Build, Verify, Ship) that reveals one sentence per step, replacing three text blocks. Expected saving: about 3 screens.
3. **Hero scene.** Place a reduced Umbra (or the graph, focused) in the empty right half. Reuse the existing canvas, no new dependency.
4. **Case studies as tabs or a compact summary plus expandable detail**, so a visitor sees the headline, status, and one visual first, and opens decisions on demand.
5. **Research section**: one quiet full-bleed visual (the graph densifying toward a topic) instead of a second text column.
6. **Genesis / Build / Esoterica scenes** (from the earlier brief) only after items 1 to 3. Budget: one canvas or one WebGL scene active at a time, 60 fps target on a mid laptop, under 150 KB of added JS gzip, no autoplay video with sound, lazy-init on intersection, and no scene on `prefers-reduced-motion` or `Save-Data`.

## Performance guardrails

- One animation loop at a time: pause others via `IntersectionObserver`.
- Cap devicePixelRatio at 1.75 for canvases; lower particle counts on coarse pointers.
- Images: AVIF or WebP with explicit width and height; video only on user intent or in view.
- Check Lighthouse performance on a throttled mobile profile before each pass is merged.
