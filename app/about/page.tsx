import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/section-heading";
import { devOpsHub } from "@/content/devops-hub";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About",
  description: "What TheDevOpsHub is, the mission behind it, and how to reach the maintainer.",
  alternates: {
    canonical: `${siteConfig.url}/about/`,
  },
};

export default function AboutPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-14 px-6 py-12">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">About</h1>
        <p className="text-lg text-muted">{devOpsHub.description}</p>
      </div>

      <section aria-labelledby="mission-heading" className="flex flex-col gap-3">
        <SectionHeading eyebrow="Mission" title="Why this exists" />
        <p className="text-muted">{devOpsHub.mission}</p>
        <p className="text-muted">
          Every repo in the Hub is organized for lookup, not for a linear read: docs-first,
          hands-on, and built around the tools that come up most in real work --{" "}
          {devOpsHub.topics.join(", ")}.
        </p>
      </section>

      <section aria-labelledby="inside-heading" className="flex flex-col gap-3">
        <SectionHeading eyebrow="What's inside" title="Two ways to explore" />
        <p className="text-muted">
          <Link href="/projects" className="font-medium text-accent hover:underline">
            Projects
          </Link>{" "}
          is the full catalog, searchable and filterable.{" "}
          <Link href="/learning-paths" className="font-medium text-accent hover:underline">
            Learning Paths
          </Link>{" "}
          turns that catalog into ordered routes for people who want a sequence rather than
          a list.
        </p>
      </section>

      <section aria-labelledby="maintainer-heading" className="flex flex-col gap-3">
        <SectionHeading eyebrow="Maintainer" title={devOpsHub.maintainer.name} />
        <p className="text-muted">
          Maintained by{" "}
          <a
            href={devOpsHub.maintainer.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-accent hover:underline"
          >
            @{devOpsHub.maintainer.handle}
            <span className="sr-only"> (opens in new tab)</span>
          </a>
          . The org itself lives at{" "}
          <a
            href={devOpsHub.org.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-accent hover:underline"
          >
            {devOpsHub.org.url.replace("https://", "")}
            <span className="sr-only"> (opens in new tab)</span>
          </a>
          .
        </p>
      </section>

      <section aria-labelledby="contribute-heading" className="flex flex-col gap-3">
        <SectionHeading eyebrow="Get involved" title="How to contribute" />
        <ul className="flex flex-col gap-2 text-muted">
          <li>
            &ndash; Star a repo on{" "}
            <a
              href={devOpsHub.org.repositoriesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-accent hover:underline"
            >
              the org&apos;s repository list
              <span className="sr-only"> (opens in new tab)</span>
            </a>{" "}
            to help others find it.
          </li>
          <li>&ndash; Open an issue for anything unclear, outdated, or broken.</li>
          <li>&ndash; Send a PR -- fixes, new labs, and additional docs are all welcome.</li>
        </ul>
      </section>

      <section aria-labelledby="contact-heading" className="flex flex-col gap-3">
        <SectionHeading eyebrow="Contact" title="Say hello" />
        <p className="text-muted">
          Reach out at{" "}
          <a
            href={`mailto:${devOpsHub.contact.email}`}
            className="font-medium text-accent hover:underline"
          >
            {devOpsHub.contact.email}
          </a>
          .
        </p>
      </section>
    </div>
  );
}
