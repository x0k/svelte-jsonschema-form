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
	import { type ComponentProps, customInputAttributes, getFormContext } from '@sjsf/form';
	let { value = $bindable(), config, handlers }: ComponentProps['ratingWidget'] = $props();

	const ctx = getFormContext();
</script>

<SkeletonRating
	{...customInputAttributes(ctx, config, 'skeleton3Rating', {
		value,
		ids: {
			hiddenInput: config.id
		},
		name: config.id,
		required: config.required,
		readOnly: config.schema.readOnly,
		onHoverChange: handlers.oninput,
		onValueChange: (details) => {
			value = details.value;
			handlers.onchange?.();
		},
		count: config.schema.maximum
	})}
/>
