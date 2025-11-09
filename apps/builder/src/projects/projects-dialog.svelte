<script lang="ts">
	import type { ClassNameValue } from 'tailwind-merge';
	import GitFork from '@lucide/svelte/icons/git-fork';
	import Trash from '@lucide/svelte/icons/trash-2';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import Download from '@lucide/svelte/icons/download';
	import Folder from '@lucide/svelte/icons/folder-code';
	import Upload from '@lucide/svelte/icons/upload';
	import Plus from '@lucide/svelte/icons/plus';
	import Pencil from '@lucide/svelte/icons/pencil';

	import { ButtonGroup } from '$lib/components/ui/button-group/index.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Item from '$lib/components/ui/item/index.js';
	import * as Empty from '$lib/components/ui/empty/index.js';

	import type { ProjectsContext } from './context.svelte.js';

	const { class: className, ctx }: { class?: ClassNameValue; ctx: ProjectsContext } = $props();

	let open = $state.raw(false);

	function closeDialog() {
		open = false;
	}

	const currentProject = $derived(ctx.currentProject);
</script>

{#snippet buttons()}
	<Button onclick={() => ctx.openCreateProjectDialog()}>
		<Plus />
		Create Project
	</Button>
	<Button variant="outline" onclick={() => ctx.openImportProjectDialog()}>
		<Upload />
		Import Project
	</Button>
{/snippet}
<Dialog.Root
	bind:open
	onOpenChange={(open) => {
		if (open) {
			ctx.loadRecentProjects();
		}
	}}
>
	<Dialog.Trigger class={buttonVariants({ variant: 'ghost', className })}>
		{currentProject?.title ?? 'Projects'}
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px] md:max-w-xl lg:max-w-2xl">
		<Dialog.Header>
			<Dialog.Title>Projects</Dialog.Title>
		</Dialog.Header>
		<div class="py-4">
			<Item.Group>
				{#each ctx.recentProjects as p, i (p.id)}
					{@const isCurrent = p.id === currentProject?.id}
					{#if i !== 0}
						<Item.Separator />
					{/if}
					<Item.Root variant={isCurrent ? 'muted' : 'default'}>
						<Item.Content>
							<Item.Title>{p.title}</Item.Title>
							<Item.Description>
								Updated at {p.updatedAt.toLocaleString()}
							</Item.Description>
						</Item.Content>
						<Item.Actions>
							<ButtonGroup>
								<Button
									variant="outline"
									disabled={isCurrent}
									onclick={() => ctx.openProject(p, closeDialog)}>Open</Button
								>
								<DropdownMenu.Root>
									<DropdownMenu.Trigger>
										{#snippet child({ props })}
											<Button {...props} size="icon" variant="outline">
												<ChevronDown />
											</Button>
										{/snippet}
									</DropdownMenu.Trigger>
									<DropdownMenu.Content class="w-36" align="start">
										<DropdownMenu.Item onclick={() => ctx.openEditProjectDialog(p)}>
											<Pencil />
											Edit
										</DropdownMenu.Item>
										<DropdownMenu.Item onclick={() => ctx.openForkProjectDialog(p, closeDialog)}>
											<GitFork />
											Fork
										</DropdownMenu.Item>
										<DropdownMenu.Item onclick={() => ctx.openExportProjectDialog(p)}>
											<Download />
											Export
										</DropdownMenu.Item>
										<DropdownMenu.Separator />
										<DropdownMenu.Item
											variant="destructive"
											onclick={() => ctx.openDeleteProjectDialog(p)}
										>
											<Trash />
											Delete
										</DropdownMenu.Item>
									</DropdownMenu.Content>
								</DropdownMenu.Root>
							</ButtonGroup>
						</Item.Actions>
					</Item.Root>
				{:else}
					<Empty.Root>
						<Empty.Header>
							<Empty.Media variant="icon">
								<Folder />
							</Empty.Media>
							<Empty.Title>No Projects Yet</Empty.Title>
						</Empty.Header>
						<Empty.Content>
							<div class="flex gap-2">
								{@render buttons()}
							</div>
						</Empty.Content>
					</Empty.Root>
				{/each}
			</Item.Group>
		</div>
		{#if ctx.recentProjects.length > 0}
			<Dialog.Footer>
				{@render buttons()}
			</Dialog.Footer>
		{/if}
	</Dialog.Content>
</Dialog.Root>
