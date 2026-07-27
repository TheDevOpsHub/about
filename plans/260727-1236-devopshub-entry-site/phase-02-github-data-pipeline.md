---
phase: 2
title: "GitHub Data Pipeline"
status: complete
priority: P1
effort: "5h"
dependencies: [1]
---

# Phase 2: GitHub Data Pipeline

## Overview

Fetch repo stats at build time from **two** sources — the `TheDevOpsHub` org and the curated `tungbq` repos — merge them against a hand-written content file, and commit the result as `data/github.json`. Pages render from the committed JSON, so a GitHub API outage degrades to slightly stale numbers instead of a failed build.

This is the phase that makes the site feel alive rather than a static link list.

## Requirements

**Functional**
- Fetch `/orgs/TheDevOpsHub/repos` (paginated) and each curated `tungbq` repo individually
- Join API stats onto curated entries by case-insensitive repo name
- A curated entry pointing at a repo that no longer exists **fails the build** (content bug)
- A network/API failure falls back to the committed `data/github.json` (transient)
- Nightly cron refresh commits the updated JSON

**Non-functional**
- Trim the API payload — store only what's rendered, not raw repo objects
- Respect rate limits: authenticated requests via `GITHUB_TOKEN`, log `x-ratelimit-remaining`
- Unit tests run without network (pure functions take fetched data as input)

## Architecture

Two-owner fetch, one merged output, but **two different strategies** — the org is enumerated, individual repos are fetched by name.

<!-- Updated: Validation Session 1 - tungbq side fetches 7 repos individually instead of paginating the account -->

```js
// Enumerated: we want everything the org owns, then filter to curated.
const ORG = "TheDevOpsHub";                     // 13 curated repos
// Targeted: 7 repos among a much larger personal account -- fetch by name.
const EXTERNAL_OWNER = "tungbq";                // 7 curated repos
```

- Org side: `GET /orgs/TheDevOpsHub/repos?per_page=100` with Link-header pagination.
- tungbq side: `GET /repos/tungbq/{name}` once per curated entry with `owner === "tungbq"`.

Paginating all of `tungbq`'s public repos to keep 7 of them wastes requests and rate limit. Fetching by name also gives a cleaner failure signal: a **404 is exactly `MissingCuratedRepoError`** — that repo was renamed, deleted, or made private. Distinguish 404 (content bug, fatal) from 5xx/network (transient, falls back to cache).

`/orgs/{org}/repos` and `/repos/{owner}/{repo}` return the same repo shape, so one `trimRepo` handles both. Forks are filtered out on the org side. The union is keyed by lowercased `name`; if the same name appeared under both owners the org wins (documented tiebreak — not expected in practice, but the merge must be deterministic).

```
scripts/fetch-github-data.mjs   fetch + merge + validate  →  data/github.json
content/projects.ts             curated: repo, owner, title, blurb, category, tags, featured, order
lib/projects.ts                 join JSON + curated, expose selectors to components
types/github.ts                 GithubData, CuratedProject, Project, ProjectCategory
```

Curated entries carry an explicit `owner` field, because `devops-basics` (tungbq) and `AzureHub` (org) both appear in the same list and the repo URL differs by owner.

### Error semantics (carried over from dohsites)

- `MissingCuratedRepoError` → always fatal, cache or not. Raised when a curated repo is absent from the org listing, or when its individual fetch returns **404**.
- Any other fetch failure (5xx, network, rate limit) → warn, keep the existing `data/github.json`, exit 0.
- Missing `data/github.json` **and** a fetch failure → fatal; there is nothing to render.

## Related Code Files

- Create: `scripts/fetch-github-data.mjs`, `scripts/fetch-github-data.test.mjs`
- Create: `content/projects.ts`, `content/devops-hub.ts`, `content/tech-stack.ts`
- Create: `lib/projects.ts`, `types/github.ts`, `data/github.json` (committed)
- Modify: `package.json` — `"build": "node scripts/fetch-github-data.mjs && next build"`, `"build:nofetch": "next build"`, `"test": "node --experimental-strip-types --test scripts/*.test.mjs lib/*.test.mjs"`
- Modify: `.github/workflows/deploy.yml` — add the scheduled-run commit step for `data/github.json`

