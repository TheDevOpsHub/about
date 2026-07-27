import Link from "next/link";
import { ProjectCard } from "@/components/projects/project-card";
import { RevealOnScroll } from "@/components/ui/reveal-on-scroll";
import { getAllProjects, getFeaturedProjects } from "@/lib/projects";

const STAGGER_STEP_MS = 80;
const MAX_FEATURED = 6;

export function FeaturedProjects() {
  const projects = getFeaturedProjects().slice(0, MAX_FEATURED);
  if (projects.length === 0) return null;

  const totalCount = getAllProjects().length;

  return (
    <section aria-labelledby="featured-heading" className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="featured-heading" className="text-2xl font-semibold text-foreground">
          Featured Projects
        </h2>
        <Link
          href="/projects"
          className="whitespace-nowrap text-sm font-medium text-accent transition-colors hover:text-accent-2"
        >
          View all {totalCount} projects &rarr;
        </Link>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <RevealOnScroll key={project.repo} delayMs={index * STAGGER_STEP_MS}>
            <ProjectCard project={project} />
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}
