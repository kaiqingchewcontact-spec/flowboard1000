# Portfolio Studio (Webflow-style templates + editor)

This project is a React + TypeScript app that provides:

- 8 ready portfolio pages (singer, actor, public figure, company, influencer, startup, agency)
- A navigable live editor with changeable sections
- Template switching connected to live preview
- Social connect buttons (Instagram, LinkedIn, X + extras)
- AI-powered social pull simulation to auto-populate portfolio fields
- Custom slug publishing (`/p/your-slug` and `/your-slug`)
- QR code generation for shareable digital name cards

## Run locally

```bash
npm install
npm run dev
```

Open:

- Template gallery: `http://localhost:5173/`
- Editor: `http://localhost:5173/editor`
- Public profile example: `http://localhost:5173/p/aria-velvet`

## Build

```bash
npm run build
npm run preview
```

## How it works

- Seed templates and pages are in `src/data/`
- Editor and portfolio renderer are in `src/components/`
- Social AI import logic is in `src/lib/socialImport.ts`
- Slug/local storage publishing logic is in `src/lib/storage.ts`

Saved pages are stored in browser localStorage so each user can publish custom slugs instantly.
