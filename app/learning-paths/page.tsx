import type { Metadata } from "next";
import { PathCard } from "@/components/learning/path-card";
import { getPathsByLevel } from "@/lib/learning-paths";
import { siteConfig } from "@/lib/site-config";
import type { LearningLevel } from "@/content/learning-paths";

const LEVELS: LearningLevel[] = ["Beginner", "Intermediate"];

export const metadata: Metadata = {
  title: "Learning Paths",
  description:
    "Guided routes through TheDevOpsHub's repos -- ordered steps instead of a flat project list.",
  alternates: {
    canonical: `${siteConfig.url}/learning-paths/`,
  },
};

export default function LearningPathsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">Learning Paths</h1>
        <p className="max-w-2xl text-muted">
          A path is an ordered sequence of repos, each one building on the last, with a
          reason for every step. Pick the one that matches where you&apos;re starting from.
        </p>
      </div>

      {LEVELS.map((level) => {
        const paths = getPathsByLevel(level);
        if (paths.length === 0) return null;
        return (
          <section key={level} aria-labelledby={`level-${level}`} className="mt-10">
            <h2 id={`level-${level}`} className="text-sm font-medium uppercase tracking-wide text-accent-2">
              {level}
            </h2>
            <div className="mt-4 grid gap-6 lg:grid-cols-2">
              {paths.map((path) => (
                <PathCard key={path.slug} path={path} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
