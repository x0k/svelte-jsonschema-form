<script lang="ts" module>
	export interface CodeFile {
		Icon: Component<SVGAttributes<SVGSVGElement>>;
		title: string;
		content: string;
	}
</script>

<script lang="ts">
	import { untrack, type Component } from 'svelte';

	import { Button } from '$lib/components/ui/button/index.js';
	import { CopyButton } from '$lib/components/copy-button/index.js';
	import type { SVGAttributes } from 'svelte/elements';

	interface Props {
		files: CodeFile[];
	}

	const { files }: Props = $props();

	let selectedIndex = $derived(0);
	$effect(() => {
		files.length;
		untrack(() => {
			if (selectedIndex >= files.length) {
				selectedIndex = files.length - 1;
			}
		});
	});
	let selected = $derived(files[selectedIndex]);
</script>

<div>
	{#if selected}
		<div class="sticky top-(--header-height) bg-background">
			<div class="flex gap-2 rounded-t-md border p-2">
				{#each files as file, i (file.title)}
					<Button
						size="sm"
						variant="ghost"
						class={[selectedIndex === i && 'bg-accent text-accent-foreground dark:bg-accent/50']}
						onclick={() => {
							selectedIndex = i;
						}}
					>
						<file.Icon />
						{file.title}</Button
					>
				{/each}
				<CopyButton class="ml-auto" size="sm" variant="ghost" text={() => selected.content} />
			</div>
		</div>
		<div class="rounded-b-md border-x border-b">
			{@html selected.content}
		</div>
	{:else}
		<p class="rounded-md border p-4 text-center text-muted-foreground">No files</p>
	{/if}
</div>
