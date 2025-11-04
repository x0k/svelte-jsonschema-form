<script lang="ts" module>
	import type { Component } from 'svelte';
	import type { WidgetCommonProps } from '@sjsf/form/fields/widgets';
	import type { RatingGroupRootProps } from 'bits-ui';

	import type { StarRatingStarProps } from '$lib/components/ui/star-rating/types.js';

	declare module '@sjsf/form' {
		interface ComponentProps {
			shadcnExtrasStarRatingWidget: WidgetCommonProps<number>;
		}
		interface ComponentBindings {
			shadcnExtrasStarRatingWidget: 'value';
		}
		interface UiOptions {
			shadcnExtrasStarRating?: RatingGroupRootProps;
		}
	}

	declare module '@sjsf/shadcn4-theme' {
		interface ThemeComponents {
			StarRatingRoot: Component<RatingGroupRootProps, {}, 'value'>;
			StarRatingStar: Component<StarRatingStarProps>;
		}
	}
</script>

<script lang="ts">
	import { getId, customInputAttributes, getFormContext, type ComponentProps } from '@sjsf/form';
	import { getThemeContext } from '@sjsf/shadcn4-theme';

	let { config, value = $bindable() }: ComponentProps['shadcnExtrasStarRatingWidget'] = $props();

	const ctx = getFormContext();
	const themeCtx = getThemeContext();

	const { StarRatingRoot, StarRatingStar } = $derived(themeCtx.components);

	const id = $derived(getId(ctx, config.path));
</script>

<StarRatingRoot
	bind:value={() => value ?? 0, (v) => (value = v)}
	{...customInputAttributes(ctx, config, 'shadcnExtrasStarRating', {
		id,
		name: id,
		required: config.required,
		readonly: config.schema.readOnly,
		min: config.schema.minimum,
		max: config.schema.maximum
	})}
>
	{#snippet children({ items })}
		{#each items as item (item.index)}
			<StarRatingStar {...item} />
		{/each}
	{/snippet}
</StarRatingRoot>
