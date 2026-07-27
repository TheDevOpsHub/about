import { getAllProjects } from "@/lib/projects";
import { learningPaths } from "@/content/learning-paths";
import type { LearningPath, LearningStep, LearningLevel } from "@/content/learning-paths";
import type { Project } from "@/types/github";

export interface ResolvedStep extends LearningStep {
  project: Project;
}

export interface ResolvedPath extends Omit<LearningPath, "steps"> {
  steps: ResolvedStep[];
}

const byRepo = new Map(getAllProjects().map((project) => [project.repo, project]));

function resolvePath(path: LearningPath): ResolvedPath {
  const steps = path.steps.map((step) => {
    const project = byRepo.get(step.repo);
    if (!project) {
      throw new Error(
        `lib/learning-paths.ts: path "${path.slug}" references unknown repo "${step.repo}" -- check content/learning-paths.ts against content/projects.ts`
      );
    }
    return { ...step, project };
  });
  return { ...path, steps };
}

const resolvedPaths: ResolvedPath[] = learningPaths.map(resolvePath);

export function getAllPaths(): ResolvedPath[] {
  return resolvedPaths;
}

export function getPathsByLevel(level: LearningLevel): ResolvedPath[] {
  return resolvedPaths.filter((path) => path.level === level);
}
