<script lang="ts" module>
	import type { Component } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	import type { ButtonGroupOrientation } from '$lib/components/ui/button-group/button-group.svelte';

	type ButtonGroupProps = HTMLAttributes<HTMLDivElement> & { orientation?: ButtonGroupOrientation };

	declare module '@sjsf/form' {
		interface UiOptions {
			shadcn4ButtonGroup?: ButtonGroupProps;
		}
	}

	declare module '../context.js' {
		interface ThemeComponents {
			ButtonGroup: Component<ButtonGroupProps>;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, layoutAttributes, uiOptionProps, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/layout.svelte';
	import { getThemeContext } from '../context.js';

	const { type, children, config }: ComponentProps['layout'] = $props();

	const isItem = $derived(type === 'array-item' || type === 'field-content');
	const isControls = $derived(type === 'array-item-controls');
	const isGrowable = $derived(
		type === 'array-item-content' ||
			type === 'object-property-key-input' ||
			type === 'object-property-content'
	);
	const isField = $derived(type === 'multi-field' || type === 'field');
	const isColumn = $derived(
		type === 'array-field' ||
			type === 'object-field' ||
			type === 'array-items' ||
			type === 'object-properties'
	);
	const isObjectProperty = $derived(type === 'object-property');

	const ctx = getFormContext();
	const themeCtx = getThemeContext();

	const { ButtonGroup } = $derived(themeCtx.components);
</script>

{#if isControls}
	<ButtonGroup {...uiOptionProps('shadcn4ButtonGroup')({}, config, ctx)}>
		{@render children()}
	</ButtonGroup>
{:else}
	<div
		class={{
			flex: isItem || isField || isColumn,
			'gap-1.5': isItem || isField,
			'gap-4': isColumn,
			'items-start': isItem,
			grow: isGrowable,
			'flex-col': isColumn || isField,
			'grid grid-cols-1 grid-rows-[1fr] items-start gap-x-1.5 [&:has(>:nth-child(2))]:grid-cols-[1fr_1fr_auto]':
				isObjectProperty
		}}
		{...layoutAttributes(ctx, config, 'layout', 'layouts', type, {})}
	>
		{@render children()}
	</div>
{/if}
