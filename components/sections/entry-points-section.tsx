import Link from "next/link";
import { Compass, GraduationCap, Users, ArrowRight } from "lucide-react";

const ENTRY_POINTS = [
  {
    href: "/projects",
    icon: Compass,
    title: "Explore Projects",
    description: "Search and filter every repo in the Hub, live from GitHub.",
  },
  {
    href: "/learning-paths",
    icon: GraduationCap,
    title: "Learning Paths",
    description: "Guided routes through the toolchain, step by step.",
  },
  {
    href: "/about",
    icon: Users,
    title: "About the Hub",
    description: "Who maintains it, the mission, and how to reach out.",
  },
] as const;

export function EntryPointsSection() {
  return (
    <section aria-labelledby="entry-points-heading" className="mx-auto max-w-6xl px-6 py-12">
      <h2 id="entry-points-heading" className="sr-only">
        Where to go next
      </h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {ENTRY_POINTS.map(({ href, icon: Icon, title, description }) => (
          <Link
            key={href}
            href={href}
            className="group flex flex-col gap-3 rounded-lg border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-lg hover:shadow-accent/10"
          >
            <Icon aria-hidden="true" className="h-6 w-6 text-accent" />
            <span className="flex items-center gap-1.5 text-lg font-semibold text-foreground">
              {title}
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              />
            </span>
            <span className="text-sm text-muted">{description}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
