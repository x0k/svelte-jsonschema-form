<script lang="ts" module>
	import type { HTMLLabelAttributes } from 'svelte/elements';
	import '@sjsf/form/fields/extra-components/label';

	declare module '@sjsf/form' {
		interface UiOptions {
			/**
			 * Overrides the attributes of the field label.
			 */
			labelAttributes?: HTMLLabelAttributes;
		}
	}
</script>

<script lang="ts">
	import { type ComponentProps, getFormContext, labelAttributes } from '@sjsf/form';

	const { title, config, errors }: ComponentProps['label'] = $props();

	const ctx = getFormContext();
</script>

<label
	{...labelAttributes(ctx, config, 'labelAttributes', {
		'data-error': errors.length > 0,
		'data-required': config.required
	})}
>
	{title}
</label>

<style>
	label[data-error='true'] {
		color: var(--wx-color-danger);
	}
	label {
		display: block;
		margin: var(--wx-label-margin);
		padding: var(--wx-label-padding);
		font-family: var(--wx-label-font-family);
		font-size: var(--wx-label-font-size);
		line-height: var(--wx-label-line-height);
		font-weight: var(--wx-label-font-weight);
		color: var(--wx-label-font-color);
	}

	label[data-required='true']::after {
		content: ' *';
		color: var(--wx-color-danger);
	}
</style>
