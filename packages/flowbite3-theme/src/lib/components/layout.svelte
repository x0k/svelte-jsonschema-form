<script lang="ts" module>
	import type { ButtonGroupProps } from 'flowbite-svelte/types';
	import '@sjsf/basic-theme/components/layout.svelte';
	declare module '@sjsf/form' {
		interface UiOptions {
			flowbite3ButtonGroup?: ButtonGroupProps;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, layoutAttributes, uiOptionProps, type ComponentProps } from '@sjsf/form';
	import ButtonGroup from 'flowbite-svelte/ButtonGroup.svelte';

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
</script>

{#if isControls}
	<ButtonGroup {...uiOptionProps('flowbite3ButtonGroup')({ children }, config, ctx)} />
{:else}
	<div
		class={{
			flex: isItem || isField || isColumn,
			'gap-2': isItem || isField,
			'gap-4': isColumn,
			'items-start': isItem,
			grow: isGrowable,
			'flex-col': isField || isColumn,
			'grid [&:has(>:nth-child(2))]:grid-cols-[1fr_1fr_auto] grid-cols-1 grid-rows-[1fr] items-start gap-x-2':
				isObjectProperty
		}}
		{...layoutAttributes(ctx, config, 'layout', 'layouts', type, {})}
	>
		{@render children()}
	</div>
{/if}
