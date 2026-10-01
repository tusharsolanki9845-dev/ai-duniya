# AI DUNIYA

Learning & innovation studio site — React 19, Vite 7, Tailwind CSS v4, wouter, framer-motion.

## Quick start

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

## Build & run for production

```bash
pnpm build        # builds client (dist/public) + server (dist/index.js)
pnpm start        # node dist/index.js  (serves dist/public on $PORT, default 3000)
```

For a **static-only** host (Vercel, Netlify, GitHub Pages, S3 + CloudFront, etc.) you don't
need the Node server at all:

```bash
pnpm build:static   # outputs dist/public — deploy that folder directly
```

## Deploying

- **Vercel** — `vercel.json` is already set up (`pnpm build:static`, SPA rewrites, asset caching).
  Just import the repo.
- **Netlify** — `netlify.toml` is already set up the same way.
- **GitHub Pages** — the build copies `index.html` → `404.html` automatically so deep links
  (e.g. `/labs/ai`) work without a rewrite rule. Push `dist/public` to your `gh-pages` branch,
  or use `actions/deploy-pages` with `pnpm build:static` as the build step.
- **Any Node host** (Render, Railway, a VPS, etc.) — `pnpm build && pnpm start`, or run
  `node dist/index.js` behind your process manager. Respects `$PORT`.

## Environment variables

Copy `.env.example` to `.env` and fill in what you need — everything is optional:

| Variable | What it does |
|---|---|
| `VITE_FORM_ENDPOINT` | POST target for the contact form (a free Formspree / Getform / Web3Forms endpoint works well). If unset, the form falls back to opening the visitor's email client with the message pre-filled — nothing is ever lost. |
| `VITE_ANALYTICS_ENDPOINT` / `VITE_ANALYTICS_WEBSITE_ID` | Self-hosted Umami analytics. Both must be set or no analytics script is loaded. |

## Editing content

Almost everything you'll want to change day-to-day — courses, exam questions, products, nav
links, the site guide's answers, contact details — lives in one place:

```
client/src/lib/site.ts
```

Edit that file; the pages read from it automatically.

## What's where

```
client/src/
  components/        Header, footer, forms, dialogs, shared chrome
  components/fx/      Scroll reveals, cursor glow, neural canvas, count-up, etc.
  components/labs/    The interactive tools: rover simulator, neural sandbox,
                       tokenizer, prompt builder, exam runner
  pages/              One file per route
  lib/site.ts          All editable content (courses, exams, products, nav, guide answers)
  lib/nav.ts           Client-side navigation + hash-scroll helpers
  index.css            Design tokens & component classes (colors, buttons, cards, type)
server/index.ts        Production static file server (only used by `pnpm start`)
```

## Notes

- The "site guide" chat assistant is a small rule-based matcher (see `guideAnswer` in
  `lib/site.ts`) — no external AI API calls, no API key needed, and it says so in its own header.
- Add a real founder photo at `client/public/images/founder.jpg` (any size, will be cropped)
  and the About page will use it automatically — until then it shows a clean placeholder.
- The rover simulator and neural sandbox are original canvas/SVG builds with no external
  dependencies or CDN assets.
