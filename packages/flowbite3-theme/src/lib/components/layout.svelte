<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';
	import type { ButtonGroupProps } from 'flowbite-svelte';
	import type { LayoutType } from '@sjsf/form/fields/components';

	declare module '@sjsf/form' {
		interface UiOptions {
			flowbiteLayout?: HTMLAttributes<HTMLDivElement>;
			flowbiteLayouts?: {
				[L in LayoutType]?: HTMLAttributes<HTMLDivElement>;
			};
			flowbiteButtonGroup?: ButtonGroupProps;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, type ComponentProps } from '@sjsf/form';
	import ButtonGroup from 'flowbite-svelte/ButtonGroup.svelte';

	const { type, children, config }: ComponentProps['layout'] = $props();

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

	const ctx = getFormContext();
</script>

{#if isControls}
	<ButtonGroup
		{...config.uiOptions?.flowbiteButtonGroup}
		{...ctx.extraUiOptions?.('flowbiteButtonGroup', config)}
	>
		{@render children()}
	</ButtonGroup>
{:else}
	<div
		class={{
			flex: isItem || isField || isColumn,
			'gap-2': isItem || isField,
			'gap-4': isColumn,
			'items-start': isItem,
			grow: isGrowable,
			'flex-col': isField || isColumn
		}}
		data-layout={type}
		{...config.uiOptions?.flowbiteLayout}
		{...config.uiOptions?.flowbiteLayouts?.[type]}
		{...ctx.extraUiOptions?.('flowbiteLayout', config)}
		{...ctx.extraUiOptions?.('flowbiteLayouts', config)?.[type]}
	>
		{@render children()}
	</div>
{/if}
