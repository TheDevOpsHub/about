"use client";

import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import { filterProjects, type SortBy } from "@/lib/filter-projects";
import { ProjectCard } from "@/components/projects/project-card";
import { FilterButtonGroup } from "@/components/projects/filter-button-group";
import { TagCloud } from "@/components/projects/tag-cloud";
import { SearchInput } from "@/components/projects/search-input";
import { SortSelect } from "@/components/projects/sort-select";
import type { Project } from "@/types/github";

export function ProjectsExplorer({
  projects,
  categories,
  languages,
  topics,
}: {
  projects: Project[];
  categories: string[];
  languages: string[];
  topics: string[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [language, setLanguage] = useState("All");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortBy>("default");

  const fuse = useMemo(
    () =>
      new Fuse(projects, {
        keys: ["title", "blurb", "repo", "tags"],
        threshold: 0.3,
      }),
    [projects]
  );

  const filtered = filterProjects({
    projects,
    query,
    category,
    language,
    topics: selectedTopics,
    sortBy,
    fuse,
  });

  const hasActiveFilter =
    query !== "" || category !== "All" || language !== "All" || selectedTopics.length > 0;

  function toggleTopic(topic: string) {
    setSelectedTopics((current) =>
      current.includes(topic) ? current.filter((t) => t !== topic) : [...current, topic]
    );
  }

  function clearAll() {
    setQuery("");
    setCategory("All");
    setLanguage("All");
    setSelectedTopics([]);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <SearchInput value={query} onChange={setQuery} />

        <FilterButtonGroup
          legend="Filter by category"
          options={categories}
          active={category}
          onChange={setCategory}
        />
        <FilterButtonGroup
          legend="Filter by language"
          options={languages}
          active={language}
          onChange={setLanguage}
        />
        <TagCloud
          legend="Filter by topic"
          options={topics}
          active={selectedTopics}
          onToggle={toggleTopic}
        />

        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
          <p role="status" aria-live="polite">
            {filtered.length} project{filtered.length === 1 ? "" : "s"}
          </p>
          <div className="flex items-center gap-3">
            <SortSelect value={sortBy} onChange={setSortBy} />
            {hasActiveFilter && (
              <button
                type="button"
                onClick={clearAll}
                className="text-accent hover:underline"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-lg border border-border bg-surface p-6 text-center text-sm text-muted">
          No projects match these filters.{" "}
          <button type="button" onClick={clearAll} className="text-accent hover:underline">
            Clear filters
          </button>
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard key={project.repo} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
