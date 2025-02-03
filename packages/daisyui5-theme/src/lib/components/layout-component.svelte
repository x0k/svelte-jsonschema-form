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
			type === 'object-properties' ||
			type === 'root-field'
	);
	const isMultiFieldControls = $derived(type === 'multi-field-controls');
</script>

{#if type === 'field-meta' || type === 'field-content' ||
		 type === 'root-field' || type === 'array-field-meta' || type === 'object-field-meta'}
	{@render children()}
{:else if type === 'field' || type === 'array-field' || type === 'object-field'}
	<fieldset class="fieldset gap-y-2">
		{@render children()}
	</fieldset>
{:else}
	<div
		class={{
			'flex': isItem || isControls || isField || isColumn || isMultiFieldControls,
			'gap-2': isItem || isField || isColumn,
			'items-start': isItem || isControls,
			'join': isControls,
			'grow': isGrowable,
			'flex-col': isColumn || isField
		}}
		data-layout={type}
		{...attributes}
	>
		{@render children()}
	</div>
{/if}
