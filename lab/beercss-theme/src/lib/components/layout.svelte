<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';
	declare module '@sjsf/form' {
		interface UiOptions {
			beercssNav?: HTMLAttributes<HTMLElement>;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, layoutAttributes, uiOptionProps, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/layout.svelte';

	const { type, children, config, errors }: ComponentProps['layout'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(layoutAttributes(ctx, config, 'layout', 'layouts', type, {}));
</script>

{#if type === 'field-content'}
	{@render children()}
{:else if type === 'array-item-controls'}
	<nav {...uiOptionProps('beercssNav')({ class: 'group connected' }, config, ctx)}>
		{@render children()}
	</nav>
{:else}
	<div
		class={type === 'field' || type === 'multi-field-controls'
			? [
					'field border',
					errors.length > 0 && 'invalid',
					type === 'multi-field-controls' && 'layout'
				]
			: 'layout'}
		{...attributes}
	>
		{@render children()}
	</div>
{/if}

<style>
	.layout {
		&[data-layout='object-property'] {
			display: grid;
			grid-template-rows: 1fr;
			align-items: start;
			column-gap: 0.2rem;
		}
		&[data-layout='array-item'],
		&[data-layout='array-item-controls'] {
			display: flex;
			gap: 0.2rem;
			align-items: start;
		}
		&[data-layout='multi-field-controls'] {
			display: flex;
			flex-direction: row;
			gap: 0.5rem;
			align-items: center;
		}
		&[data-layout='array-item-content'] {
			flex-grow: 1;
		}
		&[data-layout='field-content'] {
			display: flex;
			gap: 0.5rem;
			flex-wrap: wrap;
		}
		&[data-layout='array-items'],
		&[data-layout='object-properties'],
		&[data-layout='array-field'],
		&[data-layout='object-field'],
		&[data-layout='multi-field'] {
			display: flex;
			flex-direction: column;
			gap: 1rem;
		}
		&[data-layout='field-title-row'],
		&[data-layout='array-field-title-row'],
		&[data-layout='object-field-title-row'] {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
		&[data-layout='object-property-key-input'],
		&[data-layout='object-property-content'] {
			flex-grow: 1;
		}
		&[data-layout='object-field-meta'],
		&[data-layout='array-field-meta'] {
			padding: 0;
		}
		&[data-layout='object-property'] {
			grid-template-columns: 1fr;
		}
		&[data-layout='object-property']:has(:global(> :nth-child(2))) {
			grid-template-columns: 1fr 1fr auto;
		}
	}
</style>
