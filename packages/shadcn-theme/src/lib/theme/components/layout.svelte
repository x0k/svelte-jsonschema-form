<script lang="ts">
	import { getFormContext, layoutAttributes, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/layout.svelte';

	const { type, children, config }: ComponentProps['layout'] = $props();

	const isItem = $derived(
		type === 'array-item' || type === 'object-property' || type === 'field-content'
	);
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

	const ctx = getFormContext();
</script>

<div
	class={{
		flex: isItem || isControls || isField || isColumn,
		'gap-2': isItem || isField || isControls,
		'gap-4': isColumn,
		'items-start': isItem || isControls,
		'preset-outlined-surface-200-800': isControls,
		grow: isGrowable,
		'flex-col': isColumn || isField
	}}
	{...layoutAttributes(ctx, config, 'layout', 'layouts', type, {})}
>
	{@render children()}
</div>
