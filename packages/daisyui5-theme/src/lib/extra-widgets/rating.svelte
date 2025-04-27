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
	import {
		createPseudoId,
		getFormContext,
		inputAttributes,
		retrieveAttributes,
		type ComponentProps
	} from '@sjsf/form';
	import '@sjsf/form/fields/extra-widgets/rating';

	let { config, handlers, value = $bindable() }: ComponentProps['ratingWidget'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(
		retrieveAttributes(ctx, config, 'daisyui5Rating', inputAttributes(handlers))
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
			id={createPseudoId(config.id, index, ctx)}
		/>
	{/each}
</div>
