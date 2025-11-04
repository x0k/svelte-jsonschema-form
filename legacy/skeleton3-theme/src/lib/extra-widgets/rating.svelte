<script lang="ts" module>
	import type { ComponentProps as SvelteComponentProps } from 'svelte';
	import { Rating as SkeletonRating } from '@skeletonlabs/skeleton-svelte';
	import '@sjsf/form/fields/extra-widgets/rating';

	declare module '@sjsf/form' {
		interface UiOptions {
			skeleton3Rating?: SvelteComponentProps<typeof SkeletonRating>;
		}
	}
</script>

<script lang="ts">
	import { type ComponentProps, customInputAttributes, getFormContext, getId } from '@sjsf/form';
	let { value = $bindable(), config, handlers }: ComponentProps['ratingWidget'] = $props();

	const ctx = getFormContext();

	const id = $derived(getId(ctx, config.path))
</script>

<SkeletonRating
	{...customInputAttributes(ctx, config, 'skeleton3Rating', {
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
