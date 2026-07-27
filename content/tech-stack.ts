export type TechCategory =
  | "Cloud"
  | "Containers"
  | "IaC"
  | "CI/CD"
  | "Monitoring"
  | "Networking"
  | "Languages"
  | "VCS"
  | "Databases";

export interface TechItem {
  name: string;
  // Source URL today; Phase 4 vendors these into public/icons/ to drop
  // third-party image requests.
  iconUrl: string;
  category: TechCategory;
}

export const techStack: TechItem[] = [
  { name: "AWS", iconUrl: "https://skillicons.dev/icons?i=aws", category: "Cloud" },
  { name: "Azure", iconUrl: "https://skillicons.dev/icons?i=azure", category: "Cloud" },
  { name: "Docker", iconUrl: "https://skillicons.dev/icons?i=docker", category: "Containers" },
  { name: "Kubernetes", iconUrl: "https://skillicons.dev/icons?i=kubernetes", category: "Containers" },
  { name: "Helm", iconUrl: "https://helm.sh/img/helm.svg", category: "Containers" },
  { name: "Terraform", iconUrl: "https://skillicons.dev/icons?i=terraform", category: "IaC" },
  { name: "Ansible", iconUrl: "https://skillicons.dev/icons?i=ansible", category: "IaC" },
  { name: "Jenkins", iconUrl: "https://skillicons.dev/icons?i=jenkins", category: "CI/CD" },
  { name: "GitLab", iconUrl: "https://skillicons.dev/icons?i=gitlab", category: "CI/CD" },
  { name: "Prometheus", iconUrl: "https://skillicons.dev/icons?i=prometheus", category: "Monitoring" },
  { name: "Elasticsearch", iconUrl: "https://skillicons.dev/icons?i=elasticsearch", category: "Monitoring" },
  { name: "Nginx", iconUrl: "https://skillicons.dev/icons?i=nginx", category: "Networking" },
  { name: "Cloudflare", iconUrl: "https://skillicons.dev/icons?i=cloudflare", category: "Networking" },
  { name: "Bash", iconUrl: "https://skillicons.dev/icons?i=bash", category: "Languages" },
  { name: "Python", iconUrl: "https://skillicons.dev/icons?i=py", category: "Languages" },
  { name: "Git", iconUrl: "https://skillicons.dev/icons?i=git", category: "VCS" },
  {
    name: "SQL",
    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/8/87/Sql_data_base_with_logo.png",
    category: "Databases",
  },
];
