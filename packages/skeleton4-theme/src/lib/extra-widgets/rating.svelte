<script lang="ts" module>
	import type { RatingGroupRootProps } from '@skeletonlabs/skeleton-svelte';
	import '@sjsf/form/fields/extra-widgets/rating';

	declare module '@sjsf/form' {
		interface UiOptions {
			skeleton4Rating?: RatingGroupRootProps;
		}
	}
</script>

<script lang="ts">
	import { type ComponentProps, customInputAttributes, getFormContext, getId } from '@sjsf/form';
	import { RatingGroup } from '@skeletonlabs/skeleton-svelte';

	let { value = $bindable(), config, handlers }: ComponentProps['ratingWidget'] = $props();

	const ctx = getFormContext();

	const id = $derived(getId(ctx, config.path));
</script>

<RatingGroup
	{...customInputAttributes(ctx, config, 'skeleton4Rating', {
		value,
		ids: {
			hiddenInput: id
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
>
	<RatingGroup.Control>
		<RatingGroup.Context>
			{#snippet children(ratingGroup)}
				{#each ratingGroup().items as index (index)}
					<RatingGroup.Item {index} />
				{/each}
			{/snippet}
		</RatingGroup.Context>
	</RatingGroup.Control>
	<RatingGroup.HiddenInput />
</RatingGroup>
