export interface TrimmedRepo {
  name: string;
  owner: string;
  description: string | null;
  stars: number;
  forks: number;
  language: string | null;
  topics: string[];
  htmlUrl: string;
  pushedAt: string;
  archived: boolean;
}

export interface OrgProfile {
  login: string;
  name: string | null;
  avatarUrl: string;
  publicRepos: number;
}

export interface GithubData {
  generatedAt: string;
  orgProfile: OrgProfile;
  repos: Record<string, TrimmedRepo>;
}

export type ProjectCategory =
  | "Trio"
  | "Cloud"
  | "Linux"
  | "CI/CD"
  | "IaC"
  | "Containers"
  | "Monitoring"
  | "Cheatsheet"
  | "Books";

export interface CuratedProject {
  repo: string;
  owner: "TheDevOpsHub" | "tungbq";
  title: string;
  blurb: string;
  category: ProjectCategory;
  impact?: string;
  featured: boolean;
  order: number;
  tags: string[];
}

export type Project = CuratedProject & { stats: TrimmedRepo };
