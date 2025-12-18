<script lang="ts">
	import { on } from 'svelte/events';

	import { getBuilderContext } from '../context.svelte.js';
	import Form from '../preview/form.svelte';

	import Content from './content.svelte';
	import Settings from './settings.svelte';
	import Controls from './controls.svelte';

	const ctx = getBuilderContext();

	let rootElements = $state(new Array<HTMLDivElement | null>(3));
	$effect(() =>
		on(document, 'mousedown', ({ target }) => {
			if (
				target instanceof Node &&
				rootElements.every((el) => el !== target) &&
				rootElements.some((el) => el?.contains(target))
			) {
				return;
			}
			// NOTE: `setTimeout` is required for correct operation of the conditions
			// in `settings.svelte` for the `NodeSettings` component.
			// And i can't explain why
			setTimeout(() => {
				ctx.clearSelection();
			});
		})
	);
</script>

<div
	class={[
		'mx-auto grid gap-6',
		ctx.livePreview ? 'grid-cols-[1fr_3fr_3fr_2fr]' : 'grid-cols-[1fr_6fr_2fr]'
	]}
>
	<div
		bind:this={rootElements[0]}
		class="sticky top-(--header-height) h-[calc(100vh-var(--header-height))] min-w-[120px] overflow-y-auto pb-4 pl-8"
	>
		<Controls />
	</div>

	<div bind:this={rootElements[1]} class="pb-4">
		<Content />
	</div>

	{#if ctx.livePreview}
		<div class="overflow-x-hidden pb-4">
			<Form />
		</div>
	{/if}

	<div
		bind:this={rootElements[2]}
		class="sticky top-(--header-height) h-[calc(100vh-var(--header-height))] min-w-[200px] overflow-y-auto pr-8 pb-4"
	>
		<Settings />
	</div>
</div>
