<script lang="ts">
	import type { ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/title.svelte';

	const { title, type, config }: ComponentProps['title'] = $props();
</script>

<div
	class={type === 'field' ? 'label-text' : 'font-bold text-xl'}
	{...config.uiOptions?.titleAttributes}
>
	{title}
</div>
