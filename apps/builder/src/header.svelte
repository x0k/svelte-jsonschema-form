<script lang="ts">
	import OpenBook from '@lucide/svelte/icons/book-open';
	import Moon from '@lucide/svelte/icons/moon';
	import Sun from '@lucide/svelte/icons/sun';
	import { preventPageReload } from '@sjsf/form/prevent-page-reload.svelte';

	import Github from '$lib/components/github.svelte';
	import { Button } from '$lib/components/ui/button/index.js';

	import type { AppContext } from './app/context.svelte.js';
	import ProjectsControls from './app/project-controls.svelte';
	import ProjectsDialog from './app/projects-dialog.svelte';
	import { themeManager } from './theme.svelte.js';
	import ConfirmationDialog from './app/confirmation-dialog.svelte';
	import GenericProjectDialog from './app/generic-project-dialog.svelte';

	const { app }: { app: AppContext } = $props();

	preventPageReload({
		get isChanged() {
			return app.isSaveRequired;
		}
	});

	const clearLink = new URL(location.href);
	clearLink.search = '';
	clearLink.hash = '';
</script>

<div class="mx-auto flex items-center gap-2 px-8 py-3">
	<a href={clearLink.toString()} class="text-xl font-bold">Form Builder</a>
	<ProjectsDialog
		class="mr-auto"
		projects={app.recentProjects}
		currentProject={app.currentProject}
		loadProjects={() => app.loadRecentProjects()}
		openProject={(p, onOpen) => app.openProject(p, onOpen)}
		openEditProjectDialog={(p) => app.openEditProjectDialog(p)}
		openForkProjectDialog={(p, onFork) => app.openForkProjectDialog(p, onFork)}
		openExportProjectDialog={(p) => app.openExportProjectDialog(p)}
		openDeleteProjectDialog={(p) => app.openDeleteProjectDialog(p)}
		openCreateProjectDialog={() => app.openCreateProjectDialog()}
		openImportProjectDialog={() => app.openImportProjectDialog()}
	/>
	<ProjectsControls
		currentProject={app.currentProject}
		isSaveRequired={app.isSaveRequired}
		saveCurrentProject={(p) => app.saveCurrentProject(p)}
		openEditProjectDialog={(p) => app.openEditProjectDialog(p)}
		openForkProjectDialog={(p) => app.openForkProjectDialog(p)}
		openDeleteProjectDialog={(p) => app.openDeleteProjectDialog(p)}
		openRestoreProjectDialog={(p) => app.openRestoreProjectDialog(p)}
		openCreateProjectDialog={() => app.openCreateProjectDialog()}
		openImportProjectDialog={() => app.openImportProjectDialog()}
		exportBuilderState={() => app.exportCurrentState()}
	/>
	<Button variant="ghost" size="icon" href="https://x0k.github.io/svelte-jsonschema-form/">
		<OpenBook class="size-6" />
	</Button>
	<Button
		target="_blank"
		href="https://github.com/x0k/svelte-jsonschema-form/"
		variant="ghost"
		size="icon"
	>
		<Github class="size-6" />
	</Button>
	<Button
		variant="ghost"
		size="icon"
		onclick={() => {
			themeManager.isDark = !themeManager.isDark;
		}}
	>
		{#if themeManager.isDark}
			<Moon class="size-6" />
		{:else}
			<Sun class="size-6" />
		{/if}
	</Button>
</div>
<ConfirmationDialog {...app.confirmationDialogOptions} bind:open={app.confirmationDialogOpen} />
<GenericProjectDialog
	{...app.genericProjectDialogOptions}
	bind:open={app.genericProjectDialogOpen}
/>
