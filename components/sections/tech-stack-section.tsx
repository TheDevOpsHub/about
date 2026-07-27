import Image from "next/image";
import { SectionHeading } from "@/components/ui/section-heading";
import { techStack, type TechCategory } from "@/content/tech-stack";

const CATEGORY_ORDER: TechCategory[] = [
  "Cloud",
  "Containers",
  "IaC",
  "CI/CD",
  "Monitoring",
  "Networking",
  "Languages",
  "VCS",
  "Databases",
];

export function TechStackSection() {
  const groups = CATEGORY_ORDER.map((category) => ({
    category,
    items: techStack.filter((item) => item.category === category),
  })).filter((group) => group.items.length > 0);

  return (
    <section aria-labelledby="stack-heading" className="mx-auto max-w-6xl px-6 py-12">
      <SectionHeading
        eyebrow="Toolchain"
        title="Tech Stack"
        description="The tools this Hub builds hands-on content around, grouped by area."
      />
      <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map(({ category, items }) => (
          <div key={category}>
            <h3 className="text-sm font-medium text-muted">{category}</h3>
            <ul className="mt-3 flex flex-wrap gap-3">
              {items.map((item) => (
                <li key={item.name} title={item.name}>
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-white p-2">
                    <Image
                      src={item.iconPath}
                      alt={item.name}
                      width={24}
                      height={24}
                      className="h-6 w-6"
                    />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
