<script lang="ts">
	import { getFormContext, titleAttributes, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/title.svelte';

	const { title, type, config }: ComponentProps['title'] = $props();

	const ctx = getFormContext();
</script>

<div
	class={['font-medium', type == 'field' ? 'text-sm' : 'text-lg']}
	{...titleAttributes(ctx, config, 'titleAttributes', {})}
>
	{title}
</div>
