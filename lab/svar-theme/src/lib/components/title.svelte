<script lang="ts">
	import { getFormContext, titleAttributes, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/title.svelte';

	const { title, config, templateType, errors }: ComponentProps['title'] = $props();

	const ctx = getFormContext();
</script>

<div
	{...titleAttributes(ctx, config, 'titleAttributes', {
		'data-template': templateType,
		'data-required': config.required,
		'data-error': errors.length > 0
	})}
>
	{title}
</div>

<style>
	div {
		display: block;
		margin: var(--wx-label-margin);
		padding: var(--wx-label-padding);
		font-family: var(--wx-label-font-family);
		font-size: var(--wx-label-font-size);
		line-height: var(--wx-label-line-height);
		font-weight: var(--wx-label-font-weight);
		color: var(--wx-label-font-color);
	}
	div:not([data-template='fieldTemplate']) {
		font-size: 18px;
		/* margin: 12px 0; */
		font-weight: normal;
	}
	div[data-template='fieldTemplate'][data-error='true'] {
		color: var(--wx-color-danger);
	}
	div[data-template='fieldTemplate'][data-required='true']::after {
		content: ' *';
		color: var(--wx-color-danger);
	}
</style>
