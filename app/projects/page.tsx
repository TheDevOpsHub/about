import type { Metadata } from "next";
import { ProjectsExplorer } from "@/components/projects/projects-explorer";
import {
  getAllProjects,
  getCategories,
  getLanguages,
  getTopicsByFrequency,
} from "@/lib/projects";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Search and filter every project across TheDevOpsHub -- category, language, topic, and live GitHub stats.",
  alternates: {
    canonical: `${siteConfig.url}/projects/`,
  },
};

export default function ProjectsPage() {
  const projects = getAllProjects();
  const categories = getCategories();
  const languages = getLanguages();
  const topics = getTopicsByFrequency();

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">Projects</h1>
        <p className="max-w-2xl text-muted">
          Every repository in the Hub, {projects.length} in all, searchable and filterable
          by category, language, and topic.
        </p>
      </div>

      <div className="mt-8">
        <ProjectsExplorer
          projects={projects}
          categories={categories}
          languages={languages}
          topics={topics}
        />
      </div>
    </div>
  );
}
