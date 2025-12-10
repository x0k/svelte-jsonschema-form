<script lang="ts">
	import { getFormContext, titleAttributes, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/title.svelte';

	const { title, templateType, config }: ComponentProps['title'] = $props();

	const ctx = getFormContext();

	const isFieldTemplate = $derived(templateType === 'fieldTemplate')
</script>

<div
	class={isFieldTemplate ? 'label-text' : 'font-bold text-xl'}
	{...titleAttributes(ctx, config, 'titleAttributes', {})}
>
	{title}
	{#if config.required && isFieldTemplate}
		*
	{/if}
</div>
