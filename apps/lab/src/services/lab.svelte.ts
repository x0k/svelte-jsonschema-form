import { untrack } from "svelte";
import { createSubscriber } from "svelte/reactivity";
import { on } from "svelte/events";
import { abortPrevious, createAction } from "@sjsf/form/lib/action.svelte";
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";

import type {
  Project,
  ProjectId,
  ProjectMeta,
  ProjectSettings,
} from "@/domain/index.js";

export interface ProjectsService {
  importProject(str: string): Promise<Project>;
  loadProjectById(projectId: ProjectId): Promise<Project>;
  loadRecentProjects(): Promise<ProjectMeta[]>;
  createProject(settings: ProjectSettings): Promise<Project>;
}

enum HashKey {
  ProjectId = "pid",
  Import = "import",
  SubPage = "sub",
}

export enum SubPage {
  Create = "create",
}

export class LabService {
  #historyStateSubscribe = createSubscriber((update) =>
    on(window, "popstate", update)
  );

  #currentSubPage = $state.raw<SubPage>();

  #currentProject = $state.raw<Project>();
  #loadProject = createAction({
    combinator: abortPrevious,
    execute: (_, promise: Promise<Project>) => promise,
    onSuccess: (project: Project, _: Promise<Project>) => {
      this.#currentSubPage = undefined;
      this.#currentProject = project;
      historyAction("replaceState", HashKey.ProjectId, project.id);
    },
  });

  #recentProjects = $state.raw<ProjectMeta[]>([]);
  #loadRecentProjects = createAction({
    execute: () => this.projectsService.loadRecentProjects(),
    onSuccess: (projects) => (this.#recentProjects = projects),
  });

  constructor(protected readonly projectsService: ProjectsService) {
    $effect(() => {
      this.#historyStateSubscribe();
      untrack(this.processUrl.bind(this));
    });
  }

  openProject(projectId: ProjectId) {
    this.#loadProject.run(this.projectsService.loadProjectById(projectId));
  }

  createProject(settings: ProjectSettings) {
    this.#loadProject.run(this.projectsService.createProject(settings));
  }

  createImportUrl(code: string) {
    return createUrl(
      "replaceState",
      HashKey.Import,
      compressToEncodedURIComponent(code)
    );
  }

  openSubPage(subPage: SubPage) {
    historyAction("pushState", HashKey.SubPage, subPage);
    this.processUrl();
  }

  closeSubPage() {
    historyAction("pushState", HashKey.SubPage, "");
    this.processUrl();
  }

  get currentSubPage() {
    return this.#currentSubPage;
  }

  get loading() {
    return this.#loadProject.isProcessed || this.#loadRecentProjects.isDelayed;
  }

  get delayed() {
    return this.#loadProject.isDelayed || this.#loadRecentProjects.isDelayed;
  }

  get currentProject() {
    return this.#currentProject;
  }

  get recentProjects() {
    return this.#recentProjects;
  }

  private processUrl() {
    const params = new URLSearchParams(location.hash.substring(1));
    const code = params.get(HashKey.Import);
    if (code !== null) {
      this.#loadProject.run(
        this.projectsService.importProject(
          decompressFromEncodedURIComponent(code)
        )
      );
      return;
    }
    const subPage = params.get(HashKey.SubPage);
    if (subPage !== null) {
      if (this.#currentSubPage !== subPage) {
        this.#currentSubPage = subPage as SubPage;
        if (subPage === SubPage.Create) {
          this.#loadRecentProjects.run();
        }
      }
      return;
    }
    this.#currentSubPage = undefined;
    const projectId = params.get(HashKey.ProjectId);
    if (projectId !== null) {
      if (projectId !== this.currentProject?.id) {
        this.#loadProject.run(
          this.projectsService.loadProjectById(projectId as ProjectId)
        );
      }
      return;
    }
    this.#currentProject = undefined;
    this.openSubPage(SubPage.Create);
  }
}

function historyAction(
  action: "pushState" | "replaceState",
  hashKey: HashKey,
  value: string
) {
  history[action](null, "", createUrl(action, hashKey, value));
}

function createUrl(
  action: "pushState" | "replaceState",
  key: HashKey,
  value: string
) {
  const url = new URL(window.location.href);
  // url.pathname = "";
  const params = new URLSearchParams(
    action === "pushState" ? location.hash.substring(1) : undefined
  );
  if (value) {
    params.set(key, value);
  } else {
    params.delete(key);
  }
  url.hash = params.toString();
  return url;
}
