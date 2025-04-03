<script lang="ts">
	import type { ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/title.svelte';

	const { title, type, config }: ComponentProps['title'] = $props();
</script>

{#if type === 'field'}
	<label class="label-text" for={config.id} {...config.uiOptions?.labelAttributes}>
		{title}
		{#if config.required}
			<span>*</span>
		{/if}
	</label>
{:else}
	<div class="font-bold text-xl" {...config.uiOptions?.titleAttributes}>{title}</div>
{/if}
