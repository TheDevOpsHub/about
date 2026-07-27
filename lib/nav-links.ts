export interface NavLink {
  href: string;
  label: string;
  description: string;
}

export const navLinks: NavLink[] = [
  {
    href: "/",
    label: "Home",
    description: "The Hub's mission, featured projects, and toolchain",
  },
  {
    href: "/projects",
    label: "Projects",
    description: "Search and filter every project in the Hub",
  },
  {
    href: "/learning-paths",
    label: "Learning Paths",
    description: "Guided routes through the Hub's repos, step by step",
  },
  {
    href: "/about",
    label: "About",
    description: "Who maintains the Hub and how to reach out",
  },
];
