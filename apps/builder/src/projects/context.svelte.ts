import { isSchemaValueDeepEqual, type SchemaValue } from '@sjsf/form/core';
import { toast } from 'svelte-sonner';

import {
	blobOpen,
	blobSave,
	createJSONBlob,
	JSON_FILE_EXTENSION,
	JSON_MIME_TYPE,
	parseJSONBlob
} from '$lib/file.js';
import { decodeJson } from '$lib/url.js';

import type { BuilderContext, BuilderState } from '../builder/context.svelte.js';
import { type CreateProject, type Project, type ProjectId, type ProjectMeta } from './model.js';
import {
	DEFAULT_GENERIC_PROJECT_DIALOG_OPTIONS,
	type GenericProjectDialogOptions
} from './generic-project-dialog.svelte';
import {
	DEFAULT_CONFIRMATION_DIALOG_OPTIONS,
	type ConfirmationDialogOptions
} from './confirmation-dialog.svelte';

export interface ProjectsRepository<S> {
	validateProjectName(title: string): Promise<boolean>;
	createProject(data: CreateProject<S>): Promise<Project<S>>;
	loadRecentProjects(): Promise<ProjectMeta[]>;
	loadProjectById(projectId: ProjectId): Promise<Project<S>>;
	renameProject(projectId: ProjectId, newTitle: string): Promise<void>;
	forkProject(projectId: ProjectId, newTitle: string): Promise<Project<S>>;
	removeProjectById(projectId: ProjectId): Promise<void>;
	writeProjectState(projectId: ProjectId, state: S): Promise<Project<S>>;
	saveLastUsedProjectId(projectId: ProjectId | undefined): void;
	loadLastUsedProject(): Promise<Project<S> | undefined>;
}

