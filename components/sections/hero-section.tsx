import Link from "next/link";
import { Stat } from "@/components/ui/stat";
import { devOpsHub } from "@/content/devops-hub";
import { getAggregateStats, getTopics } from "@/lib/projects";

export function HeroSection() {
  const stats = getAggregateStats();
  const topicCount = getTopics().length;

  return (
    <section className="relative overflow-hidden px-6 py-20 sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 flex justify-center"
      >
        <div
          className="h-96 w-[48rem] rounded-full opacity-20 blur-3xl"
          style={{
            background:
              "linear-gradient(135deg, var(--gradient-from), var(--gradient-to))",
          }}
        />
      </div>

      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
          {devOpsHub.tagline}
        </h1>
        <p className="max-w-2xl text-lg text-muted">{devOpsHub.description}</p>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/projects"
            className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-background transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-2 hover:shadow-lg hover:shadow-accent-2/30"
          >
            Explore Projects
          </Link>
          <Link
            href="/learning-paths"
            className="rounded-md border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface hover:shadow-md"
          >
            Learning Paths
          </Link>
        </div>

        <div className="mt-6 flex gap-10">
          <Stat label="Total stars" value={stats.totalStars} />
          <Stat label="Repositories" value={stats.repoCount} />
          <Stat label="Topics" value={topicCount} />
        </div>
      </div>
    </section>
  );
}
