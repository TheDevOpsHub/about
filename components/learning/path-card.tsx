import { Badge } from "@/components/ui/badge";
import { PathSteps } from "@/components/learning/path-steps";
import type { ResolvedPath } from "@/lib/learning-paths";

export function PathCard({ path }: { path: ResolvedPath }) {
  return (
    <article className="flex flex-col gap-5 rounded-xl border border-border bg-surface p-6">
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="text-xl font-semibold text-foreground">{path.title}</h3>
        <Badge>{path.level}</Badge>
        <span className="text-xs text-muted">{path.steps.length} steps</span>
      </div>

      <p className="text-muted">{path.summary}</p>

      <div>
        <h4 className="text-sm font-medium text-foreground">You&apos;ll be able to</h4>
        <ul className="mt-2 flex flex-col gap-1 text-sm text-muted">
          {path.outcomes.map((outcome) => (
            <li key={outcome} className="flex gap-2">
              <span aria-hidden="true">&ndash;</span>
              {outcome}
            </li>
          ))}
        </ul>
      </div>

      <PathSteps steps={path.steps} />
    </article>
  );
}
