<script lang="ts" module>
	import type { ComponentProps as SvelteComponentProps } from 'svelte';
	import { RatingGroup as SkeletonRating } from '@skeletonlabs/skeleton-svelte';
	import '@sjsf/form/fields/extra-widgets/rating';

	declare module '@sjsf/form' {
		interface UiOptions {
			skeleton4Rating?: SvelteComponentProps<typeof SkeletonRating>;
		}
	}
</script>

<script lang="ts">
	import { type ComponentProps, customInputAttributes, getFormContext, createId } from '@sjsf/form';
	let { value = $bindable(), config, handlers }: ComponentProps['ratingWidget'] = $props();

	const ctx = getFormContext();

	const id = $derived(createId(ctx, config.path))
</script>

<SkeletonRating
	{...customInputAttributes(ctx, config, 'skeleton4Rating', {
		value,
		ids: {
			hiddenInput: id,
		},
		name: id,
		required: config.required,
		readOnly: config.schema.readOnly,
		onValueChange: (details) => {
			value = details.value;
			handlers.oninput?.();
			handlers.onchange?.();
		},
		count: config.schema.maximum
	})}
/>
