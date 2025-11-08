import type { IDBPDatabase } from "idb";

import type { AppDBSchema, ProjectSchema } from "../shared/db.js";
import {
  createProject,
  type CreateProject,
  type Project,
  type ProjectId,
  type ProjectMeta,
} from "./model.js";

export class ProjectsService<S> {
  constructor(protected readonly db: IDBPDatabase<AppDBSchema>) {}

  async validateProjectName(title: string) {
    const project = await this.db.getFromIndex('projects', 'titleIndex', title)
    return project === undefined
  }

  async createProject(data: CreateProject<S>): Promise<Project<S>> {
    const project = createProject(data);
    await this.db.put("projects", projectToSchema(project));
    return project;
  }

  async loadRecentProjects(): Promise<ProjectMeta[]> {
    const recent: ProjectMeta[] = [];
    let cursor = await this.db
      .transaction("projects", "readonly")
      .store.index("updatedAtIndex")
      .openCursor(null, "prev");
    while (cursor) {
      const { id, createdAt, title, updatedAt } = cursor.value;
      recent.push({
        id: id as ProjectId,
        title,
        createdAt,
        updatedAt,
      });
      cursor = await cursor.continue();
    }
    return recent;
  }

  async loadProjectById(projectId: ProjectId): Promise<Project<S>> {
    const data = await this.db.get("projects", projectId);
    if (data === undefined) {
      throw new Error(`Cannot find project with id: ${projectId}`);
    }
    return schemaToProject(data)
  }
}

function projectToSchema<S>(project: Project<S>): ProjectSchema {
  return {
    id: project.id,
    title: project.title,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    state: project.state,
  };
}

function schemaToProject<S>(data: ProjectSchema): Project<S> {
  return {
    id: data.id as ProjectId,
    title: data.title,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    state: data.state as S,
  };
}
