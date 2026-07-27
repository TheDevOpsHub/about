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
  // Vendored to public/icons/{file}.svg -- zero third-party requests on the
  // critical path. Sourced from Simple Icons (CC0 1.0, simpleicons.org),
  // except Helm which comes from helm.sh/img/helm.svg (official asset).
  iconPath: string;
  category: TechCategory;
}

export const techStack: TechItem[] = [
  { name: "AWS", iconPath: "/icons/aws.svg", category: "Cloud" },
  { name: "Azure", iconPath: "/icons/azure.svg", category: "Cloud" },
  { name: "Docker", iconPath: "/icons/docker.svg", category: "Containers" },
  { name: "Kubernetes", iconPath: "/icons/kubernetes.svg", category: "Containers" },
  { name: "Helm", iconPath: "/icons/helm.svg", category: "Containers" },
  { name: "Terraform", iconPath: "/icons/terraform.svg", category: "IaC" },
  { name: "Ansible", iconPath: "/icons/ansible.svg", category: "IaC" },
  { name: "Jenkins", iconPath: "/icons/jenkins.svg", category: "CI/CD" },
  { name: "GitLab", iconPath: "/icons/gitlab.svg", category: "CI/CD" },
  { name: "Prometheus", iconPath: "/icons/prometheus.svg", category: "Monitoring" },
  { name: "Elasticsearch", iconPath: "/icons/elasticsearch.svg", category: "Monitoring" },
  { name: "Nginx", iconPath: "/icons/nginx.svg", category: "Networking" },
  { name: "Cloudflare", iconPath: "/icons/cloudflare.svg", category: "Networking" },
  { name: "Bash", iconPath: "/icons/bash.svg", category: "Languages" },
  { name: "Python", iconPath: "/icons/python.svg", category: "Languages" },
  { name: "Git", iconPath: "/icons/git.svg", category: "VCS" },
  { name: "MySQL", iconPath: "/icons/mysql.svg", category: "Databases" },
];
