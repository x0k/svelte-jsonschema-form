import type { IDBPDatabase } from "idb";

import type { LabDBSchema, ProjectSchema } from "@/shared/index.js";
import {
  createProject,
  ProjectPreset,
  type Project,
  type ProjectFiles,
  type ProjectSettings,
} from "@/domain/index.js";

const PRESETS: Record<ProjectPreset, () => Promise<ProjectFiles>> = {
  [ProjectPreset.Blank]: () =>
    import("@/domain/presets/blank/index.js").then((m) => m.files),
  [ProjectPreset.Basic]: async () => ({}),
};

export class ProjectsService {
  constructor(protected readonly db: IDBPDatabase<LabDBSchema>) {}

  async createProject(settings: ProjectSettings): Promise<Project> {
    const project = createProject({
      title: settings.title,
      files: await PRESETS[settings.preset](),
    });
    await Promise.all(this.saveProjectTx(project));
    return project;
  }

  protected *saveProjectTx(project: Project): Generator<Promise<any>> {
    const tx = this.db.transaction(["projects", "projectFiles"], "readwrite");
    yield tx.objectStore("projects").put(projectToSchema(project));
    const s = tx.objectStore("projectFiles");
    const now = new Date();
    for (const [filename, content] of Object.entries(project.files)) {
      yield s.put(
        {
          projectId: project.id,
          filename,
          content,
          createdAt: now,
          updatedAt: now,
        },
        projectFileId(project, filename)
      );
    }
    yield tx.done;
  }
}

function projectFileId(project: Project, filename: string) {
  return `${project}@${filename}`;
}

function projectToSchema(proj: Project): ProjectSchema {
  return {
    id: proj.id,
    title: proj.title,
    createdAt: proj.createdAt,
    updatedAt: proj.updatedAt,
  };
}
