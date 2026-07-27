# Codebase Summary

Next.js 16 (App Router) + Tailwind v4 static-export site for `thedevopshub.org`. Same
patterns as the `dohsites` personal portfolio, org-scoped instead of person-scoped.

## Routes

| Route | File | Purpose |
|---|---|---|
| `/` | `app/page.tsx` | Hero, entry-point cards, featured projects, tech stack, CTA |
| `/projects` | `app/projects/page.tsx` | Full 20-repo catalog: search, filter, sort |
| `/learning-paths` | `app/learning-paths/page.tsx` | 4 ordered paths through the catalog |
| `/about` | `app/about/page.tsx` | Mission, maintainer, contributing, contact |

## Data flow

```
scripts/fetch-github-data.mjs
  fetches TheDevOpsHub org repos (paginated) + 7 tungbq repos (individually)
  merges against content/projects.ts
  writes data/github.json (committed)
        |
        v
lib/projects.ts     -- joins data/github.json with content/projects.ts, exposes selectors
lib/learning-paths.ts -- resolves content/learning-paths.ts steps against lib/projects.ts,
                          throws at build time on an unknown repo reference
```

`data/github.json` is committed, not fetched client-side -- pages render from it directly,
so a GitHub API outage degrades to stale numbers (bounded by the nightly cron) instead of a
broken build.

## Content (data, not JSX)

- `content/projects.ts` -- the 20 curated repos: title, blurb, category, tags, owner. The
  canonical project index (README no longer duplicates it).
- `content/devops-hub.ts` -- org identity copy: tagline, mission, maintainer, contact.
- `content/tech-stack.ts` -- toolchain entries, grouped by category, icon paths into
  `public/icons/` (vendored, CC0 Simple Icons + Helm's official SVG -- zero third-party
  image requests).
- `content/learning-paths.ts` -- the 4 learning paths as ordered step lists.

## Design system

- `app/globals.css` -- color tokens for `:root`/`.dark`, contrast ratios measured and
  recorded in comments, `@theme inline` mapping for Tailwind v4.
- `components/theme-provider.tsx` / `theme-toggle.tsx` -- `next-themes`, class-based dark
  mode, mounted-guard against hydration mismatch.
- `components/layout/` -- header (desktop nav + mobile disclosure menu with focus trap),
  footer, skip link. `lib/nav-links.ts` is the single source of truth for the 4 routes,
  paired with `isActiveRoute()` to handle `next.config.ts`'s `trailingSlash: true`.
- `components/ui/` -- shared primitives: `Badge`, `Card`, `Stat`, `SectionHeading`,
  `RevealOnScroll` (IntersectionObserver fade-up, `prefers-reduced-motion`-aware).

## Feature components

- `components/projects/` -- `ProjectCard` (shared between `/` and `/projects`),
  `ProjectsExplorer` (client, holds filter/sort state), `FilterButtonGroup`
  (`role="radiogroup"`, arrow-key roving tabindex), `TagCloud` (topics capped to top 15 by
  frequency with a show-all toggle), `SearchInput` (debounced), `SortSelect`.
- `components/learning/` -- `PathCard`, `PathSteps` (semantic `<ol>`).
- `components/sections/` -- the six landing-page sections.
- `components/og/og-template.tsx` -- shared `next/og` template consumed by each route's
  `opengraph-image.tsx`.

## Testing

`npm test` runs `node --experimental-strip-types --test` over `scripts/*.test.mjs` and
`lib/*.test.mjs` -- pure-function tests, zero network calls. Covers the fetch/merge/error
semantics in `scripts/fetch-github-data.mjs` and the filter/sort logic in
`lib/filter-projects.ts`.

## Deployment

See [`deployment-guide.md`](./deployment-guide.md).
