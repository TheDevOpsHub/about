import { writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const ORG = "TheDevOpsHub"; // enumerated: fetch everything the org owns, filter to curated
const EXTERNAL_OWNER = "tungbq"; // targeted: fetch curated repos individually by name
const API_BASE = process.env.GITHUB_API_BASE ?? "https://api.github.com";
const OUTPUT_PATH = new URL("../data/github.json", import.meta.url);

// Distinguishes "our curated list references a repo GitHub no longer has"
// (a content bug -- always fails the build, cache or not) from a transient
// API/network failure (which degrades to the committed cache, see main()).
export class MissingCuratedRepoError extends Error {}

function apiHeaders(token) {
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (token) headers.Authorization = `token ${token}`;
  return headers;
}

function parseNextLink(linkHeader) {
  if (!linkHeader) return null;
  for (const part of linkHeader.split(",")) {
    const [, url, rel] = part.match(/<([^>]+)>;\s*rel="([^"]+)"/) ?? [];
    if (rel === "next") return url;
  }
  return null;
}

export async function fetchAll(url, token) {
  const headers = apiHeaders(token);
  const results = [];
  let next = url;
  while (next) {
    const res = await fetch(next, { headers });
    const remaining = res.headers.get("x-ratelimit-remaining");
    if (!res.ok) {
      throw new Error(
        `GitHub API request failed: ${res.status} ${res.statusText} (${next}), x-ratelimit-remaining=${remaining}`
      );
    }
    console.warn(`fetched ${next} (x-ratelimit-remaining=${remaining})`);
    const body = await res.json();
    results.push(...body);
    next = parseNextLink(res.headers.get("link"));
  }
  return results;
}

export async function fetchRepo(owner, name, token) {
  const url = `${API_BASE}/repos/${owner}/${name}`;
  const res = await fetch(url, { headers: apiHeaders(token) });
  const remaining = res.headers.get("x-ratelimit-remaining");
  if (res.status === 404) {
    throw new MissingCuratedRepoError(`${owner}/${name} not found on GitHub (404)`);
  }
  if (!res.ok) {
    throw new Error(
      `GitHub API request failed: ${res.status} ${res.statusText} (${url}), x-ratelimit-remaining=${remaining}`
    );
  }
  console.warn(`fetched ${url} (x-ratelimit-remaining=${remaining})`);
  return res.json();
}

export function trimRepo(raw) {
  return {
    name: raw.name,
    owner: raw.owner.login,
    description: raw.description ?? null,
    stars: raw.stargazers_count ?? 0,
    forks: raw.forks_count ?? 0,
    language: raw.language ?? null,
    topics: raw.topics ?? [],
    htmlUrl: raw.html_url,
    pushedAt: raw.pushed_at,
    archived: raw.archived ?? false,
  };
}

// org repos are the enumerated source; individual (tungbq) repos are the
// targeted source. On a name collision the org wins -- deterministic, not
// expected to matter in practice since the two owners don't share repo names.
export function buildData(orgRepos, individualRepos, curated) {
  const nonForkOrgRepos = orgRepos.filter((r) => !r.fork);
  const trimmedOrg = nonForkOrgRepos.map(trimRepo);
  const trimmedIndividual = individualRepos.map(trimRepo);

  const byLowerName = new Map();
  for (const r of trimmedIndividual) byLowerName.set(r.name.toLowerCase(), r);
  for (const r of trimmedOrg) byLowerName.set(r.name.toLowerCase(), r);

  const repos = {};
  const missing = [];
  for (const project of curated) {
    const stats = byLowerName.get(project.repo.toLowerCase());
    if (!stats) {
      missing.push(`${project.owner}/${project.repo}`);
      continue;
    }
    repos[project.repo] = stats;
  }
  if (missing.length > 0) {
    throw new MissingCuratedRepoError(
      `Curated repos not found on GitHub: ${missing.join(", ")}`
    );
  }

  const sortedRepos = Object.fromEntries(
    Object.keys(repos)
      .sort()
      .map((key) => [key, repos[key]])
  );

  return {
    generatedAt: new Date().toISOString().slice(0, 10),
    orgProfile: {
      login: ORG,
      name: ORG,
      avatarUrl: `https://github.com/${ORG}.png`,
      publicRepos: nonForkOrgRepos.length,
    },
    repos: sortedRepos,
  };
}

export async function main() {
  const token = process.env.GITHUB_TOKEN;
  const { projects: curated } = await import("../content/projects.ts");

  const orgRepos = await fetchAll(
    `${API_BASE}/orgs/${ORG}/repos?per_page=100`,
    token
  );

  const individualRepos = [];
  for (const project of curated) {
    if (project.owner !== EXTERNAL_OWNER) continue;
    individualRepos.push(await fetchRepo(EXTERNAL_OWNER, project.repo, token));
  }

  const data = buildData(orgRepos, individualRepos, curated);
  writeFileSync(OUTPUT_PATH, JSON.stringify(data, null, 2) + "\n");
  console.warn(`wrote ${OUTPUT_PATH.pathname} (${curated.length} curated repos)`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(err.message);
    if (err instanceof MissingCuratedRepoError) {
      // A content bug (renamed/deleted/private repo in content/projects.ts),
      // not a transient API failure -- always fails the build, cache or not.
      process.exit(1);
    }
    if (existsSync(OUTPUT_PATH)) {
      console.warn("keeping existing data/github.json, deploy continues");
      process.exit(0);
    }
    process.exit(1);
  });
}
