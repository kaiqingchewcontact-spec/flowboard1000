# Flowboard

Flowboard is an AI-assisted portfolio board platform with:

- 8 trend-driven portfolio templates
- navigable live editor
- OAuth social integrations (Instagram, LinkedIn, X)
- server-side encrypted token vault
- real AI provider calls (OpenAI / Anthropic / Custom endpoint)
- slug publishing + QR sharing
- onboarding and tiered pricing pages

## Architecture

- **Frontend:** React + TypeScript + Vite (`src/`)
- **Backend API:** Express + TypeScript (`server/`)
- **Token vault:** AES-256-GCM encrypted file store at `.flowboard/vault.json`
- **Onboarding submissions:** `.flowboard/onboarding.json`

## Local setup

1) Install dependencies:

```bash
npm install
```

2) Create env file:

```bash
cp .env.example .env
```

Fill in OAuth + AI keys in `.env`.

3) Run frontend + API together:

```bash
npm run dev:full
```

Frontend runs on `http://localhost:5173`, API on `http://localhost:8787` (proxied through Vite at `/api`).

## Routes

- `/` landing page
- `/pricing` tiered pricing
- `/onboarding` client onboarding
- `/editor` Flowboard editor
- `/p/:slug` public portfolio
- `/:slug` public portfolio alias

## OAuth + live social pull flow

1. In editor, open **API Connect** panel.
2. Connect Instagram/LinkedIn/X via OAuth.
3. In **Social + AI**, run live pull for a provider.
4. Flowboard fetches provider profile data using server-stored tokens and calls your selected AI provider to generate updates.

## AI configuration

Set one or more provider keys in `.env`:

- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `CUSTOM_AI_API_KEY` (+ custom endpoint in editor)

The editor chooses model/provider from `apiConnections` and calls backend AI endpoints.

## Build & quality checks

```bash
npm run lint
npm run build
```

## Notes

- This implementation is production-oriented in API shape and token handling, but the default vault persistence is file-based. For horizontally scaled deployments, migrate vault storage to managed DB/KV/secret store.
- `vercel.json` keeps SPA rewrites for frontend routes; backend API is intended to run as a Node service.
