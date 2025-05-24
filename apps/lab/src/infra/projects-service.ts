import type { IDBPDatabase } from "idb";

import type { LabDBSchema } from "@/shared/index.js";
import {
  blankPreset,
  createProject,
  ProjectPreset,
  type Project,
  type ProjectFiles,
  type ProjectSettings,
} from "@/domain/index.js";

const PRESETS: Record<ProjectPreset, Promise<ProjectFiles>> = {
  [ProjectPreset.Blank]: blankPreset,
  [ProjectPreset.Basic]: Promise.resolve({}),
};

export class ProjectsService {
  constructor(protected readonly db: IDBPDatabase<LabDBSchema>) {}

  async createProject(settings: ProjectSettings): Promise<Project> {
    const project = createProject({
      title: settings.title,
      files: await PRESETS[settings.preset],
    });
    await this.db.put("projects", project);
    return project;
  }
}
