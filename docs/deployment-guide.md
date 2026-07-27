# Deployment Guide

## Local development

```bash
npm install
npm run dev
```

`npm run dev` renders from whatever is already in `data/github.json` (committed to the
repo) -- no `GITHUB_TOKEN` needed for day-to-day frontend work.

## Build

```bash
npm run build          # fetches live GitHub data, then next build
npm run build:nofetch  # renders from the committed data/github.json only
```

`npm run build` needs a `GITHUB_TOKEN` env var to avoid the unauthenticated GitHub API rate
limit (60 requests/hour is enough for one run, but not for repeated local builds):

```bash
GITHUB_TOKEN=$(gh auth token) npm run build
```

The token only needs public-repo read access -- the workflow's built-in
`secrets.GITHUB_TOKEN` is sufficient in CI, no PAT required.

## GitHub data refresh

`scripts/fetch-github-data.mjs` fetches the `TheDevOpsHub` org repos (paginated) and the 7
curated `tungbq` repos (individually, by name), merges them against
`content/projects.ts`, and writes `data/github.json`.

- A curated repo that no longer exists on GitHub (renamed, deleted, made private) **fails
  the build** -- `MissingCuratedRepoError`. This is a content bug: fix the `repo`/`owner` in
  `content/projects.ts`.
- A transient failure (network, 5xx, rate limit) falls back to the committed
  `data/github.json` and the build continues with a warning.
- `.github/workflows/deploy.yml` runs the fetch nightly (`schedule`, `0 5 * * *` UTC) and
  commits the refreshed `data/github.json` if it changed.

## Deploy pipeline

`.github/workflows/deploy.yml`:

1. `push` to `main`, the nightly `schedule`, or manual `workflow_dispatch` triggers the
   `build` job.
2. `npm ci && npm run build` (fetches live data, then `next build` with `output: "export"`).
3. The `out/` directory uploads as a Pages artifact.
4. On `schedule` runs only, a refreshed `data/github.json` is committed and pushed back.
5. The `deploy` job publishes the artifact to the `github-pages` environment.

## Cutover to GitHub Actions Pages (one-time)

The repo currently serves `index.html` straight off `main` via Pages' "Deploy from a
branch" mode. Moving to this Next.js build requires **one manual step in repo settings**:

**Settings → Pages → Build and deployment → Source → GitHub Actions**

Until that flip happens, the live domain keeps serving the old `index.html` unchanged --
the Actions workflow can run and deploy to the `github-pages` environment safely before the
switch, since flipping the source is what actually points the domain at it.

After flipping, verify against the live domain before touching anything else:

- `https://thedevopshub.org/` and all four routes (`/`, `/projects/`, `/learning-paths/`,
  `/about/`) load over HTTPS with no mixed content
- `_next/` static assets return 200
- Google Analytics (`G-42PBMZ1BRC`) registers a pageview
- Both DAST verification metas (`insight-app-sec-validation`,
  `probely-verification` x2) are present in the served HTML

Only once all of that passes: delete `index.html`, the root `CNAME`, and the (now empty)
`assets/` directory in a follow-up commit. `public/CNAME` already ships in every build, so
the custom domain survives the deletion.

## Rollback

If the live site breaks after the cutover:

1. **Settings → Pages → Build and deployment → Source → Deploy from a branch** (back to
   `main` / root).
2. The old `index.html` is still in the repo (not deleted until the step above), so the
   domain immediately serves the previous working page again.
3. Re-provisioning HTTPS after a source change can take a few minutes -- expect a short
   window of cert warnings either direction, not a sign of a broken rollback.

Do not delete `index.html` or the root `CNAME` until live verification has passed at least
once; that file is the entire rollback plan.
