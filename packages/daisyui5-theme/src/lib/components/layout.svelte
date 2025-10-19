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
		composeProps,
		getFormContext,
		layoutAttributes,
		uiOptionNestedProps,
		uiOptionProps,
		type ComponentProps
	} from '@sjsf/form';

	const { type, children, config }: ComponentProps['layout'] = $props();

	const isItem = $derived(type === 'array-item');
	const isProperty = $derived(type === 'object-property');
	const isControls = $derived(type === 'array-item-controls');
	const isColumn = $derived(
		type === 'array-items' || type === 'object-properties' || type === 'multi-field'
	);
	const isField = $derived(type === 'field' || type === 'array-field' || type === 'object-field');
	const isTitleRow = $derived(
		type === 'field-title-row' ||
			type === 'array-field-title-row' ||
			type === 'object-field-title-row'
	);

	const ctx = getFormContext();

	const attributes = $derived(layoutAttributes(ctx, config, 'layout', 'layouts', type, {}));
</script>

{#if type === 'field-content' || (type === 'field-meta' && Object.keys(attributes).length < 2)}
	{@render children()}
{:else if isField}
	<fieldset
		class="fieldset gap-y-2"
		{...composeProps(
			ctx,
			config,
			attributes as HTMLFieldsetAttributes,
			uiOptionProps('daisyui5FieldsLayout'),
			uiOptionNestedProps('daisyui5FieldsLayouts', (data) => data[type])
		)}
	>
		{@render children()}
	</fieldset>
{:else if type === 'array-field-meta' || type === 'object-field-meta'}
	<legend class="w-full" {...attributes}>
		{@render children()}
	</legend>
{:else}
	<div
		class={{
			flex: isItem || isControls || isColumn || isTitleRow || type === 'multi-field-controls',
			'gap-2': isItem || isColumn,
			'items-start': isItem || isControls,
			'items-center justify-between': isTitleRow,
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
