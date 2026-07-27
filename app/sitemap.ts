import type { MetadataRoute } from "next";
import { navLinks } from "@/lib/nav-links";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return navLinks.map((link) => ({
    url: `${siteConfig.url}${link.href === "/" ? "/" : `${link.href}/`}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: link.href === "/" ? 1 : 0.8,
  }));
}
