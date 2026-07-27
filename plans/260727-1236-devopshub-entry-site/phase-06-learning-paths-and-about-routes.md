---
phase: 6
title: "Learning Paths and About Routes"
status: complete (visual sign-off pending -- see plan.md validation log)
priority: P2
effort: "4h"
dependencies: [3]
---

# Phase 6: Learning Paths and About Routes

## Overview

Two content routes that give the site a reason to be multi-page: `/learning-paths` turns a flat repo list into ordered routes through the material, and `/about` carries the identity, maintainer, and contact content currently buried in the README.

`/learning-paths` is the one genuinely **new** thing this site offers over the GitHub org page. It should get the most thought.

## Requirements

**Functional**
- `/learning-paths`: exactly 4 ordered paths, each a sequence of steps pointing at real repos
- Each step links to an existing curated project — no dead ends, no "coming soon"
- `/about`: what the Hub is, mission, maintainer, how to contribute, contact
- Both routes appear in nav, sitemap, and have their own metadata

**Non-functional**
- Path content is data (`content/learning-paths.ts`), not JSX, so adding a path is a content edit
- Every step's `repo` reference is validated against the curated project list at build time
- Ordered content uses `<ol>`, not styled `<div>`s

## Architecture

```
content/learning-paths.ts     LearningPath[] { slug, title, level, summary, outcomes[], steps[] }
                              step { repo, title, why, optional? }
app/learning-paths/page.tsx   all paths, grouped by level
app/about/page.tsx            static content sections
components/learning/path-card.tsx, path-steps.tsx
lib/learning-paths.ts         selectors + build-time validation of step.repo
```

Steps reference curated projects by `repo`; `lib/learning-paths.ts` resolves each against `lib/projects.ts` and **throws at build time** on an unknown repo. Same failure philosophy as Phase 2's `MissingCuratedRepoError`: broken internal references fail the build rather than shipping a dead link.

### The four paths

<!-- Updated: Validation Session 1 - cut from 6 to 4; thin Observability/Cloud-Cert paths folded in as steps -->

| Path | Level | Spine |
|---|---|---|
| DevOps Foundations | Beginner | devops-basics → devops-practice → cmd |
| Containers & Kubernetes | Intermediate | container-labs → k8sHub → microservices-deployment → prometheus-stack |
| Infrastructure as Code | Intermediate | TerraformHub → terraform-template → aws-lab-with-terraform → AnsibleHub → ansible-template |
| CI/CD & Cloud | Intermediate | JenkinsHub → devops-project → AWSHub / AzureHub → AZ-104 |

Standalone Observability and Cloud Certification paths were cut — 2 and 3 repos respectively read as filler next to the others. Their repos are folded in as steps: `MonitoringHub` and `prometheus-stack` land in Containers & Kubernetes, the cloud/cert repos in CI/CD & Cloud. Every one of the 20 curated repos should still be reachable from either a path or `/projects`; repos with no natural path home (`LinuxHub`, `Books`) live on `/projects` only, which is fine.

Paths are flat lists of steps, not a prerequisite graph. If a real DAG is wanted later that is a separate change — YAGNI here.

## Related Code Files

- Create: `content/learning-paths.ts`, `lib/learning-paths.ts`
- Create: `app/learning-paths/page.tsx`, `app/about/page.tsx`
- Create: `components/learning/path-card.tsx`, `components/learning/path-steps.tsx`
- Read: `lib/projects.ts`, `content/devops-hub.ts`

## Implementation Steps

1. `content/learning-paths.ts` — the four paths above as data. Each step needs a `why` (one line on what that repo teaches at that point), because a bare repo list is what the README already does.
2. `lib/learning-paths.ts` — `getAllPaths()`, `getPathsByLevel()`, and a resolver that joins each step to its `Project` and throws on an unknown `repo`.
3. `path-steps.tsx` — `<ol>` with step number, linked repo title, the `why` line, and live stars from the resolved project. Optional steps marked as such.
4. `path-card.tsx` — title, level badge, summary, outcomes list, step count, estimated scope.
5. `app/learning-paths/page.tsx` — intro explaining what a path is, then paths grouped by level; route metadata + canonical.
6. `app/about/page.tsx` — sections: what TheDevOpsHub is, mission/philosophy, what's inside (links to `/projects`, `/learning-paths`), maintainer `@tungbq` with links, how to contribute (issues/PRs/starring), contact `info@thedevopshub.org`. Route metadata + canonical.
7. Confirm both routes are in `lib/nav-links.ts` (from Phase 3) so nav, footer, and sitemap pick them up automatically.

## Success Criteria

- [ ] `out/learning-paths/index.html` and `out/about/index.html` both build
- [ ] Exactly 4 paths ship, each with ≥3 steps
- [ ] Every step in every path resolves to a curated project; an injected bad `repo` fails the build
- [ ] Every step link returns 200 against GitHub (spot-check via link check in Phase 7)
- [ ] Paths use semantic `<ol>`; step order is conveyed to screen readers without relying on styling
- [ ] Both routes appear in the header nav with correct `aria-current`, and in `sitemap.xml`
- [ ] Contact email and maintainer links match `README.md`
- [ ] No "coming soon" or placeholder content ships

## Risk Assessment

| Risk | Mitigation |
|---|---|
| Learning paths become a repo list with extra styling and add no value | The per-step `why` is mandatory; a step without a reason to exist gets cut |
| Path content goes stale as repos change | Build-time validation catches removed repos; content review is a manual periodic task |
| `/about` duplicates the landing page's "what is this" | Landing = one-sentence positioning + CTAs; `/about` = mission, maintainer, contributing. Different depth, no copy-paste |
| More paths than the repos support | Resolved: cut to the 4 with the strongest repo backing; thin paths' repos folded in as steps |
