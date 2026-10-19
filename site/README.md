# Portfolio site

Personal portfolio for Daniil G., an AI Product Builder with research interests in model behavior, evaluation, and AI safety. React, TypeScript, Vite, Tailwind CSS v4, and Framer Motion.

Strategy, evidence, copy rules, the plan, and the visual density review are in [`docs/`](./docs): `PORTFOLIO_STRATEGY.md`, `PROJECT_EVIDENCE.md`, `CONTENT_AND_VOICE.md`, `IMPLEMENTATION_PLAN.md`, `VISUAL_DENSITY.md`. Copy lives in `src/data/*.ts`; every public claim should map to a row in `PROJECT_EVIDENCE.md`.

## Development

```bash
npm install
npm run dev       # local dev server
npm run build     # typecheck + production build to dist/
npm run preview   # preview the production build
npm run lint      # oxlint
```

## Screenshots

No screenshots are published. To add one, put the file in `public/screenshots/` and list it in the `screenshots` array of the matching case in `src/data/caseStudies.ts` (see `public/screenshots/README.md`). Only publish captures the owner has permission to share.

## Deployment

Static build output in `dist/` — deploy to Vercel, Netlify, or GitHub Pages. Before going live,
update the canonical/OG URLs in `index.html` and `src/data/site.ts` to match the real domain.
