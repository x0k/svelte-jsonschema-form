<script lang="ts">
	import type { ComponentProps } from '@sjsf/form';

	const { type, children, attributes }: ComponentProps<'layout'> = $props();

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
</script>

<div
	class:flex={isItem || isControls || isColumn}
	class:gap-2={isItem || isField}
	class:gap-4={isColumn}
	class:items-start={isItem || isControls}
	class:join={isControls}
	class:grow={isGrowable}
	class:flex-col={isColumn}
	data-layout={type}
	{...attributes}
>
	{@render children()}
</div>
