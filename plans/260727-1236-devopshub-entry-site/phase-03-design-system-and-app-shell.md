---
phase: 3
title: "Design System and App Shell"
status: pending
priority: P1
effort: "5h"
dependencies: [2]
---

# Phase 3: Design System and App Shell

## Overview

The design foundation every route sits on: color tokens, typography scale, dark mode, the multi-page header nav, footer, and shared primitives. "Beautiful and attractive" is decided here — the later phases just arrange these pieces.

Distinct from dohsites: that site is a personal portfolio (blue/emerald, calm, single column). This one is an org **entry point**, so it needs a stronger visual identity and more obvious "go explore →" affordances.

## Requirements

**Functional**
- Class-based dark mode via `next-themes`, no flash on load, persisted, respects `prefers-color-scheme`
- Header nav across all four routes with active-route indication and a working mobile menu
- Footer with org links, maintainer credit, contact
- Skip link to `#main`

**Non-functional**
- Every text/background pairing ≥ 4.5:1 contrast in both themes (verified, not assumed)
- All motion behind `prefers-reduced-motion: no-preference`
- Nav is keyboard-operable; mobile menu traps focus and closes on Escape

## Architecture

### Tokens (`app/globals.css`)

Tailwind v4 `@theme inline` mapping CSS vars, same mechanism as dohsites but its own palette. Base set: `--background`, `--surface`, `--surface-2`, `--foreground`, `--muted`, `--accent`, `--accent-2`, `--border`, plus `--gradient-from`/`--gradient-to` for hero treatment.

Direction: a DevOps/infrastructure feel — deep slate base, a confident primary (indigo/cyan family), a secondary for "hands-on/practice" accents. Pick concrete hex values during implementation and **record the measured contrast ratio next to each token as a comment**, the way dohsites does. Do not ship a value that was not measured.

### Component layout

```
components/
├─ theme-provider.tsx        next-themes wrapper
├─ theme-toggle.tsx          sun/moon, aria-label, no hydration mismatch
├─ layout/
│  ├─ site-header.tsx        logo + nav (/, /projects, /learning-paths, /about) + toggle
│  ├─ main-nav.tsx           desktop links, aria-current on active route
│  ├─ mobile-nav.tsx         disclosure menu, focus trap, Escape to close
│  ├─ site-footer.tsx
│  └─ skip-link.tsx
├─ ui/
│  ├─ badge.tsx              topic/language pills
│  ├─ stat.tsx               big-number + label
│  ├─ card.tsx               shared surface/border/hover treatment
│  ├─ section-heading.tsx    eyebrow + h2 + optional description
│  └─ reveal-on-scroll.tsx   IntersectionObserver fade-up, reduced-motion aware
└─ seo/organization-json-ld.tsx    Organization schema (not Person — this is the org site)
```

Active-route detection uses `usePathname()`, so `main-nav`/`mobile-nav` are client components while `site-header` stays a server component that composes them.

## Related Code Files

- Create: everything under `components/` listed above
- Modify: `app/globals.css` — full token set, focus-visible, reveal keyframes, reduced-motion block
- Modify: `app/layout.tsx` — wrap in `ThemeProvider`, mount `SkipLink`/`SiteHeader`/`SiteFooter`/`OrganizationJsonLd`
- Create: `lib/nav-links.ts` — single source of truth for the four routes, consumed by header, mobile nav, footer, and the sitemap

## Implementation Steps

1. Choose the palette; write tokens for `:root` and `.dark` in `app/globals.css` with measured contrast ratios in comments. Map through `@theme inline`.
2. Add `:focus-visible` outline, smooth scroll behind `prefers-reduced-motion: no-preference`, `fade-up-in` keyframes, and the reduced-motion override block that neutralizes animation and reveals content.
3. `theme-provider.tsx` + `theme-toggle.tsx` (`suppressHydrationWarning` on `<html>`, mounted-guard in the toggle so SSR and client agree).
4. `lib/nav-links.ts` — `[{ href, label, description }]` for `/`, `/projects`, `/learning-paths`, `/about`.
5. `main-nav.tsx` — desktop links, `aria-current="page"` on the active route, underline/indicator treatment.
6. `mobile-nav.tsx` — button + disclosure panel, `aria-expanded`, `aria-controls`, focus moves into the panel on open and back to the trigger on close, Escape closes, body scroll locked while open.
7. `site-header.tsx` — sticky, logo (`public/logo.png` via `next/image`, explicit width/height), nav, theme toggle. Sticky header must not cover anchor targets: add `scroll-margin-top` to headings.
8. `site-footer.tsx` — org GitHub, all-repos link, maintainer `@tungbq`, `info@thedevopshub.org`, license/attribution.
9. `ui/` primitives: `badge`, `stat`, `card`, `section-heading`, `reveal-on-scroll`.
10. `seo/organization-json-ld.tsx` — `Organization` JSON-LD (name, url, logo, sameAs, contact).
11. Wire it all into `app/layout.tsx`; verify both themes at 320px, 768px, 1440px.

## Success Criteria

- [ ] Every token pairing measured ≥ 4.5:1 in both themes, ratio recorded in a CSS comment
- [ ] No theme flash on hard reload in either mode
- [ ] Full keyboard walk of the header: skip link → logo → each nav link → toggle, visible focus throughout
- [ ] Mobile menu: opens/closes via keyboard, Escape closes, focus returns to the trigger
- [ ] `aria-current="page"` correct on all four routes
- [ ] No horizontal scroll at 320px
- [ ] With `prefers-reduced-motion: reduce`, all content is visible and nothing animates
- [ ] `npm run lint` and `npm run build` clean

## Risk Assessment

| Risk | Mitigation |
|---|---|
| Reveal-on-scroll leaves content invisible if the observer never fires (or JS fails) | Reduced-motion block forces `opacity: 1`; verify content is present in the static HTML, so it is a progressive enhancement not a dependency |
| Sticky header hides anchor targets | `scroll-margin-top` on headings, checked per route in Phase 7 |
| "Beautiful" is subjective and unfalsifiable as a criterion | Screenshot both themes at three widths and get user sign-off before Phases 4–6 build on the tokens |
| Palette diverges from dohsites and the two sites look unrelated | Intentional — different scope. Keep the same *structural* language (spacing, radii, card treatment) so they read as siblings |
