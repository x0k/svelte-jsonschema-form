<script lang="ts">
	import { getFormContext, layoutAttributes, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/layout.svelte';

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

<div
	class={{
		flex: isItem || isControls || isField || isColumn,
		'gap-1.5': isItem || isField || isControls,
		'gap-4': isColumn,
		'items-start': isItem || isControls,
		grow: isGrowable,
		'flex-col': isColumn || isField,
		'grid [&:has(>:nth-child(2))]:grid-cols-[1fr_1fr_auto] grid-cols-1 grid-rows-[1fr] items-end gap-x-1.5 [&>:nth-child(3)]:self-start':
			isObjectProperty
	}}
	{...layoutAttributes(ctx, config, 'layout', 'layouts', type, {})}
>
	{@render children()}
</div>