export class ProjectsContext {
	readonly #closeGenericDialog = () => {
		this.#genericProjectDialogOptions = undefined;
	};
	readonly #validateProjectName = (_: AbortSignal, title: string) =>
		this.projectsRepository.validateProjectName(title);
	readonly #builderState: BuilderState;
	#genericProjectDialogOptions = $state.raw<GenericProjectDialogOptions>();
	#confirmationDialogOptions = $state.raw<ConfirmationDialogOptions>();

	#recentProjects = $state<ProjectMeta[]>([]);
	#currentProject = $state<Project<BuilderState>>();

	readonly isSaveRequired: boolean;

	constructor(
		private readonly builder: BuilderContext,
		private readonly projectsRepository: ProjectsRepository<BuilderState>
	) {
		this.#builderState = $derived(builder.exportState());
		this.isSaveRequired = $derived(
			!isSchemaValueDeepEqual(
				this.#currentProject?.state as unknown as SchemaValue,
				this.#builderState as unknown as SchemaValue
			)
		);
	}

	get currentProject() {
		return this.#currentProject;
	}

	get recentProjects() {
		return this.#recentProjects;
	}

	get genericProjectDialogOpen() {
		return this.#genericProjectDialogOptions !== undefined;
	}
	set genericProjectDialogOpen(v) {
		this.#genericProjectDialogOptions = v ? DEFAULT_GENERIC_PROJECT_DIALOG_OPTIONS : undefined;
	}

	get genericProjectDialogOptions() {
		return this.#genericProjectDialogOptions ?? DEFAULT_GENERIC_PROJECT_DIALOG_OPTIONS;
	}

	get confirmationDialogOpen() {
		return this.#confirmationDialogOptions !== undefined;
	}
	set confirmationDialogOpen(v) {
		this.#confirmationDialogOptions = v ? DEFAULT_CONFIRMATION_DIALOG_OPTIONS : undefined;
	}

	get confirmationDialogOptions() {
		return this.#confirmationDialogOptions ?? DEFAULT_CONFIRMATION_DIALOG_OPTIONS;
	}

	init(hash: string) {
		if (hash) {
			this.builder.importState(decodeJson(hash));
		} else {
			this.projectsRepository.loadLastUsedProject().then(
				(p) => {
					this.setCurrentProject(p);
				},
				(err) => {
					toast.error(`Failed to load last project`);
					console.error(err);
				}
			);
		}
	}

	loadRecentProjects() {
		this.projectsRepository.loadRecentProjects().then(
			(projects) => {
				this.#recentProjects = projects;
			},
			(err) => {
				toast.error(`Failed to load recent projects`);
				console.error(err);
			}
		);
	}

	openProject(meta: ProjectMeta, onOpen: () => void) {
		const openProject = () => {
			this.projectsRepository.loadProjectById(meta.id).then(
				(proj) => {
					this.setCurrentProject(proj);
					onOpen();
				},
				(err) => {
					toast.error(`Failed to load "${meta.title}" project`);
					console.error(err);
				}
			);
		};
		if (this.isSaveRequired) {
			this.#confirmationDialogOptions = {
				title: 'Open Project Without Saving',
				description: 'You have an unsaved state. Are you sure you want to continue?',
				variant: 'warn',
				onConfirm: openProject
			};
			return;
		}
		openProject();
	}

	openEditProjectDialog(meta: ProjectMeta) {
		this.#genericProjectDialogOptions = {
			title: 'Edit project',
			projectName: meta.title,
			projectAction: (title) => {
				this.projectsRepository.renameProject(meta.id, title).then(
					() => {
						const r = this.#recentProjects.find((p) => meta.id === p.id);
						if (r) {
							r.title = title;
						}
						if (this.#currentProject?.id === meta.id) {
							this.#currentProject.title = title;
						}
						this.#closeGenericDialog();
					},
					(err) => {
						toast.error(`Failed to edit "${meta.title}" project`);
						console.error(err);
					}
				);
			},
			validateProjectName: this.#validateProjectName
		};
	}

	openForkProjectDialog(p: ProjectMeta, onFork?: () => void) {
		const forkProject = () => {
			this.#genericProjectDialogOptions = {
				title: 'Create Fork',
				projectName: p.title,
				validateProjectName: this.#validateProjectName,
				projectAction: (title) => {
					this.projectsRepository.forkProject(p.id, title).then(
						(fork) => {
							this.appendProject(fork);
							onFork?.();
							this.#closeGenericDialog();
						},
						(err) => {
							toast.error(`Failed to fork "${p.title}" project`);
							console.error(err);
						}
					);
				}
			};
		};
		if (this.isSaveRequired) {
			this.#confirmationDialogOptions = {
				title: 'Confirm Fork Without Saving',
				description:
					'You have unsaved changes. If you continue, your current progress will be lost. Do you want to proceed with forking this project anyway?',
				variant: 'warn',
				onConfirm: forkProject
			};
			return;
		}
		forkProject();
	}

	openExportProjectDialog(p: ProjectMeta) {
		const exportProject = async () => {
			try {
				const loaded = await this.projectsRepository.loadProjectById(p.id);
				await blobSave(
					`${p.title}.${JSON_FILE_EXTENSION}`,
					createJSONBlob(JSON.stringify(loaded.state))
				);
			} catch (err) {
				toast.error(`Failed to export "${p.title}" project`);
			}
		};
		if (this.#currentProject?.id === p.id && this.isSaveRequired) {
			this.#confirmationDialogOptions = {
				title: 'Confirm Export Without Latest changes',
				description:
					'You have unsaved changes. If you continue, you current progress will not be exported. Do you want to proceed without saving anyway?',
				onConfirm: exportProject
			};
			return;
		}
		exportProject();
	}

	openDeleteProjectDialog(meta: ProjectMeta) {
		this.#confirmationDialogOptions = {
			title: 'Confirm Deletion',
			description: `Are you sure you want to delete the "${meta.title}" project?`,
			variant: 'destructive',
			onConfirm: () => {
				this.projectsRepository.removeProjectById(meta.id).then(
					() => {
						const idx = this.#recentProjects.findIndex((p) => p.id === meta.id);
						if (idx >= 0) {
							this.#recentProjects.splice(idx, 1);
						}
						if (this.#currentProject?.id === meta.id) {
							this.setCurrentProject(undefined);
						}
					},
					(err) => {
						toast.error(`Failed to delete "${meta.title}" project`);
						console.error(err);
					}
				);
			}
		};
	}

	openRestoreProjectDialog(project: Project<BuilderState>) {
		this.#confirmationDialogOptions = {
			title: 'Restore Last Saved State',
			description:
				'This will replace your current progress with the last saved version. Unsaved changes will be lost. Do you want to continue?',
			variant: 'warn',
			onConfirm: () => {
				// WARN: Snapshot is required
				this.importState($state.snapshot(project.state));
			}
		};
	}

	openCreateProjectDialog() {
		this.#genericProjectDialogOptions = {
			title: 'Create Project',
			projectName: 'New Project',
			projectAction: (title) => {
				this.projectsRepository
					.createProject({
						title,
						state: this.#builderState
					})
					.then(
						(created) => {
							this.appendProject(created);
							this.#closeGenericDialog();
						},
						(err) => {
							toast.error(`Failed to create "${title}" project`);
							console.log(err);
						}
					);
			},
			validateProjectName: this.#validateProjectName
		};
	}

	openImportProjectDialog() {
		const importProject = () => {
			this.#genericProjectDialogOptions = {
				title: 'Import Project',
				projectName: 'Imported Project',
				projectAction: async (title) => {
					try {
						const blob = await blobOpen({
							extensions: [JSON_FILE_EXTENSION],
							mimeTypes: [JSON_MIME_TYPE]
						});
						const state = await parseJSONBlob<BuilderState>(blob);
						const created = await this.projectsRepository.createProject({
							title,
							state
						});
						this.appendProject(created);
						this.#closeGenericDialog();
					} catch (err) {
						toast.error(`Failed to import "${title}" project`);
						console.error(err);
					}
				},
				validateProjectName: this.#validateProjectName
			};
		};
		if (this.isSaveRequired) {
			this.#confirmationDialogOptions = {
				title: 'Confirm Import Without Saving',
				description:
					'You have unsaved changes. If you continue, your current progress will be lost. Do you want to proceed import anyway?',
				variant: 'warn',
				onConfirm: importProject
			};
			return;
		}
		importProject();
	}

	saveCurrentProject(p: ProjectMeta) {
		this.projectsRepository.writeProjectState(p.id, this.#builderState).then(
			(saved) => {
				for (let i = 0; i < this.#recentProjects.length; i++) {
					const p = this.#recentProjects[i];
					if (p.id === saved.id) {
						const { state: _, ...meta } = saved;
						this.#recentProjects[i] = meta;
						break;
					}
				}
				this.#currentProject = saved;
				// NOTE: builder state is already up to date
			},
			(err) => {
				toast.error(`Failed to save "${p.title}" project`);
				console.error(err);
			}
		);
	}

	exportCurrentState() {
		const exportState = () => {
			blobSave(
				`data.${JSON_FILE_EXTENSION}`,
				createJSONBlob(JSON.stringify(this.#builderState))
			).catch((err) => {
				toast.error(`Failed to export current state`);
				console.error(err);
			});
		};
		if (this.isSaveRequired) {
			this.#confirmationDialogOptions = {
				title: 'Export Unsaved State',
				description: 'Are you sure you want to export an unsaved state?',
				onConfirm: exportState
			};
			return;
		}
		exportState();
	}

	private importState(state: BuilderState) {
		this.builder.importState({
			...state,
			livePreview: 'livePreview' in state ? state.livePreview : true
		});
	}

	private setCurrentProject(p: Project<BuilderState> | undefined) {
		this.projectsRepository.saveLastUsedProjectId(p?.id);
		this.#currentProject = p;
		if (p) {
			this.importState(p.state);
		}
	}

	private appendProject(p: Project<BuilderState>) {
		this.#recentProjects.unshift(p);
		this.setCurrentProject(p);
	}
}
