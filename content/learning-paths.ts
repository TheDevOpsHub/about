export interface LearningStep {
  repo: string;
  why: string;
  optional?: boolean;
}

export type LearningLevel = "Beginner" | "Intermediate";

export interface LearningPath {
  slug: string;
  title: string;
  level: LearningLevel;
  summary: string;
  outcomes: string[];
  steps: LearningStep[];
}

// `repo` must match a repo entry in content/projects.ts exactly --
// lib/learning-paths.ts resolves each step against it and throws at
// build time on an unknown repo, same failure philosophy as
// MissingCuratedRepoError in scripts/fetch-github-data.mjs.
export const learningPaths: LearningPath[] = [
  {
    slug: "devops-foundations",
    title: "DevOps Foundations",
    level: "Beginner",
    summary:
      "Start here. Get the toolchain vocabulary and a first hands-on rep before picking a deeper track.",
    outcomes: [
      "Navigate the core DevOps toolchain (CI/CD, containers, IaC, monitoring) well enough to know what to search for next",
      "Complete a first hands-on exercise instead of only reading docs",
      "Keep a personal shell-command reference going forward",
    ],
    steps: [
      {
        repo: "devops-basics",
        why: "Read the toolchain reference cover to cover once -- it's the map for everything else in the Hub.",
      },
      {
        repo: "devops-practice",
        why: "Work through the short hands-on exercises to turn the reading into muscle memory.",
      },
      {
        repo: "cmd",
        why: "Start your own running list of commands worth not re-Googling, the way this one grew.",
      },
    ],
  },
  {
    slug: "containers-and-kubernetes",
    title: "Containers & Kubernetes",
    level: "Intermediate",
    summary: "Go from a single container to a monitored Kubernetes deployment.",
    outcomes: [
      "Build and troubleshoot containers confidently",
      "Deploy and inspect workloads on Kubernetes",
      "Wire a deployment into an Nginx proxy with monitoring and logging",
      "Run the observability stack that backs it, Prometheus and Grafana",
    ],
    steps: [
      {
        repo: "container-labs",
        why: "Get comfortable with Docker fundamentals before Kubernetes adds its own layer of complexity.",
      },
      {
        repo: "k8sHub",
        why: "Work through real Kubernetes deployment samples pulled from actual troubleshooting sessions.",
      },
      {
        repo: "microservices-deployment",
        why: "Put it together: a multi-service app on k8s behind Nginx, already wired for monitoring and logging.",
      },
      {
        repo: "MonitoringHub",
        why: "Learn the observability concepts -- Prometheus and Grafana -- before running the stack yourself.",
      },
      {
        repo: "prometheus-stack",
        why: "Run the Prometheus monitoring stack locally via Docker Compose, the same stack the deployment above wires in.",
      },
    ],
  },
  {
    slug: "infrastructure-as-code",
    title: "Infrastructure as Code",
    level: "Intermediate",
    summary:
      "Provision infrastructure with Terraform, then layer Ansible on top for configuration management.",
    outcomes: [
      "Write and structure Terraform modules with state management in mind",
      "Stand up real AWS infrastructure from Terraform code",
      "Bootstrap new Terraform projects from a linted, CI-ready template",
      "Automate configuration management with Ansible roles and playbooks",
    ],
    steps: [
      {
        repo: "TerraformHub",
        why: "Build the Terraform vocabulary -- module structure, state, provider patterns -- before writing real infrastructure.",
      },
      {
        repo: "terraform-template",
        why: "See a production-shaped Terraform layout: multi-environment, multi-region, with automated syntax checks.",
      },
      {
        repo: "aws-lab-with-terraform",
        why: "Apply Terraform against real AWS lab scenarios instead of a toy example.",
      },
      {
        repo: "AnsibleHub",
        why: "Bring configuration management into the picture once infrastructure is provisioned.",
      },
      {
        repo: "ansible-template",
        why: "Fork a CI-linted Ansible starter instead of assembling one from scratch.",
      },
    ],
  },
  {
    slug: "cicd-and-cloud",
    title: "CI/CD & Cloud",
    level: "Intermediate",
    summary:
      "Wire up a CI/CD pipeline, then build the AWS and Azure fluency to deploy across both clouds.",
    outcomes: [
      "Configure Jenkins pipelines from working examples instead of blank-page syntax lookups",
      "Practice CI/CD against a realistic multi-cloud project",
      "Navigate core AWS and Azure services confidently",
    ],
    steps: [
      {
        repo: "JenkinsHub",
        why: "Start from working pipeline examples instead of relearning Jenkinsfile syntax from scratch.",
      },
      {
        repo: "devops-project",
        why: "Practice CI/CD against a project that spans AWS, Azure, containers -- not just one cloud in isolation.",
      },
      {
        repo: "AWSHub",
        why: "Build AWS fluency across the services that come up most in day-to-day work.",
      },
      {
        repo: "AzureHub",
        why: "Do the same for Azure, so the path isn't AWS-only.",
      },
      {
        repo: "AZ-104",
        why: "Cap the cloud track with focused AZ-104 exam-objective study.",
        optional: true,
      },
    ],
  },
];
