import { Star } from "lucide-react";
import type { ResolvedStep } from "@/lib/learning-paths";

export function PathSteps({ steps }: { steps: ResolvedStep[] }) {
  return (
    <ol className="flex flex-col gap-4">
      {steps.map((step, index) => (
        <li key={step.repo} className="flex gap-4">
          <span
            aria-hidden="true"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-sm font-semibold text-foreground"
          >
            {index + 1}
          </span>
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={step.project.stats.htmlUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground transition-colors hover:text-accent"
              >
                {step.project.title}
                <span className="sr-only"> (opens in new tab)</span>
              </a>
              {step.optional && (
                <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted">
                  Optional
                </span>
              )}
              <span className="inline-flex items-center gap-1 text-xs text-muted">
                <Star aria-hidden="true" className="h-3 w-3" />
                {step.project.stats.stars}
                <span className="sr-only"> stars</span>
              </span>
            </div>
            <p className="text-sm text-muted">{step.why}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
