import type { CuratedProject } from "@/types/github";

// `repo` + `owner` must match GitHub exactly (case-insensitive join in
// scripts/fetch-github-data.mjs). `blurb` is hand-written -- do not copy the
// README one-liner or GitHub description verbatim.
export const projects: CuratedProject[] = [
  {
    repo: "devops-basics",
    owner: "tungbq",
    title: "DevOps Basics",
    blurb:
      "A practical, docs-first reference for the DevOps toolchain covering CI/CD, containers, IaC, and monitoring, organized for day-to-day lookup rather than a linear tutorial.",
    category: "Trio",
    impact: "1.8k+ stars, the entry point most newcomers land on",
    featured: true,
    order: 1,
    tags: ["ci-cd", "docker", "terraform", "kubernetes", "monitoring"],
  },
  {
    repo: "devops-practice",
    owner: "tungbq",
    title: "DevOps Practice",
    blurb:
      "Short, focused hands-on exercises for building DevOps muscle memory across tools, meant to be worked through rather than read.",
    category: "Trio",
    featured: true,
    order: 2,
    tags: ["ci-cd", "learning", "hands-on"],
  },
  {
    repo: "devops-project",
    owner: "tungbq",
    title: "DevOps Project Collection",
    blurb:
      "Self-contained DevOps projects spanning AWS, Azure, containers, and CI/CD, built to practice wiring individual tools into something resembling real infrastructure.",
    category: "Trio",
    featured: true,
    order: 3,
    tags: ["aws", "azure", "cicd", "terraform", "docker"],
  },
  {
    repo: "AzureHub",
    owner: "TheDevOpsHub",
    title: "Azure Hub",
    blurb:
      "A curated collection of Azure documentation and learning resources, organized around the services that come up most in day-to-day cloud work.",
    category: "Cloud",
    featured: true,
    order: 4,
    tags: ["azure", "cloud", "documentation"],
  },
  {
    repo: "AZ-104",
    owner: "TheDevOpsHub",
    title: "AZ-104",
    blurb:
      "Study notes and learning resources structured around the AZ-104 Azure Administrator certification exam objectives.",
    category: "Cloud",
    featured: false,
    order: 5,
    tags: ["azure", "certification", "cloud"],
  },
  {
    repo: "AWSHub",
    owner: "tungbq",
    title: "AWS Hub",
    blurb:
      "A curated set of AWS service notes and learning resources, structured around the topics that come up most when studying for AWS certifications.",
    category: "Cloud",
    featured: false,
    order: 6,
    tags: ["aws", "certification", "cloud", "documentation"],
  },
  {
    repo: "LinuxHub",
    owner: "TheDevOpsHub",
    title: "Linux Hub",
    blurb:
      "Linux practices, tips, and tricks collected from real troubleshooting sessions rather than reproduced from a manual.",
    category: "Linux",
    featured: false,
    order: 7,
    tags: ["linux", "os", "cli"],
  },
  {
    repo: "JenkinsHub",
    owner: "TheDevOpsHub",
    title: "Jenkins Hub",
    blurb:
      "Working Jenkins pipeline examples and configuration patterns kept as a reference for syntax that's easy to forget between projects.",
    category: "CI/CD",
    featured: false,
    order: 8,
    tags: ["jenkins", "ci-cd", "pipeline"],
  },
  {
    repo: "TerraformHub",
    owner: "TheDevOpsHub",
    title: "Terraform Hub",
    blurb:
      "A practical, docs-first reference for Terraform covering module structure, state management, and provider patterns worth reusing.",
    category: "IaC",
    featured: true,
    order: 9,
    tags: ["terraform", "iac"],
  },
  {
    repo: "aws-lab-with-terraform",
    owner: "tungbq",
    title: "AWS Labs with Terraform",
    blurb:
      "Terraform code for common AWS lab scenarios, written to be read and modified rather than run as a black box.",
    category: "IaC",
    featured: false,
    order: 10,
    tags: ["aws", "terraform", "iac"],
  },
  {
    repo: "terraform-template",
    owner: "TheDevOpsHub",
    title: "Terraform Template",
    blurb:
      "A Terraform project template for deploying infrastructure across multiple environments and regions, with a modular structure and automated syntax checks baked in.",
    category: "IaC",
    featured: false,
    order: 11,
    tags: ["terraform", "iac", "template"],
  },
  {
    repo: "AnsibleHub",
    owner: "TheDevOpsHub",
    title: "Ansible Hub",
    blurb:
      "Ansible playbooks, roles, and patterns collected as a reference for automating configuration management tasks.",
    category: "IaC",
    featured: false,
    order: 12,
    tags: ["ansible", "iac", "automation"],
  },
  {
    repo: "ansible-template",
    owner: "TheDevOpsHub",
    title: "Ansible Template",
    blurb:
      "An Ansible template repository with CI, linting, and containerization wired in, meant to be forked rather than built up from scratch.",
    category: "IaC",
    featured: false,
    order: 13,
    tags: ["ansible", "iac", "template", "ci-cd"],
  },
  {
    repo: "microservices-deployment",
    owner: "TheDevOpsHub",
    title: "Microservices Deployment",
    blurb:
      "A sample microservices deployment on Kubernetes with an Nginx proxy, Prometheus monitoring stack, and logging wired together end to end.",
    category: "Containers",
    featured: false,
    order: 14,
    tags: ["kubernetes", "microservices", "nginx", "prometheus"],
  },
  {
    repo: "container-labs",
    owner: "TheDevOpsHub",
    title: "Container Labs",
    blurb:
      "Hands-on container labs covering Docker fundamentals and common troubleshooting scenarios.",
    category: "Containers",
    featured: false,
    order: 15,
    tags: ["docker", "containers", "labs"],
  },
  {
    repo: "k8sHub",
    owner: "tungbq",
    title: "K8s Hub",
    blurb:
      "Kubernetes deployment samples and practices collected from real troubleshooting sessions, kept runnable rather than purely illustrative.",
    category: "Containers",
    featured: true,
    order: 16,
    tags: ["kubernetes", "deployment"],
  },
  {
    repo: "MonitoringHub",
    owner: "TheDevOpsHub",
    title: "Monitoring Hub",
    blurb:
      "A reference for observability tooling built around Prometheus and Grafana, from instrumentation basics to dashboard patterns.",
    category: "Monitoring",
    featured: true,
    order: 17,
    tags: ["prometheus", "grafana", "monitoring", "observability"],
  },
  {
    repo: "prometheus-stack",
    owner: "TheDevOpsHub",
    title: "Prometheus Stack",
    blurb:
      "A Docker Compose setup for the Prometheus monitoring stack, ready to run locally without piecing together the config by hand.",
    category: "Monitoring",
    featured: false,
    order: 18,
    tags: ["prometheus", "docker", "monitoring"],
  },
  {
    repo: "cmd",
    owner: "tungbq",
    title: "cmd",
    blurb:
      "A running bookmark of shell commands reached for often enough to be worth not re-Googling every time.",
    category: "Cheatsheet",
    featured: false,
    order: 19,
    tags: ["cli", "cheatsheet"],
  },
  {
    repo: "Books",
    owner: "TheDevOpsHub",
    title: "Books",
    blurb:
      "A collection of DevOps books worth reading, kept as a shortlist rather than an exhaustive bibliography.",
    category: "Books",
    featured: false,
    order: 20,
    tags: ["books", "learning"],
  },
];
