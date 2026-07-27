import { ExternalLink, Mail } from "lucide-react";
import { devOpsHub } from "@/content/devops-hub";

export function ExploreCtaSection() {
  return (
    <section aria-labelledby="cta-heading" className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-16 text-center">
        <h2 id="cta-heading" className="text-2xl font-semibold text-foreground sm:text-3xl">
          Follow along, star a repo, or say hello
        </h2>
        <p className="max-w-xl text-muted">
          New content lands across the org regularly &mdash; follow{" "}
          {devOpsHub.org.name} on GitHub to keep up.
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <a
            href={devOpsHub.org.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-background transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-2 hover:shadow-lg hover:shadow-accent-2/30"
          >
            <ExternalLink aria-hidden="true" className="h-4 w-4" />
            Follow on GitHub
            <span className="sr-only"> (opens in new tab)</span>
          </a>
          <a
            href={devOpsHub.org.repositoriesUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface hover:shadow-md"
          >
            All repositories
            <span className="sr-only"> (opens in new tab)</span>
          </a>
          <a
            href={`mailto:${devOpsHub.contact.email}`}
            className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface hover:shadow-md"
          >
            <Mail aria-hidden="true" className="h-4 w-4" />
            {devOpsHub.contact.email}
          </a>
        </div>
      </div>
    </section>
  );
}
