---
phase: 4
title: "Landing Page"
status: complete (visual sign-off pending -- see plan.md validation log)
priority: P1
effort: "6h"
dependencies: [3]
---

# Phase 4: Landing Page

## Overview

The `/` route — the page that has to answer "what is this and where do I start?" within one screen, then hand visitors off to `/projects`, `/learning-paths`, or GitHub. This is the highest-visibility surface on the site.

## Requirements

**Functional**
- Hero: what TheDevOpsHub is, aggregate stats (total stars / repos / topics), two CTAs
- Three entry-point cards routing to the three other pages
- Featured projects (6 max) with live stars/language
- Tech stack, grouped by category rather than one flat icon row
- Closing "explore / follow / contribute" band

**Non-functional**
- LCP element is text or a preloaded image, never a lazily-loaded remote icon
- Every stat traces to `data/github.json` — no hardcoded numbers
- Whole page usable with JS disabled (reveal animations are the only JS)

## Architecture

```
app/page.tsx
└─ HeroSection            aggregate stats from lib/projects.ts
   EntryPointsSection     3 cards → /projects, /learning-paths, /about
   FeaturedProjects       getFeaturedProjects(), shared ProjectCard (see note below)
   TechStackSection       content/tech-stack.ts, grouped
   ExploreCtaSection      org GitHub, all-repos, follow
```

`ProjectCard` is shared with `/projects`. Build it in Phase 5 and import it here, or build it here and import there — either way **one** component, decided by whichever phase runs first. Do not fork two card implementations.

### Tech stack rendering

<!-- Updated: Validation Session 1 - icons vendored to public/icons/, remote fallback rejected -->

The current page renders ~19 remote `<img>` from `skillicons.dev`, `wikimedia`, `helm.sh`, and `githubusercontent` — 19 third-party requests on the critical path, unpredictable sizing, and an external dependency for a first impression.

**Decision: vendor the icons.** Gather each tool's SVG into `public/icons/{tool}.svg` and reference locally. No third-party requests, no layout shift, works offline, and survives `skillicons.dev` going down. This is what makes Phase 7's Lighthouse ≥95 target reachable.

Group them by category (Cloud / Containers / IaC / CI-CD / Observability / Languages) via `content/tech-stack.ts`, where each entry carries `{ name, iconPath, category }`. Every icon needs explicit `width`/`height` to hold layout. Prefer official project SVGs or a permissively-licensed icon set; record the source in a comment in `content/tech-stack.ts` so provenance is traceable.

## Related Code Files

- Modify: `app/page.tsx`
- Create: `components/sections/hero-section.tsx`, `entry-points-section.tsx`, `featured-projects.tsx`, `tech-stack-section.tsx`, `explore-cta-section.tsx`
- Create: `public/icons/*.svg` (~19 vendored tool icons)
- Read: `lib/projects.ts`, `content/devops-hub.ts`, `content/tech-stack.ts`

## Implementation Steps

1. `hero-section.tsx` — h1 with the Hub name, one-sentence positioning from `content/devops-hub.ts`, a `Stat` row (total stars, repo count, topic count from `getAggregateStats()`), primary CTA → `/projects`, secondary → `/learning-paths`. Gradient/pattern treatment using the Phase 3 tokens; keep the text as the LCP element.
2. `entry-points-section.tsx` — three cards (Explore Projects / Learning Paths / About the Hub), each with icon, title, one-line description, arrow affordance. Whole card is a link — one `<a>` per card, not nested interactive elements.
3. `featured-projects.tsx` — grid of up to 6 `ProjectCard`s from `getFeaturedProjects()`, plus a "View all N projects →" link to `/projects`.
4. Gather the ~19 tool SVGs into `public/icons/`, then `tech-stack-section.tsx` — grouped rendering from `content/tech-stack.ts`, every icon with explicit dimensions.
5. `explore-cta-section.tsx` — org GitHub, all-repos link, follow-the-org prompt, contact email.
6. Compose in `app/page.tsx` with `RevealOnScroll` around the below-fold sections (**not** the hero — never animate the LCP).
7. Page-level `metadata` — title, description, canonical `https://thedevopshub.org/`.
8. Check at 320 / 768 / 1440 in both themes.

## Success Criteria

- [ ] Hero communicates what the Hub is without scrolling, at 320px and 1440px
- [ ] Stats match `data/github.json`; grep the page source for hardcoded star numbers → none
- [ ] Every route in the entry-point cards resolves (no 404 to an unbuilt route)
- [ ] Featured projects show live stars and link to the correct owner's repo URL
- [ ] Tech stack section causes no cumulative layout shift (CLS < 0.1 in Lighthouse)
- [ ] Zero third-party image requests on `/` — `grep -E 'skillicons|wikimedia|helm\.sh' out/index.html` returns nothing
- [ ] LCP element is hero text, confirmed in the Lighthouse trace
- [ ] With JS disabled, all content is visible and all links work
- [ ] One `ProjectCard` implementation shared with `/projects`

## Risk Assessment

| Risk | Mitigation |
|---|---|
| 19 remote icons tank LCP/CLS and depend on third parties staying up | Resolved: icons vendored to `public/icons/`, asserted by a grep in Success Criteria |
| Vendored icon licensing/trademark | Use official project SVGs or a permissively-licensed set; record each source in `content/tech-stack.ts` |
| Landing page duplicates `/projects` and neither feels worth visiting | Landing shows 6 featured only; search/filter/full list is exclusive to `/projects` |
| Hero stats look broken when the API returns 0 or the JSON is stale | Render the committed values; nightly cron bounds staleness to 24h |
| Card-as-link with a nested "star" link creates invalid nested anchors | One link per card; stats are plain text inside it |
