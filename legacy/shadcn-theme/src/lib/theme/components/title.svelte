<script lang="ts">
	import { getFormContext, titleAttributes, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/title.svelte';

	const { title, templateType, config }: ComponentProps['title'] = $props();

	const ctx = getFormContext();
</script>

<div
	class={['font-medium', templateType == 'fieldTemplate' ? 'text-sm' : 'text-lg']}
	{...titleAttributes(ctx, config, 'titleAttributes', {})}
>
	{title}
</div>
