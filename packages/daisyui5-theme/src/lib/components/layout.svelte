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
	import { getFormContext, type ComponentProps } from '@sjsf/form';

	const { type, children, config }: ComponentProps['layout'] = $props();

	const isItem = $derived(type === 'array-item' || type === 'object-property');
	const isControls = $derived(type === 'array-item-controls');
	const isColumn = $derived(
		type === 'array-items' || type === 'object-properties' || type === 'multi-field'
	);

	const ctx = getFormContext();
</script>

{#if type === 'field-meta' || type === 'field-content' || type === 'array-field-meta' || type === 'object-field-meta'}
	{@render children()}
{:else if type === 'field' || type === 'array-field' || type === 'object-field'}
	<fieldset
		class="fieldset gap-y-2"
		data-layout={type}
		{...config.uiOptions?.daisyui5FieldsLayout}
		{...config.uiOptions?.daisyui5FieldsLayouts?.[type]}
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
		{...config.uiOptions?.layout}
		{...config.uiOptions?.layouts?.[type]}
		{...ctx.extraUiOptions?.('layout', config)}
		{...ctx.extraUiOptions?.('layouts', config)?.[type]}
	>
		{@render children()}
	</div>
{/if}
