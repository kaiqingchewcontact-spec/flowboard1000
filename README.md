# Flowboard

Flowboard is an AI-assisted portfolio board builder for creators, public people, and brands.

## Core idea

Users can:

- pick from 8 portfolio templates
- customize every section in a navigable editor
- connect social APIs (Instagram, LinkedIn, X)
- let AI pull and transform social profile context
- auto-generate a compelling landing page direction
- publish to custom slugs (`/p/your-slug` or `/your-slug`)
- share via downloadable QR code (name-card style)

## Design system direction (trend research applied)

Flowboard templates are tuned around current landing/portfolio patterns:

- editorial typography with oversized hero messaging
- bento-style modular sections for scannable content
- restrained motion (micro-interactions + subtle hero animation)
- accent gradients and glass-like layering used selectively

Each template includes:

- distinct font family
- distinct color palette
- motion preset (`float`, `pulse`, `pan`)
- graphics preset (`mesh`, `rings`, `grain`, `minimal`)

## Run locally

```bash
npm install
npm run dev
```

Open:

- Gallery: `http://localhost:5173/`
- Editor: `http://localhost:5173/editor`
- Sample page: `http://localhost:5173/p/aria-velvet`

## Build

```bash
npm run lint
npm run build
npm run preview
```

## Project structure

- `src/data/` templates + sample pages
- `src/components/` editor, home, renderer, public page
- `src/lib/socialImport.ts` social/API pull + auto-design logic
- `src/lib/storage.ts` local persistence + slug resolution

## Deployment

`vercel.json` includes SPA rewrites so dynamic routes work on Vercel:

- `/editor`
- `/p/:slug`
- `/:slug`
