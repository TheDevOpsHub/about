import { test } from "node:test";
import assert from "node:assert/strict";
import Fuse from "fuse.js";
import { filterProjects } from "./filter-projects.ts";

function makeProject(overrides) {
  return {
    repo: "repo",
    owner: "TheDevOpsHub",
    title: "Title",
    blurb: "blurb",
    category: "IaC",
    featured: false,
    order: 1,
    tags: [],
    stats: { language: null, stars: 0, forks: 0, topics: [], pushedAt: "2024-01-01T00:00:00Z" },
    ...overrides,
  };
}

function makeFuse(projects) {
  return new Fuse(projects, {
    keys: ["title", "blurb", "tags"],
    threshold: 0.3,
  });
}

test("no query, no filters returns everything, order preserved", () => {
  const projects = [
    makeProject({ repo: "a", title: "Alpha" }),
    makeProject({ repo: "b", title: "Beta" }),
  ];
  const result = filterProjects({
    projects,
    query: "",
    category: "All",
    language: "All",
    topics: [],
    sortBy: "default",
    fuse: makeFuse(projects),
  });
  assert.deepEqual(result.map((p) => p.repo), ["a", "b"]);
});

test("query narrows to matching title", () => {
  const projects = [
    makeProject({ repo: "a", title: "Terraform Toolkit" }),
    makeProject({ repo: "b", title: "Kubernetes Hub" }),
  ];
  const result = filterProjects({
    projects,
    query: "terraform",
    category: "All",
    language: "All",
    topics: [],
    sortBy: "default",
    fuse: makeFuse(projects),
  });
  assert.deepEqual(result.map((p) => p.repo), ["a"]);
});

test("category filter narrows independent of query", () => {
  const projects = [
    makeProject({ repo: "a", category: "IaC" }),
    makeProject({ repo: "b", category: "Containers" }),
  ];
  const result = filterProjects({
    projects,
    query: "",
    category: "Containers",
    language: "All",
    topics: [],
    sortBy: "default",
    fuse: makeFuse(projects),
  });
  assert.deepEqual(result.map((p) => p.repo), ["b"]);
});

test("search and category filters compose (intersection)", () => {
  const projects = [
    makeProject({ repo: "a", title: "Terraform Toolkit", category: "IaC" }),
    makeProject({ repo: "b", title: "Terraform Labs", category: "Trio" }),
  ];
  const result = filterProjects({
    projects,
    query: "terraform",
    category: "IaC",
    language: "All",
    topics: [],
    sortBy: "default",
    fuse: makeFuse(projects),
  });
  assert.deepEqual(result.map((p) => p.repo), ["a"]);
});

test("language filter matches stats.language exactly", () => {
  const projects = [
    makeProject({ repo: "a", stats: { language: "Go", stars: 0, forks: 0 } }),
    makeProject({ repo: "b", stats: { language: "TypeScript", stars: 0, forks: 0 } }),
  ];
  const result = filterProjects({
    projects,
    query: "",
    category: "All",
    language: "Go",
    topics: [],
    sortBy: "default",
    fuse: makeFuse(projects),
  });
  assert.deepEqual(result.map((p) => p.repo), ["a"]);
});

test("impossible combination returns empty array, not an error", () => {
  const projects = [makeProject({ repo: "a", category: "IaC" })];
  const result = filterProjects({
    projects,
    query: "nonexistent-string",
    category: "IaC",
    language: "All",
    topics: [],
    sortBy: "default",
    fuse: makeFuse(projects),
  });
  assert.deepEqual(result, []);
});

test("single topic selected narrows to matching projects", () => {
  const projects = [
    makeProject({ repo: "a", stats: { language: null, stars: 0, forks: 0, topics: ["docker", "iac"] } }),
    makeProject({ repo: "b", stats: { language: null, stars: 0, forks: 0, topics: ["kubernetes"] } }),
  ];
  const result = filterProjects({
    projects,
    query: "",
    category: "All",
    language: "All",
    topics: ["docker"],
    sortBy: "default",
    fuse: makeFuse(projects),
  });
  assert.deepEqual(result.map((p) => p.repo), ["a"]);
});

test("two topics selected is OR (matches either)", () => {
  const projects = [
    makeProject({ repo: "a", stats: { language: null, stars: 0, forks: 0, topics: ["docker"] } }),
    makeProject({ repo: "b", stats: { language: null, stars: 0, forks: 0, topics: ["kubernetes"] } }),
    makeProject({ repo: "c", stats: { language: null, stars: 0, forks: 0, topics: ["terraform"] } }),
  ];
  const result = filterProjects({
    projects,
    query: "",
    category: "All",
    language: "All",
    topics: ["docker", "kubernetes"],
    sortBy: "default",
    fuse: makeFuse(projects),
  });
  assert.deepEqual(result.map((p) => p.repo).sort(), ["a", "b"]);
});

