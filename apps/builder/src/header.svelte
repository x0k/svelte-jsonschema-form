<script lang="ts">
	import OpenBook from '@lucide/svelte/icons/book-open';
	import Moon from '@lucide/svelte/icons/moon';
	import Sun from '@lucide/svelte/icons/sun';
	import { preventPageReload } from '@sjsf/form/prevent-page-reload.svelte';

	import Github from '$lib/components/github.svelte';
	import { Button } from '$lib/components/ui/button/index.js';

	import type { ProjectsContext } from './projects/context.svelte.js';
	import ProjectsControls from './projects/project-controls.svelte';
	import ProjectsDialog from './projects/projects-dialog.svelte';
	import ConfirmationDialog from './projects/confirmation-dialog.svelte';
	import GenericProjectDialog from './projects/generic-project-dialog.svelte';
	import { themeManager } from './theme.svelte.js';
	
	const { ctx }: { ctx: ProjectsContext } = $props();

	preventPageReload({
		get isChanged() {
			return ctx.isSaveRequired;
		}
	});

	const clearLink = new URL(location.href);
	clearLink.search = '';
	clearLink.hash = '';

  const hash = location.hash.substring(1);
	ctx.init(hash)
</script>

<div class="mx-auto flex items-center gap-2 px-8 py-3">
	<a href={clearLink.toString()} class="text-xl font-bold">Form Builder</a>
	<ProjectsDialog class="mr-auto" {ctx} />
	<ProjectsControls {ctx} />
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
<ConfirmationDialog {...ctx.confirmationDialogOptions} bind:open={ctx.confirmationDialogOpen} />
<GenericProjectDialog
	{...ctx.genericProjectDialogOptions}
	bind:open={ctx.genericProjectDialogOpen}
/>
