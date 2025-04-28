<script lang="ts">
	import { getFormContext, retrieveUiProps, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/title.svelte';

	const { title, type, config }: ComponentProps['title'] = $props();

	const ctx = getFormContext();
</script>

<div
	class={['text-gray-900 dark:text-white', { 'font-semibold': type !== 'field' }]}
	{...retrieveUiProps(ctx, config, 'titleAttributes', {})}
>
	{title}
</div>
