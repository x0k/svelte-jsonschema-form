<script lang="ts">
	import Save from '@lucide/svelte/icons/save';
	import GitFork from '@lucide/svelte/icons/git-fork';
	import Trash from '@lucide/svelte/icons/trash-2';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import Download from '@lucide/svelte/icons/download';
	import Upload from '@lucide/svelte/icons/upload';
  import Pencil from '@lucide/svelte/icons/pencil';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';

	import { ButtonGroup } from '$lib/components/ui/button-group/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';

	import type { BuilderState } from '../builder/context.svelte.js';
	import type { Project } from './model.js';

	interface ProjectControlsOptions {
		currentProject: Project<BuilderState> | undefined;
		isSaveRequired: boolean
		//
    saveCurrentProject: (project: Project<BuilderState>) => void;
		openEditProjectDialog: (project: Project<BuilderState>) => void;
		openForkProjectDialog: (project: Project<BuilderState>) => void;
		openDeleteProjectDialog: (project: Project<BuilderState>) => void;
		openRestoreProjectDialog: (project: Project<BuilderState>) => void;
		//
		openCreateProjectDialog: () => void;
		openImportProjectDialog: () => void;
		exportBuilderState: () => void
	}

	const {
		currentProject,
		isSaveRequired,
		//
    saveCurrentProject,
		openForkProjectDialog,
		openEditProjectDialog,
		openDeleteProjectDialog,
		openRestoreProjectDialog,
		//
		openCreateProjectDialog,
		openImportProjectDialog,
		exportBuilderState,
	}: ProjectControlsOptions = $props();
</script>

{#snippet downButton({ props }: { props: Record<string, unknown> })}
	<Button {...props} size="icon" variant="outline">
		<ChevronDown />
	</Button>
{/snippet}
<ButtonGroup>
	{#if currentProject}
		<Button variant="outline" disabled={!isSaveRequired} onclick={() => saveCurrentProject(currentProject)}>
			<Save />
			Save
		</Button>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger child={downButton} />
			<DropdownMenu.Content class="w-36" align="end">
				<DropdownMenu.Item onclick={() => openEditProjectDialog(currentProject)}>
					<Pencil />
					Edit
				</DropdownMenu.Item>
				<DropdownMenu.Item onclick={() => openForkProjectDialog(currentProject)}>
					<GitFork />
					Fork
				</DropdownMenu.Item>
				<DropdownMenu.Item disabled={!isSaveRequired} onclick={() => openRestoreProjectDialog(currentProject)}>
					<RotateCcw />
					Restore
				</DropdownMenu.Item>
				<DropdownMenu.Item onclick={exportBuilderState}>
					<Download />
					Export
				</DropdownMenu.Item>
				<DropdownMenu.Item onclick={openImportProjectDialog}>
					<Upload />
					Import
				</DropdownMenu.Item>
				<DropdownMenu.Separator />
				<DropdownMenu.Item variant="destructive" onclick={() => openDeleteProjectDialog(currentProject)} >
					<Trash />
					Delete
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	{:else}
		<Button variant="outline" onclick={openCreateProjectDialog}>
			<Save />
			Save
		</Button>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger child={downButton} />
			<DropdownMenu.Content class="w-36" align="end">
				<DropdownMenu.Item onclick={openImportProjectDialog}>
					<Upload />
					Import
				</DropdownMenu.Item>
				<DropdownMenu.Item onclick={exportBuilderState}>
					<Download />
					Export
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	{/if}
</ButtonGroup>
