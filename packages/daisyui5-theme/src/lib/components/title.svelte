<script lang="ts">
	import type { ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/title.svelte';

	const { title, type, config }: ComponentProps['title'] = $props();
</script>

{#if type === 'field'}
	<label class="fieldset-legend" for={config.id} {...config.uiOptions?.labelAttributes}>
		{title}
		{#if config.required}
			*
		{/if}
	</label>
{:else}
	<legend class="fieldset-legend text-base" {...config.uiOptions?.titleAttributes}>{title}</legend>
{/if}
