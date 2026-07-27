import { Star, GitFork, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/types/github";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="project-card group flex flex-col gap-3 rounded-lg border border-border bg-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent-2/40 hover:shadow-lg hover:shadow-accent-2/10">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-foreground">
          <a
            href={project.stats.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-accent"
          >
            {project.title}
            <span className="sr-only"> (opens in new tab)</span>
          </a>
        </h3>
        <div className="flex items-center gap-1.5">
          {project.featured ? (
            <span
              title="Featured"
              className="inline-flex items-center rounded-full bg-accent-2/10 p-1 text-accent-2"
            >
              <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
              <span className="sr-only">Featured</span>
            </span>
          ) : null}
          <Badge>{project.category}</Badge>
        </div>
      </div>

      <p className="line-clamp-3 text-sm text-muted">{project.blurb}</p>

      {project.impact ? (
        <p className="text-sm font-medium text-accent-2">{project.impact}</p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>

      <div className="mt-auto flex items-center gap-4 border-t border-border pt-3 text-xs text-muted">
        <span className="inline-flex items-center gap-1">
          <Star aria-hidden="true" className="h-3.5 w-3.5" />
          {project.stats.stars}
          <span className="sr-only"> stars</span>
        </span>
        <span className="inline-flex items-center gap-1">
          <GitFork aria-hidden="true" className="h-3.5 w-3.5" />
          {project.stats.forks}
          <span className="sr-only"> forks</span>
        </span>
        {project.stats.language ? <span>{project.stats.language}</span> : null}
        <span className="text-muted/70">{project.owner}</span>
      </div>
    </article>
  );
}
