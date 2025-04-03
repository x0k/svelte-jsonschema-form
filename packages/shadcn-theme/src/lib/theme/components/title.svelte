<script lang="ts">
	import type { ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/title.svelte';

	const { title, type, config }: ComponentProps['title'] = $props();
</script>

<div
	class={['font-medium', type == 'field' ? 'text-sm' : 'text-lg']}
	{...config.uiOptions?.titleAttributes}
>
	{title}
</div>
