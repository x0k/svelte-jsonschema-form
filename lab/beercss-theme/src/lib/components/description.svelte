<script lang="ts" module>
	import type { HTMLOutputAttributes } from 'svelte/elements';

	declare module '@sjsf/form' {
		interface UiOptions {
			beercssDescription?: HTMLOutputAttributes;
		}
	}
</script>

<script lang="ts">
	import { descriptionAttributes, getFormContext, type ComponentProps } from '@sjsf/form';

	const { description, config }: ComponentProps['description'] = $props();

	const ctx = getFormContext();
</script>

<output
	{...descriptionAttributes(ctx, config, 'beercssDescription', {
		class: 'small-text description'
	})}
>
	{description}
</output>

<style>
	.description {
		padding: 0.25rem 1rem;
	}
</style>
