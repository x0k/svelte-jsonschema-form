import type { IDBPDatabase } from 'idb';

import type { AppDBSchema, ProjectSchema } from '../shared/db.js';
import {
	createProject,
	type CreateProject,
	type Project,
	type ProjectId,
	type ProjectMeta
} from './model.js';
import type { ProjectsRepository } from './context.svelte.js';

export class IDBProjectsRepository<S> implements ProjectsRepository<S> {
	constructor(protected readonly db: IDBPDatabase<AppDBSchema>) {}

	async validateProjectName(title: string) {
		const project = await this.db.getFromIndex('projects', 'titleIndex', title);
		return project === undefined;
	}

	async createProject(data: CreateProject<S>): Promise<Project<S>> {
		const project = createProject(data);
		await this.db.put('projects', projectToSchema(project));
		return project;
	}

	async loadRecentProjects(): Promise<ProjectMeta[]> {
		const recent: ProjectMeta[] = [];
		let cursor = await this.db
			.transaction('projects', 'readonly')
			.store.index('updatedAtIndex')
			.openCursor(null, 'prev');
		while (cursor) {
			const { id, createdAt, title, updatedAt } = cursor.value;
			recent.push({
				id: id as ProjectId,
				title,
				createdAt,
				updatedAt
			});
			cursor = await cursor.continue();
		}
		return recent;
	}

	async loadProjectById(projectId: ProjectId): Promise<Project<S>> {
		const data = await this.db.get('projects', projectId);
		if (data === undefined) {
			throw new Error(`Cannot find project with id: ${projectId}`);
		}
		return schemaToProject(data);
	}

	async renameProject(projectId: ProjectId, newTitle: string): Promise<void> {
		const tx = this.db.transaction('projects', 'readwrite');
		const project = await tx.objectStore('projects').get(projectId);
		if (project === undefined) {
			throw new Error(`Cannot find project with id: "${projectId}"`);
		}
		project.title = newTitle;
		project.updatedAt = new Date();
		await tx.objectStore('projects').put(project);
		await tx.done;
	}

	async forkProject(projectId: ProjectId, newTitle: string) {
		const tx = this.db.transaction('projects', 'readwrite');
		const oldProject = await tx.objectStore('projects').get(projectId);
		if (oldProject === undefined) {
			throw new Error(`Cannot find project with id: "${projectId}"`);
		}
		const { state } = schemaToProject<S>(oldProject);
		const newProject = createProject({ title: newTitle, state });
		await tx.objectStore('projects').put(projectToSchema(newProject));
		await tx.done;
		return newProject;
	}

	async removeProjectById(projectId: ProjectId) {
		await this.db.delete('projects', projectId);
	}

	async writeProjectState(projectId: ProjectId, state: S) {
		const tx = this.db.transaction('projects', 'readwrite');
		const project = await tx.objectStore('projects').get(projectId);
		if (project === undefined) {
			throw new Error(`Cannot find project with id: "${projectId}"`);
		}
		project.state = state;
		project.updatedAt = new Date();
		await tx.objectStore('projects').put(project);
		await tx.done;
		return schemaToProject<S>(project);
	}

	saveLastUsedProjectId(projectId: ProjectId | undefined) {
		if (projectId) {
			localStorage.setItem('last-used-project-id', projectId);
		} else {
			localStorage.removeItem('last-used-project-id');
		}
	}

	async loadLastUsedProject() {
		const projectId = localStorage.getItem('last-used-project-id');
		return projectId ? this.loadProjectById(projectId as ProjectId) : undefined;
	}
}

function projectToSchema<S>(project: Project<S>): ProjectSchema {
	return {
		id: project.id,
		title: project.title,
		createdAt: project.createdAt,
		updatedAt: project.updatedAt,
		state: project.state
	};
}

function schemaToProject<S>(data: ProjectSchema): Project<S> {
	return {
		id: data.id as ProjectId,
		title: data.title,
		createdAt: data.createdAt,
		updatedAt: data.updatedAt,
		state: data.state as S
	};
}
