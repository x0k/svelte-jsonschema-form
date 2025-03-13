<script lang="ts">
	import type { ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/title.svelte';

	const { title, type, forId, required, config }: ComponentProps['title'] = $props();
</script>

{#if type === 'field'}
	<label class="label-text" for={forId} {...config.uiOptions?.labelAttributes}>
		{title}
		{#if required}
			<span>*</span>
		{/if}
	</label>
{:else}
	<div class="font-bold text-2xl" {...config.uiOptions?.titleAttributes}>{title}</div>
{/if}
