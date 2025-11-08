import { abortPrevious, createTask } from "@sjsf/form/lib/task.svelte";

import { decodeJson } from "$lib/url.js";

import type {
  BuilderContext,
  BuilderState,
} from "../builder/context.svelte.js";
import {
  type CreateProject,
  type Project,
  type ProjectId,
  type ProjectMeta,
} from "./model.js";

export interface ProjectsService<S> {
  validateProjectName(title: string): Promise<boolean>;
  createProject(data: CreateProject<S>): Promise<Project<S>>;
  loadRecentProjects(): Promise<ProjectMeta[]>;
  loadProjectById(projectId: ProjectId): Promise<Project<S>>;
}

export class AppContext {
  #currentProject = $state.raw<Project<BuilderState>>();
  get currentProject() {
    return this.#currentProject;
  }
  loadProject = createTask<[ProjectId], Project<BuilderState>>({
    combinator: abortPrevious,
    execute: (_, projectId) => this.projectsService.loadProjectById(projectId),
    onSuccess: (project) => {
      this.#currentProject = project;
    },
  });

  #recentProjects = $state.raw<ProjectMeta[]>([]);
  get recentProjects() {
    return this.#recentProjects;
  }
  loadRecentProjects = createTask<[], ProjectMeta[]>({
    execute: () => this.projectsService.loadRecentProjects(),
    onSuccess: (projects) => (this.#recentProjects = projects),
  });

  validateProjectName: (title: string) => Promise<boolean>;

  createProject = createTask<[title: string], Project<BuilderState>>({
    execute: (_, title) =>
      this.projectsService.createProject({
        title,
        state: this.builder.exportState(),
      }),
    onSuccess: (project) => {
      this.#currentProject = project;
    },
  });

  constructor(
    private readonly builder: BuilderContext,
    private readonly projectsService: ProjectsService<BuilderState>
  ) {
    this.validateProjectName =
      projectsService.validateProjectName.bind(projectsService);
  }

  private importState(encodedState: string) {
    this.#currentProject = undefined;
    this.builder.importState(decodeJson(encodedState));
  }
}
