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

	import type { ProjectsContext as ProjectsContext } from './context.svelte.js';

	const { ctx }: { ctx: ProjectsContext } = $props();
	const currentProject = $derived(ctx.currentProject)
</script>

{#snippet downButton({ props }: { props: Record<string, unknown> })}
	<Button {...props} size="icon" variant="outline">
		<ChevronDown />
	</Button>
{/snippet}
<ButtonGroup>
	{#if currentProject}
		<Button
			variant="outline"
			disabled={!ctx.isSaveRequired}
			onclick={() => ctx.saveCurrentProject(currentProject)}
		>
			<Save />
			Save
		</Button>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger child={downButton} />
			<DropdownMenu.Content class="w-36" align="end">
				<DropdownMenu.Item onclick={() => ctx.openEditProjectDialog(currentProject)}>
					<Pencil />
					Edit
				</DropdownMenu.Item>
				<DropdownMenu.Item onclick={() => ctx.openForkProjectDialog(currentProject)}>
					<GitFork />
					Fork
				</DropdownMenu.Item>
				<DropdownMenu.Item
					disabled={!ctx.isSaveRequired}
					onclick={() => ctx.openRestoreProjectDialog(currentProject)}
				>
					<RotateCcw />
					Restore
				</DropdownMenu.Item>
				<DropdownMenu.Item onclick={() => ctx.exportCurrentState()}>
					<Download />
					Export
				</DropdownMenu.Item>
				<DropdownMenu.Item onclick={() => ctx.openImportProjectDialog()}>
					<Upload />
					Import
				</DropdownMenu.Item>
				<DropdownMenu.Separator />
				<DropdownMenu.Item
					variant="destructive"
					onclick={() => ctx.openDeleteProjectDialog(currentProject)}
				>
					<Trash />
					Delete
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	{:else}
		<Button variant="outline" onclick={() => ctx.openCreateProjectDialog()}>
			<Save />
			Save
		</Button>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger child={downButton} />
			<DropdownMenu.Content class="w-36" align="end">
				<DropdownMenu.Item onclick={() => ctx.openImportProjectDialog()}>
					<Upload />
					Import
				</DropdownMenu.Item>
				<DropdownMenu.Item onclick={() => ctx.exportCurrentState()}>
					<Download />
					Export
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	{/if}
</ButtonGroup>
