<script lang="ts">
	import { getFormContext, layoutAttributes, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/layout.svelte';

	const { type, children, config }: ComponentProps['layout'] = $props();

	const isItemOrControls = $derived(
		type === 'array-item' ||
			type === 'object-property' ||
			type === 'field-content' ||
			type === 'array-item-controls'
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

	const ctx = getFormContext();
</script>

<div
	class:flex={isItemOrControls || isField || isColumn}
	class:gap-2={isItemOrControls || isField}
	class:gap-4={isColumn}
	class:items-start={isItemOrControls}
	class:grow={isGrowable}
	class:flex-col={isColumn || isField}
	{...layoutAttributes(ctx, config, 'layout', 'layouts', type, {})}
>
	{@render children()}
</div>
