---
title: "TheDevOpsHub Entry Site (Next.js Multi-Page Rebuild)"
description: "Rebuild thedevopshub.org from a single index.html into a beautiful multi-page Next.js entry site with live GitHub data"
status: in-progress
priority: P1
branch: "main"
tags: [nextjs, tailwind, github-pages, static-export, portfolio]
blockedBy: []
blocks: []
created: "2026-07-27T05:38:51.542Z"
createdBy: "ck:plan"
source: skill
---

# TheDevOpsHub Entry Site (Next.js Multi-Page Rebuild)

## Overview

Replace the single 245-line `index.html` at `thedevopshub.org` with a multi-page Next.js 16 + Tailwind v4 static-export site — the entry point people land on to explore everything under TheDevOpsHub. Same stack and patterns as the personal portfolio at `/mnt/d/CODING/GITHUB/MY-REPO/dohsites`, but org-scoped instead of person-scoped: this site is about the Hub's projects, learning paths, and toolchain.

**Routes:** `/` (landing) · `/projects` (searchable explorer) · `/learning-paths` · `/about`

**Data:** build-time fetch of both the `TheDevOpsHub` org repos and the curated `tungbq` repos, refreshed nightly by cron. Curated blurbs stay hand-written; stars/forks/language/topics come from the API. The README's 20 unique repos split **13 org / 7 tungbq** (verified — see Validation Log).

**Deployment change (the main risk):** the repo previously served `index.html` straight off `main`. This moved to a GitHub Actions Pages deploy of `out/`.

> **Corrected after launch (2026-07-27).** This section originally assumed the Pages source was still *Deploy from a branch*, and that merging to `main` would therefore be safe until someone manually flipped it to *GitHub Actions*. **That assumption was wrong at merge time** — Pages was already `build_type: workflow`, so the squash-merge of PR #14 went straight to production with no intermediate gate. Everything verified clean, but the safety margin the plan described did not actually exist. See `docs/deployment-guide.md` for how the deploy really works.

### Assets that must survive the rewrite

| Asset | Value | Lands where |
|---|---|---|
| Custom domain | `thedevopshub.org` | `public/CNAME` → `out/CNAME` |
| Google Analytics | `G-42PBMZ1BRC` | `app/layout.tsx` via `next/script` |
| DAST verification | `insight-app-sec-validation` = `e9cc3fe1-a84b-471b-b390-e195866de170` | literal `<meta>` in layout `<head>` |
| DAST verification | `probely-verification` = `e168f1ed-0dfc-4d39-85b8-abf60f65c199` **and** `0e4d1090-a5d1-43e2-9db4-10f2d4ce1fe5` (two tags, same name) | literal `<meta>` in layout `<head>` |
| Logo | `assets/logo.png` | `public/logo.png` |

Losing any of these silently breaks a scanner, analytics, or the domain itself. Phase 1 asserts all five in the build output; Phase 7 re-verifies against the deployed HTML.

## Phases

| Phase | Name | Status |
|-------|------|--------|
| 1 | [Scaffold and Pages Deploy Pipeline](./phase-01-scaffold-and-pages-deploy-pipeline.md) | Complete |
| 2 | [GitHub Data Pipeline](./phase-02-github-data-pipeline.md) | Complete |
| 3 | [Design System and App Shell](./phase-03-design-system-and-app-shell.md) | Complete (visual sign-off pending) |
| 4 | [Landing Page](./phase-04-landing-page.md) | Complete (visual sign-off pending) |
| 5 | [Projects Explorer Route](./phase-05-projects-explorer-route.md) | Complete (visual sign-off pending) |
| 6 | [Learning Paths and About Routes](./phase-06-learning-paths-and-about-routes.md) | Complete (visual sign-off pending) |
| 7 | [QA Accessibility and Launch](./phase-07-qa-accessibility-and-launch.md) | Shipped (axe/Lighthouse still pending) |

