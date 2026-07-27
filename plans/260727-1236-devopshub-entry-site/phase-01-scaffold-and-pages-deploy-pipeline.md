---
phase: 1
title: "Scaffold and Pages Deploy Pipeline"
status: complete
priority: P1
effort: "4h"
dependencies: []
---

# Phase 1: Scaffold and Pages Deploy Pipeline

## Overview

Stand up the Next.js 16 + Tailwind v4 project and the GitHub Actions Pages deploy, carrying over every asset the current `index.html` is responsible for (custom domain, analytics, two DAST scanners, logo). Nothing visual yet — the goal is a deployable skeleton that proves the pipeline before any design work rides on it.

## Requirements

**Functional**
- `npm run build` produces a static `out/` with no server runtime
- `out/CNAME` contains `thedevopshub.org`
- Built HTML contains the GA tag, the Insight meta, and **both** Probely metas
- Actions workflow builds and deploys `out/` to Pages on push to `main`

**Non-functional**
- Live site keeps serving the current `index.html` until the user flips the Pages source — no window where the domain is broken
- No `basePath` / `assetPrefix` (root custom domain)
- Node version pinned via `.nvmrc`

## Architecture

```
about/
├─ .github/workflows/deploy.yml   build → upload-pages-artifact → deploy-pages
├─ .nvmrc                         22
├─ public/
│  ├─ CNAME                       thedevopshub.org  (verbatim copy of repo-root CNAME)
│  └─ logo.png                    moved from assets/logo.png
├─ app/{layout,page,globals.css}
├─ next.config.ts                 output: "export", trailingSlash: true, images.unoptimized
└─ index.html                     KEPT until Phase 7 cutover
```

`index.html` stays at the repo root through Phases 1–6. It is not part of the Next build and is deleted only at cutover (Phase 7), so a rollback during development is just "don't flip the Pages setting".

### Preserving the two same-name Probely metas

<!-- Updated: Validation Session 1 - metadata.other replaced with literal <meta> in <head> -->

Emit the three DAST tags as literal JSX in the layout's `<head>`, **not** through `metadata.other`:

```tsx
<head>
  <meta name="insight-app-sec-validation" content="e9cc3fe1-a84b-471b-b390-e195866de170" />
  <meta name="probely-verification" content="e168f1ed-0dfc-4d39-85b8-abf60f65c199" />
  <meta name="probely-verification" content="0e4d1090-a5d1-43e2-9db4-10f2d4ce1fe5" />
  <OrganizationJsonLd />
</head>
```

Rationale: whether `metadata.other` expands an array value into two same-name tags could not be verified, and a silently-dropped tag unregisters a scanner with no error. Literal elements assume no framework behavior and reproduce today's `index.html` byte-for-byte. `dohsites/app/layout.tsx:68` already uses this `<head>`-children slot, so the pattern is proven in the reference.

Do not collapse the two Probely tags into one — they are separate scanner registrations.

## Related Code Files

- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `.nvmrc`, `.gitignore`
- Create: `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `lib/site-config.ts`
- Create: `.github/workflows/deploy.yml`
- Create: `public/CNAME`, `public/logo.png`
- Keep untouched this phase: `index.html`, root `CNAME`, `README.md`
- Delete: `assets/logo.png` (moved to `public/`)

## Implementation Steps

1. `npm init` a Next 16 app in place (do **not** use `create-next-app` into a subdir — this repo root is the app root). Dependencies matching dohsites: `next@16`, `react@19`, `react-dom@19`, `next-themes`, `lucide-react`, `fuse.js`; dev: `tailwindcss@4`, `@tailwindcss/postcss`, `typescript`, `@types/*`, `eslint`, `eslint-config-next`.
2. Write `.nvmrc` with `22`.
3. `next.config.ts`: `output: "export"`, `trailingSlash: true`, `images: { unoptimized: true, remotePatterns: [{ hostname: "avatars.githubusercontent.com" }] }`. **No `basePath`/`assetPrefix`** — this is the divergence from dohsites.
4. `.gitignore`: `node_modules`, `.next`, `out`, `*.tsbuildinfo`, `.env*`.
5. `lib/site-config.ts` — name, title, description, `url: "https://thedevopshub.org"`, keywords, socials (GitHub org `https://github.com/thedevopshub`, maintainer `https://github.com/tungbq`, email `info@thedevopshub.org`).
6. `app/layout.tsx` — fonts, `metadata` (title template, description, keywords, canonical, OpenGraph, Twitter), `viewport` with light/dark `themeColor`, and the three literal DAST `<meta>` elements in `<head>` as shown above. Add GA `G-42PBMZ1BRC` via `next/script` with `strategy="afterInteractive"`.
7. `app/globals.css` — Tailwind v4 `@import "tailwindcss"` plus `@custom-variant dark`. Token values land in Phase 3; a minimal set is fine here.
8. `app/page.tsx` — placeholder heading only. Real content is Phase 4.
9. `git mv assets/logo.png public/logo.png`; `cp CNAME public/CNAME` (root `CNAME` stays until Phase 7 cutover — harmless duplicate, and it keeps the branch-served site working).
10. `.github/workflows/deploy.yml` — model on `dohsites/.github/workflows/deploy.yml`: push to `main` + nightly `schedule` + `workflow_dispatch`; `permissions: contents/pages/id-token`; `concurrency: pages`; setup-node from `.nvmrc` with npm cache; `npm ci`; `npm run build` with `GITHUB_TOKEN`; `upload-pages-artifact` path `./out`; separate `deploy` job on `github-pages` environment. The scheduled data-commit step arrives in Phase 2 — omit it for now.
11. Run `npm run build` locally and assert the five preserved assets in `out/` (see Success Criteria).

## Success Criteria

- [x] `npm run build` exits 0 and emits `out/index.html`
- [x] `cat out/CNAME` → `thedevopshub.org`
- [x] Both `probely-verification` metas present as literal `<meta>` tags — verified via `grep -o '<meta name="probely-verification"[^>]*/>'` (2 matches); the literal `grep -c` count as written undercounts because Next emits single-line minified HTML plus a duplicate serialized copy inside the RSC payload script, not because a tag is missing
- [x] `grep 'insight-app-sec-validation' out/index.html` matches
- [x] `grep 'G-42PBMZ1BRC' out/index.html` matches
- [x] `out/logo.png` exists
- [x] No `/about/` or other basePath prefix appears in emitted asset URLs (`grep '/_next/' out/index.html` shows root-relative paths)
- [x] `npm run lint` clean
- [ ] Workflow file passes `actionlint` or a dry `workflow_dispatch` run — `actionlint` not installed locally; YAML syntax validated with `python3 -c "import yaml; yaml.safe_load(...)"`; not yet exercised via a real `workflow_dispatch` run (requires pushing to a remote, not done this session)
- [x] Live `thedevopshub.org` still serves the old page (Pages source not yet flipped) — no push, no Pages setting change made

## Risk Assessment

| Risk | Mitigation |
|---|---|
| Pages source flip is manual and user-only; agent cannot do it | Phase 1 completes with pipeline green but site unchanged. Cutover is an explicit Phase 7 step with the user in the loop. |
| CNAME lost on deploy → custom domain drops, site 404s | `public/CNAME` is in the build output and asserted in Success Criteria; re-verified post-deploy in Phase 7 |
| Dropping a Probely/Insight meta silently fails a scanner | Explicit `grep -c` count assertion, not an eyeball check |
| Deploying Next to Pages without `.nojekyll` can strip `_next/` | `actions/upload-pages-artifact` does not run Jekyll, so this does not apply on the Actions path — but confirm `out/_next/` assets return 200 after cutover |
| `trailingSlash` mismatch breaks deep links | `trailingSlash: true` matches Pages' directory-index serving; verified per-route in Phase 7 |
