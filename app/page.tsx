import { HeroSection } from "@/components/sections/hero-section";
import { EntryPointsSection } from "@/components/sections/entry-points-section";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { TechStackSection } from "@/components/sections/tech-stack-section";
import { ExploreCtaSection } from "@/components/sections/explore-cta-section";
import { RevealOnScroll } from "@/components/ui/reveal-on-scroll";

// title/description/canonical for "/" come from the root layout's default
// metadata (app/layout.tsx) -- redeclaring them here would double up
// against layout's title.template.
export default function Home() {
  return (
    <>
      <HeroSection />
      <RevealOnScroll>
        <EntryPointsSection />
      </RevealOnScroll>
      <FeaturedProjects />
      <RevealOnScroll>
        <TechStackSection />
      </RevealOnScroll>
      <RevealOnScroll>
        <ExploreCtaSection />
      </RevealOnScroll>
    </>
  );
}