**Order:** 1 → 2 → 3 are sequential (pipeline, then data, then shell). 4, 5, 6 all depend on 3 and can be built in any order. 7 is last.

## Key Decisions

| Decision | Choice | Why |
|---|---|---|
| Stack | Next.js 16 + Tailwind v4, `output: "export"` | Matches dohsites; patterns and components transfer between the two sites |
| `basePath` | **none** | Custom domain serves at root, unlike dohsites' `/dohsites` |
| Data scope | org `TheDevOpsHub` + curated `tungbq` repos | The README spans both; the highest-star projects (devops-basics ~1.8k) live under `tungbq` |
| Structure | multi-page routes | Explicit user choice — room per topic, better per-page SEO |
| Search | `fuse.js` client-side | Same as dohsites; 20 repos needs no server |
| Theme | `next-themes`, class-based dark | Preserves the existing dark-mode feature (PR #11) |
| DAST metas | literal `<meta>` in `<head>` | Framework-independent; `metadata.other` array expansion was unverifiable |
| tungbq fetch | 7 individual `/repos/{owner}/{name}` calls | Cheaper than paginating a whole account; 404 maps cleanly to a dead curated repo |
| Tech icons | vendored SVGs in `public/icons/` | Removes 19 third-party requests; makes the Lighthouse ≥95 target reachable |
| OG images | generated via `next/og` | Stays in sync with route titles automatically |
| README | becomes a pointer to the site | `content/projects.ts` is the single source; eliminates drift |
| Learning paths | 4 well-backed paths | Thin 2-repo paths read as filler |

## Dependencies

- Node 22 (`.nvmrc`), npm
- `GITHUB_TOKEN` — the workflow's built-in token is enough for public repo reads; no PAT needed
- Repo setting change: Pages source → GitHub Actions — **already in place before launch**, so no manual flip was needed (see the corrected note above)
- Cloudflare fronts the domain; the HTTP→HTTPS redirect lives there, not in GitHub Pages settings

## Reference

Source patterns: `/mnt/d/CODING/GITHUB/MY-REPO/dohsites` — `scripts/fetch-github-data.mjs`, `lib/projects.ts`, `app/globals.css`, `components/projects/*`, `.github/workflows/deploy.yml`

## Validation Log

### Session 1 — 2026-07-27
**Trigger:** `/ck:plan validate` immediately after plan creation, before any implementation
**Questions asked:** 6

#### Verification Results
- **Tier:** Full (7 phases, all 4 roles)
- **Claims checked:** 22
- **Verified:** 20 | **Failed:** 1 | **Unverified:** 1

Verified samples: `.nvmrc`=22; `next@16.2.12`/`react@19.2.4`/`next-themes`/`fuse.js`/`lucide-react` in `dohsites/package.json`; `MissingCuratedRepoError` at `dohsites/scripts/fetch-github-data.mjs:11`; `filterProjects()` at `dohsites/lib/filter-projects.ts:13`; cron `0 5 * * *` at `dohsites/.github/workflows/deploy.yml:7`; `<head>`-children pattern at `dohsites/app/layout.tsx:68`; `about` CNAME/GA id/3 DAST metas/`assets/logo.png`.

**Failures**
1. [Fact Checker] Phases 2 and 5 claimed "~25 repos". `README.md` lists **20** unique repos (13 `TheDevOpsHub` + 7 `tungbq`). Phase 5's `grep -c` success criterion was unfalsifiable as written. Corrected to 20 across phases 2, 5, 7.

**Unverified**
1. `metadata.other` array value → two same-name `<meta>` tags. `node_modules` reads blocked by the scout hook, so Next's behavior could not be confirmed. Escalated to Q1 below and designed around rather than assumed.

#### Questions & Answers

1. **[Risk]** How should Phase 1 emit the two same-name `probely-verification` metas, given `metadata.other` array expansion is unverified?
   - Options: Raw `<meta>` in `<head>` (Recommended) | `metadata.other` array, verified in Phase 1 | Drop to one Probely tag
   - **Answer:** Raw `<meta>` in `<head>`
   - **Rationale:** A dropped tag unregisters a scanner with no error. Literal JSX assumes no framework behavior and reproduces today's HTML exactly; the `<head>`-children slot is already proven at `dohsites/app/layout.tsx:68`.

2. **[Architecture]** How should Phase 2 fetch the 7 curated `tungbq` repos?
   - Options: Fetch the 7 individually (Recommended) | Paginate all tungbq repos then filter | Org-only, drop tungbq
   - **Answer:** Fetch the 7 repos individually
   - **Rationale:** Avoids paginating a whole personal account for 7 results, and a 404 maps directly onto `MissingCuratedRepoError` — sharpening the fatal-vs-transient distinction. Requires 404 and 5xx to be handled differently.

3. **[Tradeoffs]** How should the tech stack render its ~19 icons?
   - Options: Vendor SVGs into `public/icons/` (Recommended) | Keep remote, below fold, lazy + sized | Text badges, no icons
   - **Answer:** Vendor SVGs into `public/icons/`
   - **Rationale:** Removes 19 third-party requests and the CLS they cause; this is what makes Phase 7's Lighthouse ≥95 target achievable rather than aspirational.

4. **[Scope]** After launch, is `README.md` or `content/projects.ts` the canonical project index?
   - Options: README becomes a pointer (Recommended) | Keep both + CI drift check | Keep both, no check
   - **Answer:** README becomes a short pointer
   - **Rationale:** Eliminates dual maintenance outright. Phase 7 must assert all 20 repos exist in `content/projects.ts` before removing the README list.

5. **[Scope]** How many learning paths should ship, given uneven repo backing?
   - Options: 4 well-backed paths (Recommended) | All 6 as proposed | 6 with thin ones labelled
   - **Answer:** 4 well-backed paths
   - **Rationale:** Observability (2 repos) and Cloud Cert (3) read as filler. Their repos fold into Containers/K8s and CI-CD & Cloud as steps, so no repo is orphaned.

6. **[Architecture]** How should the four routes' OG images be produced?
   - Options: Generate with `next/og` (Recommended) | One static site-wide default | Static per-route, hand-designed
   - **Answer:** Generate with `next/og` at build time
   - **Rationale:** Stays in sync with route titles automatically. Diverges from dohsites' static `.jpg` files, so Phase 7 must verify `ImageResponse` renders under `output: "export"` and carries a fallback.

#### Confirmed Decisions
- DAST metas: literal `<meta>` in `<head>`, never `metadata.other`
- tungbq repos: 7 individual `/repos/{owner}/{name}` fetches; 404 fatal, 5xx → cache
- Tech icons: vendored to `public/icons/`, zero third-party image requests on `/`
- README: becomes a pointer; `content/projects.ts` is canonical
- Learning paths: exactly 4, each ≥3 steps
- OG images: `next/og` generated, with a static fallback if export-time rendering fails
- Cron cadence: daily 05:00 UTC (unchanged, matches dohsites — not asked, no genuine tradeoff)

#### Impact on Phases
- Phase 1: DAST architecture section + step 6 rewritten
- Phase 2: fetch architecture, error semantics, steps 2/5/6, success criteria, risks
- Phase 4: icon vendoring now a decision; new grep-based success criterion + licensing risk
- Phase 5: repo count 25 → 20 in overview, success criteria, risks
- Phase 6: 6 paths → 4; path table rewritten; new success criterion
- Phase 7: OG generation, README rewrite, unresolved questions cleared

### Whole-Plan Consistency Sweep
- Files reread: `plan.md`, `phase-01` … `phase-07`
- Decision deltas checked: 7
- Reconciled stale references: 12
- Unresolved contradictions: 0
