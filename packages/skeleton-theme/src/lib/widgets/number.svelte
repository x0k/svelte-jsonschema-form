<script lang="ts" module>
	import type { HTMLInputAttributes } from 'svelte/elements';

	declare module '@sjsf/form' {
		interface UiOptions {
			skeletonNumber?: HTMLInputAttributes;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';

	let { value = $bindable(), config, handlers }: ComponentProps['numberWidget'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(
		inputAttributes(ctx, config, handlers, config.uiOptions?.skeletonNumber)
	);
</script>

<input
	type="number"
	bind:value
	class={attributes.type === 'range' ? 'range grow w-0' : 'input'}
	{...attributes}
/>
