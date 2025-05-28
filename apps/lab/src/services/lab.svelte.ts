import { createSubscriber } from "svelte/reactivity";
import { on } from "svelte/events";
import { abortPrevious, createAction } from "@sjsf/form/lib/action.svelte";
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";

import type { Project, ProjectId } from "@/domain/index.js";

export interface ProjectsService {
  importProject(str: string): Promise<Project>;
  loadProjectById(projectId: ProjectId): Promise<Project>;
}

const IMPORT_KEY = "import";
const PROJECT_ID_KEY = "projectId";

type HashKey = typeof IMPORT_KEY | typeof PROJECT_ID_KEY;

export class LabService {
  #currentProject = $state.raw<Project>();
  #loadProject = createAction({
    combinator: abortPrevious,
    execute: (_, promise: Promise<Project>) => promise,
    onSuccess: (
      project: Project,
      _: Promise<Project>,
      updateState: boolean
    ) => {
      this.#currentProject = project;
      if (updateState) {
        history.pushState(null, "", this.createUrl(PROJECT_ID_KEY, project.id));
      }
    },
  });

  #historyStateSubscribe = createSubscriber((update) =>
    on(window, "popstate", update)
  );

  constructor(protected readonly projectsService: ProjectsService) {
    $effect(() => {
      this.#historyStateSubscribe();
      this.processUrl();
    });
  }

  loadProject(promise: Promise<Project>) {
    this.#loadProject.run(promise, true);
  }

  createImportUrl(code: string) {
    return this.createUrl(IMPORT_KEY, compressToEncodedURIComponent(code));
  }

  get processing() {
    return this.#loadProject.isProcessed;
  }

  get currentProject() {
    return this.#currentProject;
  }

  private processUrl() {
    const params = new URLSearchParams(location.hash);
    const code = params.get(IMPORT_KEY);
    if (code !== null) {
      this.#loadProject.run(
        this.projectsService.importProject(
          decompressFromEncodedURIComponent(code)
        ),
        false
      );
      return;
    }
    const projectId = params.get(PROJECT_ID_KEY);
    if (projectId !== null) {
      this.#loadProject.run(
        this.projectsService.loadProjectById(projectId as ProjectId),
        false
      );
      return;
    }
    this.#currentProject = undefined
  }

  private createUrl(key: HashKey, value: string) {
    const url = new URL(window.location.href);
    // url.pathname = "";
    url.hash = new URLSearchParams([[key, value]]).toString();
    return url;
  }
}
