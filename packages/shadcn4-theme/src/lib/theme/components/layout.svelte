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
			FieldLegend: Component<HTMLAttributes<HTMLLegendElement>>;
			FieldGroup: Component<HTMLAttributes<HTMLDivElement>>;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, layoutAttributes, uiOptionProps, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/layout.svelte';

	import { getThemeContext } from '../context.js';

	const { type, children, config, errors }: ComponentProps['layout'] = $props();

	const isItem = $derived(type === 'array-item');
	const isGrowable = $derived(
		type === 'array-item-content' ||
			type === 'object-property-key-input' ||
			type === 'object-property-content'
	);
	const isObjectProperty = $derived(type === 'object-property');
	const isMeta = $derived(
		type === 'field-meta' || type === 'array-field-meta' || type === 'object-field-meta'
	);
	const isMultiFieldControls = $derived(type === 'multi-field-controls');

	const ctx = getFormContext();
	const themeCtx = getThemeContext();

	const { ButtonGroup, FieldSet, FieldLegend, Field, FieldGroup } = $derived(themeCtx.components);

	const attributes = $derived(layoutAttributes(ctx, config, 'layout', 'layouts', type, {}));
</script>

{#if (type === 'field-content' || isMeta) && Object.keys(attributes).length < 2}
	{@render children()}
{:else if type === 'array-item-controls'}
	<ButtonGroup {...uiOptionProps('shadcn4ButtonGroup')(attributes, config, ctx)}>
		{@render children()}
	</ButtonGroup>
{:else if type === 'array-field' || type === 'object-field'}
	<FieldSet
		{...uiOptionProps('shadcn4FieldSet')(attributes as HTMLFieldsetAttributes, config, ctx)}
	>
		{@render children()}
	</FieldSet>
{:else if type == 'field'}
	<Field
		data-invalid={errors.length > 0}
		{...uiOptionProps('shadcn4Field')(attributes, config, ctx)}
	>
		{@render children()}
	</Field>
{:else if type === 'field-title-row'}
	<div class="flex w-full items-center justify-between" {...attributes}>
		{@render children()}
	</div>
{:else if type === 'array-field-title-row' || type === 'object-field-title-row'}
	<FieldLegend class="flex w-full items-center justify-between" {...attributes}>
		{@render children()}
	</FieldLegend>
{:else if type === 'array-items' || type === 'object-properties' || type === 'multi-field' || type === 'multi-field-content'}
	<FieldGroup {...attributes}>
		{@render children()}
	</FieldGroup>
{:else}
	<div
		class={{
			grow: isGrowable,
			'flex items-center gap-2': isMultiFieldControls,
			'flex items-start gap-1.5': isItem,
			'grid grid-cols-1 grid-rows-[1fr] items-start gap-x-1.5 [&:has(>:nth-child(2))]:grid-cols-[1fr_1fr_auto]':
				isObjectProperty
		}}
		{...attributes}
	>
		{@render children()}
	</div>
{/if}
