<script lang="ts" module>
	import type { HTMLTextareaAttributes } from 'svelte/elements';

	declare module '@sjsf/form' {
		interface UiOptions {
			skeletonTextarea?: HTMLTextareaAttributes;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, textareaAttributes, type ComponentProps } from '@sjsf/form';

	let { value = $bindable(), config, handlers }: ComponentProps['textWidget'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(
		textareaAttributes(ctx, config, handlers, config.uiOptions?.skeletonTextarea)
	);
</script>

<textarea bind:value class="textarea" {...attributes}></textarea>
