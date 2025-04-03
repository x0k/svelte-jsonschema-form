<script lang="ts">
	import type { ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/title.svelte';

	const { title, config, type }: ComponentProps['title'] = $props();
</script>

<legend
	class={['fieldset-legend', { 'text-base': type !== 'field' }]}
	{...config.uiOptions?.titleAttributes}>{title}</legend
>
