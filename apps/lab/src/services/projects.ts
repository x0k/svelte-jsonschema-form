import type { IDBPDatabase } from "idb";

import type { LabDBSchema } from "@/shared/index.js";
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
    await this.db.put("projects", project);
    return project;
  }
}
