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
      this.#currentProject = project;
      location.hash = createHash(HashKey.ProjectId, project.id)
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
    historyAction("pushState", HashKey.ProjectId, projectId)
  }

  createProject(settings: ProjectSettings) {
    this.#loadProject.run(this.projectsService.createProject(settings));
  }

  createImportUrl(code: string) {
    return createUrl(HashKey.Import, compressToEncodedURIComponent(code));
  }

  openSubPage(subPage: SubPage) {
    historyAction("pushState", HashKey.SubPage, subPage);
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
    this.#currentSubPage = undefined;
    this.#currentProject = undefined;
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
    const projectId = params.get(HashKey.ProjectId);
    if (projectId !== null) {
      this.#loadProject.run(
        this.projectsService.loadProjectById(projectId as ProjectId)
      );
      return;
    }
    const subPage = params.get(HashKey.SubPage);
    if (subPage !== null) {
      this.#currentSubPage = subPage as SubPage;
      if (subPage === SubPage.Create) {
        this.#loadRecentProjects.run();
      }
      return;
    }
    historyAction("replaceState", HashKey.SubPage, SubPage.Create);
  }
}

function historyAction(
  action: "pushState" | "replaceState",
  hashKey: HashKey,
  value: string
) {
  history[action](null, "", createUrl(hashKey, value));
}

function createUrl(key: HashKey, value: string) {
  const url = new URL(window.location.href);
  // url.pathname = "";
  url.hash = createHash(key, value);
  return url;
}

function createHash(key: HashKey, value: string) {
  return new URLSearchParams([[key, value]]).toString();
}
