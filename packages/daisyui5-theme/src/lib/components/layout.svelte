<script lang="ts" module>
	import type { HTMLFieldsetAttributes } from 'svelte/elements';
	import type { LayoutType } from '@sjsf/form/fields/exports';
	import '@sjsf/basic-theme/components/layout.svelte';
	declare module '@sjsf/form' {
		interface UiOptions {
			daisyui5FieldsLayout?: HTMLFieldsetAttributes;
			daisyui5FieldsLayouts?: {
				[L in LayoutType]?: HTMLFieldsetAttributes;
			};
		}
	}
</script>

<script lang="ts">
	import { getFormContext, layoutAttributes, type ComponentProps } from '@sjsf/form';

	const { type, children, config }: ComponentProps['layout'] = $props();

	const isItem = $derived(type === 'array-item');
	const isProperty = $derived(type === 'object-property');
	const isControls = $derived(type === 'array-item-controls');
	const isColumn = $derived(
		type === 'array-items' || type === 'object-properties' || type === 'multi-field'
	);

	const ctx = getFormContext();

	const attributes = $derived(layoutAttributes(ctx, config, 'layout', 'layouts', type, {}));
</script>

{#if (type === 'field-meta' || type === 'field-content' || type === 'array-field-meta' || type === 'object-field-meta') && Object.keys(attributes).length < 2}
	{@render children()}
{:else if type === 'field' || type === 'array-field' || type === 'object-field'}
	{@const attributes = layoutAttributes(
		ctx,
		config,
		'daisyui5FieldsLayout',
		'daisyui5FieldsLayouts',
		type,
		{}
	)}
	<fieldset class="fieldset gap-y-2" {...attributes}>
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
			'flex-col': isColumn,
			'grid [&:has(>:nth-child(2))]:grid-cols-[1fr_1fr_auto] grid-cols-1 grid-rows-[1fr] items-start gap-x-2':
				isProperty
		}}
		{...attributes}
	>
		{@render children()}
	</div>
{/if}
