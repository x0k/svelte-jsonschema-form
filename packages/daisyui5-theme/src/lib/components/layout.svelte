<script lang="ts">
	import type { HTMLAttributes, HTMLFieldsetAttributes } from 'svelte/elements';
	import type { ComponentProps } from '@sjsf/form';

	const { type, children, attributes }: ComponentProps<'layout'> = $props();

	const isItem = $derived(type === 'array-item' || type === 'object-property');
	const isControls = $derived(type === 'array-item-controls');
	const isColumn = $derived(
		type === 'array-items' || type === 'object-properties' || type === 'multi-field'
	);
</script>

{#if type === 'field-meta' || type === 'field-content' || type === 'root-field' || type === 'array-field-meta' || type === 'object-field-meta'}
	{@render children()}
{:else if type === 'field' || type === 'array-field' || type === 'object-field'}
	<fieldset
		class="fieldset gap-y-2"
		data-layout={type}
		{...attributes as HTMLAttributes<HTMLDivElement> & HTMLFieldsetAttributes}
	>
		{@render children()}
	</fieldset>
{:else}
	<div
		class={{
			flex: isItem || isControls || isColumn || type === 'multi-field-controls',
			'gap-2': isItem || isColumn,
			'items-start': isItem || isControls,
			join: isControls,
			grow:
				type === 'array-item-content' ||
				type === 'object-property-key-input' ||
				type === 'object-property-content',
			'flex-col': isColumn
		}}
		data-layout={type}
		{...attributes}
	>
		{@render children()}
	</div>
{/if}
