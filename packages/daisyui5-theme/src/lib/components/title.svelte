<script lang="ts">
	import type { ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/title.svelte';

	const { title, type, forId, required, config }: ComponentProps['title'] = $props();
</script>

{#if type === 'field'}
	<label class="fieldset-legend" for={forId} {...config.uiOptions?.labelAttributes}>
		{title}
		{#if required}
			*
		{/if}
	</label>
{:else}
	<legend class="fieldset-legend text-base" {...config.uiOptions?.titleAttributes}>{title}</legend>
{/if}
