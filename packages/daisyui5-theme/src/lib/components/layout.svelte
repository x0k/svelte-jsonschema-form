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
	import {
		getFormContext,
		retrieveNestedUiProps,
		retrieveUiProps,
		type ComponentProps
	} from '@sjsf/form';

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
	{@const attributes = retrieveNestedUiProps(
		ctx,
		config,
		'daisyui5FieldsLayouts',
		(l) => l[type],
		retrieveUiProps(ctx, config, 'daisyui5FieldsLayout', {
			'data-layout': type
		})
	)}
	<fieldset class="fieldset gap-y-2" {...attributes}>
		{@render children()}
	</fieldset>
{:else}
	{@const attributes = retrieveNestedUiProps(
		ctx,
		config,
		'layouts',
		(l) => l[type],
		retrieveUiProps(ctx, config, 'layout', {
			'data-layout': type
		})
	)}
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
		{...attributes}
	>
		{@render children()}
	</div>
{/if}
