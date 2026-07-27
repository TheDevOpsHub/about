import data from "@/data/github.json";
import { projects as curated } from "@/content/projects";
import type { GithubData, Project, ProjectCategory } from "@/types/github";

const githubData = data as GithubData;

const allProjects: Project[] = curated
  .map((project) => {
    const stats = githubData.repos[project.repo];
    if (!stats) {
      throw new Error(
        `lib/projects.ts: no stats for curated repo "${project.owner}/${project.repo}" in data/github.json -- re-run npm run build`
      );
    }
    return { ...project, stats };
  })
  .sort((a, b) => a.order - b.order);

export function getAllProjects(): Project[] {
  return allProjects;
}

export function getFeaturedProjects(): Project[] {
  return allProjects.filter((p) => p.featured);
}

export function getProjectsByCategory(category: ProjectCategory): Project[] {
  return allProjects.filter((p) => p.category === category);
}

export function getCategories(): ProjectCategory[] {
  return Array.from(new Set(allProjects.map((p) => p.category)));
}

export function getLanguages(): string[] {
  return Array.from(
    new Set(
      allProjects
        .map((p) => p.stats.language)
        .filter((l): l is string => l !== null)
    )
  ).sort();
}

export function getTopics(): string[] {
  return Array.from(new Set(allProjects.flatMap((p) => p.stats.topics))).sort();
}

export function getAggregateStats() {
  return {
    totalStars: allProjects.reduce((sum, p) => sum + p.stats.stars, 0),
    totalForks: allProjects.reduce((sum, p) => sum + p.stats.forks, 0),
    repoCount: allProjects.length,
  };
}
