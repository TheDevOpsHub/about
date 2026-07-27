import { devOpsHub } from "@/content/devops-hub";

const SOCIAL_LINKS = [
  { href: devOpsHub.org.url, label: "GitHub" },
  { href: devOpsHub.org.repositoriesUrl, label: "All repositories" },
  { href: devOpsHub.maintainer.url, label: `Maintainer @${devOpsHub.maintainer.handle}` },
  { href: `mailto:${devOpsHub.contact.email}`, label: devOpsHub.contact.email },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          &copy; {new Date().getFullYear()} {devOpsHub.org.name}. Maintained by{" "}
          {devOpsHub.maintainer.name}. Project data refreshed daily from GitHub.
        </p>
        <nav aria-label="Hub links" className="flex flex-wrap gap-x-4 gap-y-2">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target={link.href.startsWith("mailto:") ? undefined : "_blank"}
              rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
              className="transition-colors hover:text-foreground"
            >
              {link.label}
              {!link.href.startsWith("mailto:") && <span className="sr-only"> (opens in new tab)</span>}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
