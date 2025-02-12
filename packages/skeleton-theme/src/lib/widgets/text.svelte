<script lang="ts" module>
	import type { HTMLInputAttributes } from 'svelte/elements';

	declare module '@sjsf/form' {
		interface UiOptions {
			skeletonText?: HTMLInputAttributes;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';

	let { value = $bindable(), config, handlers }: ComponentProps['textWidget'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(
		inputAttributes(ctx, config, handlers, config.uiOptions?.skeletonText)
	);
</script>

<input type="text" bind:value class="input" {...attributes} />
