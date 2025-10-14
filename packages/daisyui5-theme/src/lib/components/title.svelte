<script lang="ts">
	import { getFormContext, titleAttributes, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/title.svelte';

	const { title, config, templateType }: ComponentProps['title'] = $props();

	const ctx = getFormContext();
</script>

<legend
	class={['fieldset-legend', { 'text-base': templateType !== 'fieldTemplate' }]}
	{...titleAttributes(ctx, config, 'titleAttributes', {})}
>
	{title}
</legend>
