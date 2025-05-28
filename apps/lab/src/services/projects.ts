import type { IDBPDatabase } from "idb";

import type { LabDBSchema, ProjectSchema } from "@/shared/index.js";
import {
  createProject,
  ProjectPreset,
  type Project,
  type ProjectFiles,
  type ProjectId,
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

  async importProject(code: string): Promise<Project> {
    throw new Error("`importProject` is not implemented");
  }

  async loadProjectById(projectId: ProjectId): Promise<Project> {
    const tx = this.db.transaction(["projects", "projectFiles"], "readonly");
    const projectRecord = await tx.objectStore("projects").get(projectId);
    if (projectRecord === undefined) {
      throw new Error(`Cannot find project with id: "${projectId}"`);
    }
    const filesIndex = tx.objectStore("projectFiles").index("projectIdIndex");
    const files = Object.fromEntries(
      (await filesIndex.getAll(projectId)).map((f) => [f.filename, f.content])
    );
    return {
      id: projectId,
      title: projectRecord.title,
      createdAt: projectRecord.createdAt,
      updatedAt: projectRecord.updatedAt,
      files,
    };
  }

  protected *saveProjectTx(project: Project): Generator<Promise<any>> {
    const tx = this.db.transaction(["projects", "projectFiles"], "readwrite");
    yield tx.objectStore("projects").put(projectToSchema(project));
    const s = tx.objectStore("projectFiles");
    const now = new Date();
    const projectId = project.id;
    for (const [filename, content] of Object.entries(project.files)) {
      yield s.put(
        {
          projectId,
          filename,
          content,
          createdAt: now,
          updatedAt: now,
        },
        projectFileId(projectId, filename)
      );
    }
    yield tx.done;
  }
}

function projectFileId(projectId: ProjectId, filename: string) {
  return `${projectId}@${filename}`;
}

function projectToSchema(proj: Project): ProjectSchema {
  return {
    id: proj.id,
    title: proj.title,
    createdAt: proj.createdAt,
    updatedAt: proj.updatedAt,
  };
}