test("topics compose with search and category as AND across dimensions", () => {
  const projects = [
    makeProject({
      repo: "a",
      title: "Terraform Toolkit",
      category: "IaC",
      stats: { language: null, stars: 0, forks: 0, topics: ["docker"] },
    }),
    makeProject({
      repo: "b",
      title: "Terraform Labs",
      category: "Trio",
      stats: { language: null, stars: 0, forks: 0, topics: ["docker"] },
    }),
    makeProject({
      repo: "c",
      title: "Terraform Toolkit Two",
      category: "IaC",
      stats: { language: null, stars: 0, forks: 0, topics: ["kubernetes"] },
    }),
  ];
  const result = filterProjects({
    projects,
    query: "terraform",
    category: "IaC",
    language: "All",
    topics: ["docker"],
    sortBy: "default",
    fuse: makeFuse(projects),
  });
  assert.deepEqual(result.map((p) => p.repo), ["a"]);
});

test("empty topics array is passthrough, changes nothing", () => {
  const projects = [
    makeProject({ repo: "a", stats: { language: null, stars: 0, forks: 0, topics: [] } }),
    makeProject({ repo: "b", stats: { language: null, stars: 0, forks: 0, topics: ["docker"] } }),
  ];
  const result = filterProjects({
    projects,
    query: "",
    category: "All",
    language: "All",
    topics: [],
    sortBy: "default",
    fuse: makeFuse(projects),
  });
  assert.deepEqual(result.map((p) => p.repo).sort(), ["a", "b"]);
});

test("project with no topics is excluded (not crashed) when a topic filter is active", () => {
  const projects = [
    makeProject({ repo: "a", stats: { language: null, stars: 0, forks: 0, topics: [] } }),
    makeProject({ repo: "b", stats: { language: null, stars: 0, forks: 0, topics: ["docker"] } }),
  ];
  const result = filterProjects({
    projects,
    query: "",
    category: "All",
    language: "All",
    topics: ["docker"],
    sortBy: "default",
    fuse: makeFuse(projects),
  });
  assert.deepEqual(result.map((p) => p.repo), ["b"]);
});

test("sortBy default preserves incoming order (curated order already applied upstream)", () => {
  const projects = [
    makeProject({ repo: "b", order: 2 }),
    makeProject({ repo: "a", order: 1 }),
  ];
  const result = filterProjects({
    projects,
    query: "",
    category: "All",
    language: "All",
    topics: [],
    sortBy: "default",
    fuse: makeFuse(projects),
  });
  assert.deepEqual(result.map((p) => p.repo), ["b", "a"]);
});

test("sortBy updated orders by pushedAt, most recent first", () => {
  const projects = [
    makeProject({ repo: "old", stats: { language: null, stars: 0, forks: 0, topics: [], pushedAt: "2022-01-01T00:00:00Z" } }),
    makeProject({ repo: "new", stats: { language: null, stars: 0, forks: 0, topics: [], pushedAt: "2024-06-01T00:00:00Z" } }),
    makeProject({ repo: "mid", stats: { language: null, stars: 0, forks: 0, topics: [], pushedAt: "2023-03-01T00:00:00Z" } }),
  ];
  const result = filterProjects({
    projects,
    query: "",
    category: "All",
    language: "All",
    topics: [],
    sortBy: "updated",
    fuse: makeFuse(projects),
  });
  assert.deepEqual(result.map((p) => p.repo), ["new", "mid", "old"]);
});

test("sortBy stars orders by star count, most stars first", () => {
  const projects = [
    makeProject({ repo: "low", stats: { language: null, stars: 3, forks: 0, topics: [] } }),
    makeProject({ repo: "high", stats: { language: null, stars: 100, forks: 0, topics: [] } }),
    makeProject({ repo: "mid", stats: { language: null, stars: 20, forks: 0, topics: [] } }),
  ];
  const result = filterProjects({
    projects,
    query: "",
    category: "All",
    language: "All",
    topics: [],
    sortBy: "stars",
    fuse: makeFuse(projects),
  });
  assert.deepEqual(result.map((p) => p.repo), ["high", "mid", "low"]);
});

test("sortBy name orders alphabetically by title, case-insensitive", () => {
  const projects = [
    makeProject({ repo: "z", title: "zebra" }),
    makeProject({ repo: "a", title: "Apple" }),
    makeProject({ repo: "m", title: "mango" }),
  ];
  const result = filterProjects({
    projects,
    query: "",
    category: "All",
    language: "All",
    topics: [],
    sortBy: "name",
    fuse: makeFuse(projects),
  });
  assert.deepEqual(result.map((p) => p.repo), ["a", "m", "z"]);
});

test("sort composes with filters: sort applies only to the filtered subset", () => {
  const projects = [
    makeProject({ repo: "a", category: "IaC", stats: { language: null, stars: 5, forks: 0, topics: [] } }),
    makeProject({ repo: "b", category: "Containers", stats: { language: null, stars: 100, forks: 0, topics: [] } }),
    makeProject({ repo: "c", category: "IaC", stats: { language: null, stars: 50, forks: 0, topics: [] } }),
  ];
  const result = filterProjects({
    projects,
    query: "",
    category: "IaC",
    language: "All",
    topics: [],
    sortBy: "stars",
    fuse: makeFuse(projects),
  });
  assert.deepEqual(result.map((p) => p.repo), ["c", "a"]);
});
