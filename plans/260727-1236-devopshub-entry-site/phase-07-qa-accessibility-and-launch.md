---
phase: 7
title: "QA Accessibility and Launch"
status: partial (steps 1-10 done; axe/Lighthouse unrunnable in this sandbox; steps 11-14 are user-gated cutover -- see plan.md)
priority: P1
effort: "4h"
dependencies: [4, 5, 6]
---

# Phase 7: QA Accessibility and Launch

## Overview

Full-site verification, SEO wiring, then the actual cutover of `thedevopshub.org` from the branch-served `index.html` to the Actions-deployed Next build. The cutover has a user-only manual step and a rollback path that must be confirmed *before* flipping, not after.

## Requirements

**Functional**
- `sitemap.xml` and `robots.txt` generated, covering all four routes
- Per-route OpenGraph/Twitter images
- Every internal and external link resolves
- Zero critical/serious axe violations on all four routes, both themes

**Non-functional**
- Lighthouse ≥ 95 across Performance / Accessibility / Best Practices / SEO on `/`
- Post-deploy: custom domain, HTTPS, GA, and both DAST scanners confirmed live
- `docs/` written so the next person can run and deploy this

## Architecture

Cutover sequence, in order, with a rollback point before the irreversible step:

```
1. Verify build output locally (all assertions below)
2. Merge to main → workflow runs → artifact deploys to the github-pages environment
   ...site still serves old index.html; Pages source unchanged...
3. Inspect the deployed preview URL from the workflow's deploy job
4. USER flips Pages source: "Deploy from a branch" → "GitHub Actions"     ← irreversible-ish
5. Verify live thedevopshub.org: domain, HTTPS, all routes, GA, DAST metas
6. Only after step 5 passes: delete index.html and root CNAME in a follow-up commit
```

Step 6 is deliberately last. Keeping `index.html` and the root `CNAME` until the new site is confirmed live means rollback is "flip Pages back to branch" with the old page still intact.

## Related Code Files

- Create: `app/sitemap.ts`, `app/robots.ts`
- Create: `app/opengraph-image.tsx` + per-route `opengraph-image.tsx` (generated via `next/og` `ImageResponse`)
- Create: `docs/deployment-guide.md`, `docs/codebase-summary.md`
- Rewrite: `README.md` — trimmed to intro + link to thedevopshub.org; `content/projects.ts` becomes the canonical project index
- Delete (step 6 only): `index.html`, root `CNAME`, `assets/` (if now empty)

## Implementation Steps

1. `app/sitemap.ts` — all four routes from `lib/nav-links.ts`, absolute `https://thedevopshub.org` URLs, `trailingSlash`-consistent.
2. `app/robots.ts` — allow all, point at the sitemap.
3. OG/Twitter images — generate with `next/og` `ImageResponse`: one shared template component (Hub name, logo, route title, gradient from the Phase 3 tokens) plus a per-route `opengraph-image.tsx` passing its own title. Static export renders these to PNG at build time. Confirm they resolve at absolute URLs — relative OG URLs break in most crawlers. Note `next/og` needs fonts embedded as buffers, not `next/font`.
4. Run axe (or `@axe-core/cli`) against all four built routes in both themes; fix every critical/serious finding.
5. Run Lighthouse on `/` and `/projects`; record the four scores in the report and fix anything below 95.
6. Link check the whole `out/` — internal links and every external GitHub URL. Any 404 is a content bug in `content/projects.ts` or `content/learning-paths.ts`.
7. Rewrite `README.md` as a pointer: org intro, the icon strip, a link to thedevopshub.org, and a short "how to run/deploy this site" section. Before deleting the project list, confirm all 20 repos are represented in `content/projects.ts` — that file becomes canonical and the README list must not be lost, only moved.
8. Responsive pass: 320 / 375 / 768 / 1024 / 1440, both themes, all four routes. No horizontal scroll anywhere.
9. Verify build-output assertions again on the full site: `out/CNAME`, `grep -c probely-verification` → 2, Insight meta, GA id, and that every route emitted `index.html`.
10. Write `docs/deployment-guide.md` (build, local dev, the `GITHUB_TOKEN`, the cron refresh, the Pages setting, **rollback steps**) and `docs/codebase-summary.md`.
11. Merge to `main`; confirm the workflow's build and deploy jobs are green.
12. **Ask the user** to flip Pages source to GitHub Actions. Provide the exact settings path. This is not an agent action.
13. Post-cutover verification against live `https://thedevopshub.org`: apex + HTTPS, all four routes, `_next/` assets 200, GA firing, both DAST metas present in the served HTML.
14. Only after 13 passes: delete `index.html`, root `CNAME`, and the empty `assets/` in a follow-up commit.

## Success Criteria

- [ ] Zero critical/serious axe violations, four routes × two themes
- [ ] Lighthouse ≥ 95 on all four categories for `/` and `/projects`
- [ ] Zero broken links in `out/` (internal + external)
- [ ] All four routes emit `index.html` and resolve with `trailingSlash: true`
- [ ] `out/CNAME` = `thedevopshub.org`; `grep -c 'probely-verification'` = 2; Insight meta and GA id present
- [ ] `sitemap.xml` lists four absolute URLs; `robots.txt` references it
- [ ] OG images generate at build time, resolve at absolute URLs, and render the correct per-route title
- [ ] All 20 repos present in `content/projects.ts` before the README list is removed
- [ ] `npm test`, `npm run lint`, `npm run build` all clean
- [ ] Live domain serves the new site over HTTPS with no mixed content
- [ ] GA registers a pageview on the live site
- [ ] `docs/deployment-guide.md` includes a rollback procedure
- [ ] `index.html` removed **only after** live verification passed

## Risk Assessment

| Risk | Mitigation |
|---|---|
| Pages source flip breaks the live domain | Old `index.html` + root `CNAME` retained until post-cutover verification passes; rollback is flipping the setting back |
| Custom domain unsets itself when the Pages source changes | `public/CNAME` ships in every build; re-assert the domain in repo settings immediately after the flip |
| HTTPS cert re-provisioning lag after the source change | Known GitHub Pages behavior, can take minutes; verify before declaring done, do not delete `index.html` during the window |
| DAST scanner verification silently lost → scans start failing | `grep -c` assertion pre-deploy and a check of the live HTML post-deploy |
| GA double-counts or stops during cutover | Same measurement id, one script tag; verify a live pageview |
| Lighthouse 95 unreachable due to remote skillicons requests | Resolved in Phase 4: icons vendored to `public/icons/` |
| `next/og` fails under `output: "export"` or needs runtime fonts | Verify OG generation in the first local build of this phase; fall back to one static site-wide image if it cannot render at export time |
| Rewriting README loses the project list | `content/projects.ts` completeness is asserted (all 20) before the list is removed |

## Unresolved Questions

None — all four open questions were resolved in Validation Session 1 (see `plan.md` → Validation Log). Cron cadence stays daily at 05:00 UTC, matching the dohsites precedent.
