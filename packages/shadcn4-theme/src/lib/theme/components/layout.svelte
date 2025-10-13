<script lang="ts" module>
	import type { Component } from 'svelte';
	import type { HTMLAttributes, HTMLFieldsetAttributes } from 'svelte/elements';

	import type { ButtonGroupOrientation } from '$lib/components/ui/button-group/button-group.svelte';
	import type { FieldOrientation } from '$lib/components/ui/field/field.svelte';

	export type ButtonGroupProps = HTMLAttributes<HTMLDivElement> & {
		orientation?: ButtonGroupOrientation;
	};
	export type FieldProps = HTMLAttributes<HTMLDivElement> & {
		orientation?: FieldOrientation;
	};

	declare module '@sjsf/form' {
		interface UiOptions {
			shadcn4ButtonGroup?: ButtonGroupProps;
			shadcn4Field?: FieldProps;
			shadcn4FieldSet?: HTMLFieldsetAttributes;
		}
	}

	declare module '../context.js' {
		interface ThemeComponents {
			ButtonGroup: Component<ButtonGroupProps>;
			Field: Component<FieldProps>;
			FieldSet: Component<HTMLFieldsetAttributes>;
			FieldContent: Component<HTMLAttributes<HTMLDivElement>>;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, layoutAttributes, uiOptionProps, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/layout.svelte';

	import { getThemeContext } from '../context.js';

	const { type, children, config, errors }: ComponentProps['layout'] = $props();

	const isItem = $derived(type === 'array-item' || type === 'field-content');
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
	const isObjectProperty = $derived(type === 'object-property');

	const ctx = getFormContext();
	const themeCtx = getThemeContext();

	const { ButtonGroup, FieldSet, Field, FieldContent } = $derived(themeCtx.components);

	const attributes = $derived(layoutAttributes(ctx, config, 'layout', 'layouts', type, {}));
</script>

{#if (type === 'field-content' || type === 'array-field-meta' || type === 'object-field-meta') && Object.keys(attributes).length < 2}
	{@render children()}
{:else if type === 'array-item-controls'}
	<ButtonGroup {...attributes} {...uiOptionProps('shadcn4ButtonGroup')({}, config, ctx)}>
		{@render children()}
	</ButtonGroup>
{:else if type === 'array-field' || type === 'object-field'}
	<FieldSet {...attributes} {...uiOptionProps('shadcn4FieldSet')({}, config, ctx)}>
		{@render children()}
	</FieldSet>
{:else if type == 'field'}
	<Field
		orientation="responsive"
		data-invalid={errors.length > 0}
		{...attributes}
		{...uiOptionProps('shadcn4Field')({}, config, ctx)}
	>
		{@render children()}
	</Field>
{:else if type === 'field-meta'}
	<FieldContent {...attributes}>
		{@render children()}
	</FieldContent>
{:else}
	<div
		class={{
			flex: isItem || isField || isColumn,
			'gap-1.5': isItem || isField,
			'gap-4': isColumn,
			'items-start': isItem,
			grow: isGrowable,
			'flex-col': isColumn || isField,
			'grid grid-cols-1 grid-rows-[1fr] items-start gap-x-1.5 [&:has(>:nth-child(2))]:grid-cols-[1fr_1fr_auto]':
				isObjectProperty
		}}
		{...attributes}
	>
		{@render children()}
	</div>
{/if}
