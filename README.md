# 🌸 Підеш зі мною на побачення?

A tiny Ukrainian-language date-proposal site built as a love letter for Катя. A clone of [say-yes-or-else.replit.app](https://say-yes-or-else.replit.app) — same vibe, translated to Ukrainian, with a couple of inside jokes you can edit in one file.

**Live**: https://katya.oponomarov.com (after deploy)

## Quick start

### With Docker (recommended)

```bash
docker compose up
# → http://localhost:5173 (Vite dev server with HMR)
```

### Without Docker

```bash
nvm use     # uses .nvmrc → Node 22
npm install
npm run dev
# → http://localhost:5173
```

## Editing the text

All Ukrainian copy lives in **one file**: [`src/content/strings.ts`](./src/content/strings.ts).

Edit anything — buttons, headings, time-slot jokes, the final letter — and the page updates instantly via HMR.

```ts
home: {
  question: '🌸 Підеш зі мною на побачення? 🌸',
  yes: 'ТАК 💕',
  no: 'ні… 🙈',
},
```

## Swapping photos / GIFs

Three images can be replaced with personal photos. Drop a file into `public/images/` with the right filename — that's it, no code changes.

| File                          | Used on                    |
| ----------------------------- | -------------------------- |
| `public/images/cat.gif`       | `/` — home question        |
| `public/images/spongebob.gif` | `/yay` — surprise reaction |
| `public/images/shrek.gif`     | `/letter` — love letter    |

Any image format works (`.gif`, `.jpg`, `.png`, `.webp`). If the local file is missing, the page falls back to a default remote GIF. To change alt text or default remotes, edit [`src/content/images.ts`](./src/content/images.ts).

## Project structure

```
src/
├── App.tsx                  # Router (wouter) + page transitions
├── content/
│   ├── strings.ts           # ← All Ukrainian copy
│   └── images.ts            # Image registry (local-first, remote-fallback)
├── components/
│   ├── Layout, Card, Button, PageTransition
│   ├── EscapingNoButton     # ← The "ні" button that runs away
│   ├── Petals, FloatingHearts
│   └── SwappableImage
├── pages/
│   ├── HomePage    /        # The question
│   ├── YayPage     /yay     # Surprise
│   ├── DatePage    /date    # When are you free?
│   ├── FoodPage    /food    # What food?
│   └── LetterPage  /letter  # Love letter
├── hooks/                   # useViewportSize, usePrefersReducedMotion
├── lib/                     # cn(), randomPosition()
└── test/                    # vitest + RTL test files
```

## Common commands

```bash
npm run dev         # Vite dev server (HMR)
npm run build       # Production build → dist/
npm run preview     # Serve built site on :4173 (no SPA fallback)
npm test            # Run all tests once
npm run test:watch  # Watch mode
npm run typecheck   # tsc --noEmit
npm run lint        # ESLint
npm run format      # Prettier --write
```

## Production preview (with SPA fallback)

`vite preview` doesn't replicate GitHub Pages' 404 fallback. To preview the exact production behavior locally:

```bash
docker compose -f compose.prod.yaml up --build
# → http://localhost:8080 (nginx with try_files SPA fallback)
```

## Deploying to GitHub Pages with a custom domain

### One-time setup

1. **Push to GitHub** (`git push origin main`).

2. **Enable Pages**: repo Settings → Pages → Source → "GitHub Actions" (NOT "Deploy from a branch").

3. **Set custom domain**: Settings → Pages → Custom domain → enter `katya.oponomarov.com` → Save. GitHub will verify the domain and may take a few minutes.

4. **Configure DNS** at your registrar (whoever hosts `oponomarov.com`). Add one of:
   - **CNAME record** (recommended): `katya` → `<github-username>.github.io`
   - or **ALIAS/ANAME**: if your DNS provider supports them for subdomains.

   Replace `<github-username>` with the GitHub account/org owning this repo. The lookup `dig +short katya.oponomarov.com` should eventually return GitHub's IPs.

5. **Wait for DNS** (anything from minutes to ~24 hours). When the check passes, GitHub Pages will show "✓ Your site is published at https://katya.oponomarov.com".

6. **Enable HTTPS**: same settings page → tick "Enforce HTTPS" once it becomes available.

### Subsequent deploys

Just push to `main`. The workflow in `.github/workflows/deploy.yml` runs typecheck → lint → tests → build → deploy automatically. Successful runs deploy in ~1-2 minutes.

### Troubleshooting

| Symptom                                 | Cause                              | Fix                                                                               |
| --------------------------------------- | ---------------------------------- | --------------------------------------------------------------------------------- |
| 404 on root after deploy                | Pages source still set to "branch" | Settings → Pages → Source = GitHub Actions                                        |
| Custom domain not verified              | DNS hasn't propagated              | `dig +short katya.oponomarov.com` should show GitHub IPs; wait                    |
| Refresh on `/yay` shows GitHub 404 page | `404.html` missing from build      | Workflow includes a CNAME/404 check — re-run; check `scripts/copy-404.mjs` exists |
| HTTPS toggle disabled                   | Cert still provisioning            | Wait 30-60 min after DNS verified                                                 |
| Assets 404 in production                | Vite `base` wrong                  | Must be `'/'` in `vite.config.ts` (we're at root of custom domain)                |

## Tech stack

- **Vite 5** + **React 18** + **TypeScript** — fast dev server, sane defaults
- **Tailwind 3.4** with HSL CSS variables for the pink/lavender/cream palette
- **wouter** — 2 KB router (instead of react-router)
- **motion** (formerly framer-motion) — petal/heart drift + page transitions
- **vitest + @testing-library/react** — 38 tests
- **ESLint 9 (flat config) + Prettier**

## Tests

`npm test` runs the full suite. Currently 38 tests across 8 files:

- `randomPosition` (pure logic) — 6
- `SwappableImage` (image fallback) — 6
- `EscapingNoButton` (pointer + touch + keyboard) — 7
- `HomePage` — 4
- `YayPage` — 2
- `DatePage` (validation) — 5
- `FoodPage` (single-select) — 5
- `LetterPage` — 3

## Reduced motion

If the user has `prefers-reduced-motion: reduce` set in their OS, petals/hearts/page-transitions all simplify, and the No-button does a tiny fixed nudge instead of teleporting. Respect, etc.

## License

MIT (see [LICENSE](./LICENSE)).
