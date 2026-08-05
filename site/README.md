# Portfolio site

Personal portfolio for Daniil G. — React, TypeScript, Vite, Tailwind CSS v4, and Framer Motion.

## Development

```bash
npm install
npm run dev       # local dev server
npm run build     # typecheck + production build to dist/
npm run preview   # preview the production build
npm run lint      # oxlint
```

## Adding real EsotericaOS screenshots

The Featured Project section reads images from `public/screenshots/` and falls back to a
placeholder automatically if a file is missing. See `public/screenshots/README.md` for the
exact filenames expected.

## Deployment

Static build output in `dist/` — deploy to Vercel, Netlify, or GitHub Pages. Before going live,
update the canonical/OG URLs in `index.html` and `src/data/site.ts` to match the real domain.
