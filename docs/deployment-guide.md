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

## How the domain is actually served

```
visitor → Cloudflare (TLS terminates here) → GitHub Pages (origin) → out/ from the workflow
```

Two things follow from this, both of which are easy to get wrong:

1. **Pages source is already `GitHub Actions`** (`build_type: workflow`). There is no
   branch-based fallback in play. **Any merge to `main` deploys straight to the live
   domain** -- there is no staging step and no intermediate gate. Treat a merge as a
   production release.
2. **GitHub's *Enforce HTTPS* checkbox cannot be used here.** DNS points at Cloudflare, not
   at GitHub's IPs, so GitHub never provisions a certificate for the domain and the setting
   fails with `The certificate does not exist yet`. The HTTP→HTTPS redirect lives in
   **Cloudflare → SSL/TLS → Edge Certificates → Always Use HTTPS**. Also confirm
   **SSL/TLS → Overview** is set to *Full* (or *Full (strict)*), not *Flexible* -- Flexible
   leaves the Cloudflare→origin hop unencrypted while still showing visitors a padlock.

You can check the current state with:

```bash
gh api repos/TheDevOpsHub/about/pages --jq '{build_type, cname, https_enforced}'
```

## Verifying a release

After any merge to `main`, verify against the live domain:

- `https://thedevopshub.org/` and all four routes (`/`, `/projects/`, `/learning-paths/`,
  `/about/`) load over HTTPS with no mixed content
- `_next/` static assets return 200
- Google Analytics (`G-42PBMZ1BRC`) registers a pageview
- Both DAST verification metas (`insight-app-sec-validation`,
  `probely-verification` x2) are present in the served HTML

Quick pass:

```bash
for r in "" projects/ learning-paths/ about/ sitemap.xml robots.txt; do
  echo "$(curl -s -o /dev/null -w '%{http_code}' https://thedevopshub.org/$r)  /$r"
done
curl -s https://thedevopshub.org/ | grep -cE 'probely-verification|insight-app-sec|G-42PBMZ1BRC'
```

`index.html` and the root `CNAME` are still in the tree as a content fallback. They are
harmless (the workflow serves `out/`, not the repo root) and can be deleted whenever there
is confidence in the new site. `public/CNAME` ships in every build, so the custom domain
does not depend on the root copy.

## Rollback

Because Pages deploys from the workflow, rollback is a git operation, **not** a settings
flip:

```bash
git revert -m 1 <merge-commit>   # or: git revert <squash-commit>
git push origin main             # workflow redeploys the previous out/
```

Expect roughly a minute for the workflow, plus Cloudflare's edge cache (`max-age=600`) to
turn over -- purge the Cloudflare cache if the old content needs to appear immediately.

Reverting to the pre-Next.js page specifically means reverting the PR #14 squash commit,
which restores `index.html` as the site root.