## Implementation Steps

1. `types/github.ts` — `TrimmedRepo` (name, owner, description, stars, forks, language, topics, htmlUrl, pushedAt, archived), `GithubData` (`{ repos: Record<string, TrimmedRepo>, orgProfile, generatedAt }`), `CuratedProject`, `Project`.
2. `content/projects.ts` — port all **20** repos from `README.md` (13 `TheDevOpsHub` + 7 `tungbq`, count verified) with category, owner, and a **hand-written** blurb. Do not copy GitHub descriptions verbatim; the README one-liners are the starting point, not the output. Categories: `Trio`, `Cloud`, `Linux`, `CI/CD`, `IaC`, `Containers`, `Monitoring`, `Cheatsheet`, `Books`.
3. `content/devops-hub.ts` — the Hub's identity copy: tagline, description, mission, topic list, maintainer, contact.
4. `content/tech-stack.ts` — the toolchain currently rendered as the `skillicons.dev` icon strip, as structured data (name, icon URL, category) so Phase 4 can lay it out properly instead of as a flat row of `<img>`.
5. `scripts/fetch-github-data.mjs` — `fetchAll(url, token)` with Link-header pagination (org listing); `fetchRepo(owner, name, token)` for individual repos, mapping 404 → `MissingCuratedRepoError`; `trimRepo`; `buildData(orgRepos, individualRepos, curated)` performing the merge and the missing-repo check; `main()` with the fallback logic above. Export the pure functions for tests.
6. `scripts/fetch-github-data.test.mjs` — cover: pagination via Link header, fork filtering, case-insensitive join, `MissingCuratedRepoError` from both a missing org repo and a 404 individual fetch, 5xx falling through to cache instead of throwing, org-wins tiebreak, `trimRepo` field mapping. Use fixture objects; **no network in tests**.
7. `lib/projects.ts` — selectors: `getAllProjects`, `getFeaturedProjects`, `getProjectsByCategory`, `getCategories`, `getLanguages`, `getTopics`, `getAggregateStats` (total stars/forks/repo count for the landing hero).
8. `lib/filter-projects.ts` + test — search/category/language/topic filtering, extracted as a pure function so Phase 5's UI stays thin and the logic is unit-testable.
9. Run `npm run build` with a real token; commit the produced `data/github.json`.
10. Add the scheduled-commit step to the workflow (`if: github.event_name == 'schedule'`, `git add data/github.json`, commit only if the diff is non-empty).

## Success Criteria

- [ ] `npm test` passes, all pure-function tests, zero network calls
- [ ] `data/github.json` contains all 20 repos referenced in `content/projects.ts`
- [ ] A curated entry pointing at a nonexistent repo fails the build with `MissingCuratedRepoError` — tested for both the org path and the individual-fetch 404 path
- [ ] Simulated 5xx with an existing `data/github.json` → build succeeds with a warning (does **not** get misread as a missing repo)
- [ ] tungbq side issues exactly 7 requests, not a full account pagination
- [ ] `data/github.json` diff is stable across two consecutive runs apart from `generatedAt` and stat drift
- [ ] Star counts in the JSON match the live GitHub values on spot-check of 3 repos
- [ ] Every repo listed in `README.md` appears in `content/projects.ts` (no silent drops)

## Risk Assessment

| Risk | Mitigation |
|---|---|
| Unauthenticated rate limit (60/h) breaks local dev builds | `build:nofetch` script renders from committed JSON; token only needed for refresh |
| Nightly commit loops or fights concurrent pushes | Commit step is `schedule`-only and no-ops on an empty diff |
| `generatedAt` churns the JSON on every run, noisy diffs | Acceptable for a nightly cron; alternative is dropping the field — decide during implementation if diff noise is annoying |
| Curated list drifts from README over time | Resolved by decision: README becomes a pointer to the site in Phase 7, leaving `content/projects.ts` as the single source |
| A private/renamed tungbq repo 404s and is misread as transient | 404 is explicitly mapped to `MissingCuratedRepoError` (fatal); only 5xx/network fall back to cache |
| Org repos include archived/low-value repos | Curated list is an allowlist — the org fetch never auto-publishes a repo |
