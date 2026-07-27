---
phase: 5
title: "Projects Explorer Route"
status: complete (visual sign-off pending -- see plan.md validation log)
priority: P1
effort: "5h"
dependencies: [3]
---

# Phase 5: Projects Explorer Route

## Overview

The `/projects` route — the full catalog of all 20 repos with search, category/language/topic filters, and sorting. This is where someone who knows what they want actually finds it, and the main reason the site beats reading the README.

## Requirements

**Functional**
- Fuzzy search across title, blurb, repo name, topics (`fuse.js`)
- Filter by category, language, topic; combined filters are AND across dimensions
- Sort by stars, recently pushed, or curated order
- Live result count and a real empty state with a clear-filters action
- Full list renders in the static HTML before hydration

**Non-functional**
- Filtering logic is a pure function unit-tested independently of the UI (`lib/filter-projects.ts`, Phase 2)
- Search input debounced; result region announced to screen readers
- Zero layout shift when results change

## Architecture

```
app/projects/page.tsx              server: reads lib/projects.ts, renders full list
└─ ProjectsExplorer (client)       state: query, category, language, topic, sort
   ├─ SearchInput                  debounced, type="search", labelled
   ├─ FilterButtonGroup            radiogroup semantics per dimension
   ├─ SortSelect
   ├─ ResultCount                  aria-live="polite"
   └─ ProjectCard[]                shared with Phase 4
```

Server component passes the complete project array down; the client component only filters what it already has. No fetching, no loading states — the unfiltered list is in the HTML, so the page is useful before JS lands and to crawlers.

`ProjectCard`: title, blurb, owner/repo, stars, forks, language dot, topic badges, last-pushed, category. Whole card links to the GitHub repo — build it here if Phase 5 runs before Phase 4, and import it from there in the landing page.

## Related Code Files

- Create: `app/projects/page.tsx`
- Create: `components/projects/projects-explorer.tsx`, `project-card.tsx`, `filter-button-group.tsx`, `search-input.tsx`, `sort-select.tsx`
- Read: `lib/projects.ts`, `lib/filter-projects.ts`
- Extend if needed: `lib/filter-projects.test.mjs` (sort cases)

## Implementation Steps

1. `app/projects/page.tsx` — server component; `getAllProjects()`, `getCategories()`, `getLanguages()`, `getTopics()`; page heading + intro; route `metadata` (title, description, canonical `https://thedevopshub.org/projects/`).
2. `project-card.tsx` — the card described above. Language dot color from a small map; unknown languages fall back to a neutral token.
3. `filter-button-group.tsx` — `role="radiogroup"` with an accessible group label, arrow-key roving tabindex, an "All" option, pressed state visible in both themes (not color-only — use weight/border too).
4. `search-input.tsx` — `type="search"`, visible or `sr-only` label, ~150ms debounce, clear button.
5. `sort-select.tsx` — native `<select>`: stars / recently updated / curated.
6. `projects-explorer.tsx` — holds state, calls the pure `filterProjects()` from Phase 2 plus sorting, renders count in an `aria-live="polite"` region, renders the grid, renders the empty state with "Clear all filters".
7. Verify the unfiltered list is present in `out/projects/index.html` after build.
8. Extend `lib/filter-projects.test.mjs` for sort ordering and combined-filter AND semantics.

## Success Criteria

- [ ] `grep -c 'project-card' out/projects/index.html` returns exactly **20** — the full catalog is in the static HTML
- [ ] Search for "terraform" surfaces TerraformHub, aws-lab-with-terraform, terraform-template
- [ ] Category + language filters combine as AND, count updates correctly
- [ ] Empty state appears for a no-match query and "Clear all filters" restores the full list
- [ ] Result count is announced by a screen reader on change
- [ ] Filter groups fully keyboard-operable (arrow keys within a group, Tab between groups)
- [ ] Filter selection is distinguishable without color
- [ ] `npm test` passes including new sort/filter cases
- [ ] Page works with JS disabled — full list visible, all repo links functional

## Risk Assessment

| Risk | Mitigation |
|---|---|
| Fuse.js bundle weight on a 20-item list | Acceptable (dohsites precedent at 17 items); if it exceeds ~15KB gz, swap to substring matching — the dataset is small enough |
| Filter state lost on back/refresh | Out of scope. URL-synced filter state is a real improvement but YAGNI at 20 repos — revisit if the catalog grows |
| Topic filter explodes into 50+ badges | Cap the topic list to the top N by frequency with a "show all" toggle |
| Two divergent `ProjectCard`s if Phases 4 and 5 are built in parallel | Explicit shared-component note in both phase files; whichever lands first owns it |
