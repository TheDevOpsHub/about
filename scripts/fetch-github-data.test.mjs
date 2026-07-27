import { test } from "node:test";
import assert from "node:assert/strict";
import {
  fetchAll,
  fetchRepo,
  trimRepo,
  buildData,
  MissingCuratedRepoError,
} from "./fetch-github-data.mjs";

function fakeRepo(overrides = {}) {
  return {
    name: "example",
    owner: { login: "TheDevOpsHub" },
    fork: false,
    description: "An example repo",
    stargazers_count: 42,
    forks_count: 7,
    language: "TypeScript",
    topics: ["a", "b"],
    html_url: "https://github.com/TheDevOpsHub/example",
    pushed_at: "2026-01-01T00:00:00Z",
    archived: false,
    ...overrides,
  };
}

test("trimRepo drops *_url noise and keeps only the fields we need", () => {
  const raw = {
    ...fakeRepo(),
    url: "https://api.github.com/repos/TheDevOpsHub/example",
    git_url: "git://github.com/TheDevOpsHub/example.git",
    ssh_url: "git@github.com:TheDevOpsHub/example.git",
    contributors_url: "https://api.github.com/repos/TheDevOpsHub/example/contributors",
  };

  const trimmed = trimRepo(raw);

  assert.deepEqual(trimmed, {
    name: "example",
    owner: "TheDevOpsHub",
    description: "An example repo",
    stars: 42,
    forks: 7,
    language: "TypeScript",
    topics: ["a", "b"],
    htmlUrl: "https://github.com/TheDevOpsHub/example",
    pushedAt: "2026-01-01T00:00:00Z",
    archived: false,
  });
  assert.equal("url" in trimmed, false);
});

test("buildData joins curated projects with org + individual repo stats (happy path)", () => {
  const orgRepos = [
    fakeRepo({ name: "AzureHub", stargazers_count: 100, forks_count: 5 }),
    fakeRepo({ name: "unlisted-org-repo", stargazers_count: 3 }),
  ];
  const individualRepos = [
    fakeRepo({ name: "devops-basics", owner: { login: "tungbq" }, stargazers_count: 1800 }),
  ];
  const curated = [
    { repo: "AzureHub", owner: "TheDevOpsHub" },
    { repo: "devops-basics", owner: "tungbq" },
  ];

  const data = buildData(orgRepos, individualRepos, curated);

  assert.equal(data.repos.AzureHub.stars, 100);
  assert.equal(data.repos["devops-basics"].stars, 1800);
  assert.equal(data.repos["devops-basics"].owner, "tungbq");
  assert.equal(data.repos["unlisted-org-repo"], undefined);
  assert.equal(data.orgProfile.publicRepos, 2);
});

test("buildData filters forks out of the org listing", () => {
  const orgRepos = [
    fakeRepo({ name: "kept" }),
    fakeRepo({ name: "forked-repo", fork: true }),
  ];
  const curated = [{ repo: "kept", owner: "TheDevOpsHub" }];

  const data = buildData(orgRepos, [], curated);

  assert.ok(data.repos.kept);
  assert.equal(data.orgProfile.publicRepos, 1);
});

test("buildData joins repo names case-insensitively", () => {
  const orgRepos = [fakeRepo({ name: "AzureHub" })];
  const curated = [{ repo: "azurehub", owner: "TheDevOpsHub" }];

  const data = buildData(orgRepos, [], curated);

  assert.ok(data.repos.azurehub);
});

test("buildData throws MissingCuratedRepoError listing every unmatched curated slug", () => {
  const orgRepos = [fakeRepo({ name: "real-repo" })];
  const curated = [
    { repo: "real-repo", owner: "TheDevOpsHub" },
    { repo: "renamed-repo", owner: "TheDevOpsHub" },
    { repo: "deleted-repo", owner: "tungbq" },
  ];

  assert.throws(
    () => buildData(orgRepos, [], curated),
    (err) =>
      err instanceof MissingCuratedRepoError &&
      /Curated repos not found on GitHub: TheDevOpsHub\/renamed-repo, tungbq\/deleted-repo/.test(
        err.message
      )
  );
});

test("buildData: org repo wins over an individual repo with the same name (tiebreak)", () => {
  const orgRepos = [fakeRepo({ name: "shared-name", stargazers_count: 500 })];
  const individualRepos = [
    fakeRepo({ name: "shared-name", owner: { login: "tungbq" }, stargazers_count: 1 }),
  ];
  const curated = [{ repo: "shared-name", owner: "TheDevOpsHub" }];

  const data = buildData(orgRepos, individualRepos, curated);

  assert.equal(data.repos["shared-name"].stars, 500);
  assert.equal(data.repos["shared-name"].owner, "TheDevOpsHub");
});

test("fetchAll paginates while a Link rel=\"next\" header is present, stops otherwise", async () => {
  const pages = [
    { body: [{ name: "a" }], link: '<https://api.example.com/repos?page=2>; rel="next"' },
    { body: [{ name: "b" }], link: null },
  ];
  let call = 0;
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => {
    const page = pages[call++];
    return {
      ok: true,
      status: 200,
      statusText: "OK",
      headers: {
        get: (name) =>
          name === "link" ? page.link : name === "x-ratelimit-remaining" ? "58" : null,
      },
      json: async () => page.body,
    };
  };

  try {
    const results = await fetchAll("https://api.example.com/repos", undefined);
    assert.deepEqual(results, [{ name: "a" }, { name: "b" }]);
    assert.equal(call, 2);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("fetchAll throws a plain Error with status and rate-limit info on a non-2xx response", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => ({
    ok: false,
    status: 403,
    statusText: "Forbidden",
    headers: { get: (name) => (name === "x-ratelimit-remaining" ? "0" : null) },
    json: async () => ({}),
  });

  try {
    await assert.rejects(
      () => fetchAll("https://api.example.com/repos", undefined),
      (err) => !(err instanceof MissingCuratedRepoError) && /403 Forbidden.*x-ratelimit-remaining=0/.test(err.message)
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("fetchRepo maps a 404 to MissingCuratedRepoError", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => ({
    ok: false,
    status: 404,
    statusText: "Not Found",
    headers: { get: () => null },
    json: async () => ({}),
  });

  try {
    await assert.rejects(
      () => fetchRepo("tungbq", "renamed-repo", undefined),
      (err) => err instanceof MissingCuratedRepoError && /tungbq\/renamed-repo/.test(err.message)
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("fetchRepo throws a plain Error (not MissingCuratedRepoError) on a 5xx response", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => ({
    ok: false,
    status: 502,
    statusText: "Bad Gateway",
    headers: { get: (name) => (name === "x-ratelimit-remaining" ? "10" : null) },
    json: async () => ({}),
  });

  try {
    await assert.rejects(
      () => fetchRepo("tungbq", "flaky-repo", undefined),
      (err) => !(err instanceof MissingCuratedRepoError) && /502 Bad Gateway/.test(err.message)
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("fetchRepo resolves the repo body on success", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => ({
    ok: true,
    status: 200,
    statusText: "OK",
    headers: { get: (name) => (name === "x-ratelimit-remaining" ? "59" : null) },
    json: async () => fakeRepo({ name: "devops-basics", owner: { login: "tungbq" } }),
  });

  try {
    const repo = await fetchRepo("tungbq", "devops-basics", undefined);
    assert.equal(repo.name, "devops-basics");
  } finally {
    globalThis.fetch = originalFetch;
  }
});
