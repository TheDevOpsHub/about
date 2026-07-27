import { siteConfig } from "@/lib/site-config";

// Static content only, sourced from siteConfig -- no user or API input
// ever reaches this dangerouslySetInnerHTML.
export function OrganizationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    sameAs: [siteConfig.socials.github, siteConfig.socials.maintainer],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
