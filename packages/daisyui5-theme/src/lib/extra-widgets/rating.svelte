<script lang="ts" module>
	import type { HTMLInputAttributes } from 'svelte/elements';
	import '@sjsf/form/fields/extra-widgets/rating';

	declare module '@sjsf/form' {
		interface UiOptions {
			daisyui5Rating?: HTMLInputAttributes;
		}
	}
</script>

<script lang="ts">
	import { createPseudoId, getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';
	import '@sjsf/form/fields/extra-widgets/rating';

	let { config, handlers, value = $bindable() }: ComponentProps['ratingWidget'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(
		inputAttributes(ctx, config, handlers, config.uiOptions?.daisyui5Rating)
	);
</script>

<div class="rating">
	{#each { length: config.schema.maximum ?? 5 } as _, index}
		<input
			type="radio"
			class="mask mask-star"
			bind:group={value}
			value={index + 1}
			{...attributes}
			id={createPseudoId(attributes.id, index, ctx)}
		/>
	{/each}
</div>
