import { abortPrevious, createTask } from '@sjsf/form/lib/task.svelte';

import { decodeJson } from '$lib/url.js';

import type { BuilderContext, BuilderState } from '../builder/context.svelte.js';
import { type CreateProject, type Project, type ProjectId, type ProjectMeta } from './model.js';
import { toast } from 'svelte-sonner';
import { isSchemaValueDeepEqual, type SchemaValue } from '@sjsf/form/core';

export interface ProjectsRepository<S> {
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
		execute: (_, projectId) => this.projectsRepository.loadProjectById(projectId),
		onSuccess: (project) => {
			this.#currentProject = project;
		}
	});

	#recentProjects = $state.raw<ProjectMeta[]>([]);
	get recentProjects() {
		return this.#recentProjects;
	}
	loadRecentProjects = createTask<[], ProjectMeta[]>({
		execute: () => this.projectsRepository.loadRecentProjects(),
		onSuccess: (projects) => (this.#recentProjects = projects)
	});

	validateProjectName: (title: string) => Promise<boolean>;
	#createProject = createTask<[title: string], Project<BuilderState>>({
		execute: (_, title) =>
			this.projectsRepository.createProject({
				title,
				state: this.builder.exportState()
			}),
		onSuccess: (project) => {
			this.#currentProject = project;
		}
	});

	createProjectDialogOpen = $state(false);
	isSaveRequired: boolean;

	constructor(
		private readonly builder: BuilderContext,
		private readonly projectsRepository: ProjectsRepository<BuilderState>
	) {
		this.validateProjectName = projectsRepository.validateProjectName.bind(projectsRepository);
		this.isSaveRequired = $derived(
			this.currentProject !== undefined &&
				!isSchemaValueDeepEqual(
					this.currentProject as unknown as SchemaValue,
					builder.exportState() as unknown as SchemaValue
				)
		);
	}

	createProject(projectName: string, onCreate: () => void) {
		this.#createProject.runAsync(projectName).then(onCreate, (err) => {
			console.error(err);
			toast.error(`Failed to create "${projectName}" project`);
		});
	}

	private importState(encodedState: string) {
		this.#currentProject = undefined;
		this.builder.importState(decodeJson(encodedState));
	}
}
