<script lang="ts">
	import { getFormContext, layoutAttributes, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/layout.svelte';

	const { type, children, config }: ComponentProps['layout'] = $props();

	const isItemOrControls = $derived(
		type === 'array-item' || type === 'field-content' || type === 'array-item-controls'
	);
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
	const isTitleRow = $derived(
		type === 'field-title-row' ||
			type === 'array-field-title-row' ||
			type === 'object-field-title-row'
	);
	const isMultiFieldControls = $derived(type === 'multi-field-controls');

	const isObjectProperty = $derived(type === 'object-property');

	const ctx = getFormContext();
</script>

<div
	class={{
		flex: isItemOrControls || isField || isColumn || isTitleRow || isMultiFieldControls,
		'items-center': isTitleRow || isMultiFieldControls,
		'justify-between': isTitleRow,
		'gap-2': isItemOrControls || isField || isMultiFieldControls,
		'gap-4': isColumn,
		'items-start': isItemOrControls,
		grow: isGrowable,
		'flex-col': isColumn || isField,
		'grid [&:has(>:nth-child(2))]:grid-cols-[1fr_1fr_auto] grid-cols-1 grid-rows-[1fr] items-start gap-x-2':
			isObjectProperty
	}}
	{...layoutAttributes(ctx, config, 'layout', 'layouts', type, {})}
>
	{@render children()}
</div>
