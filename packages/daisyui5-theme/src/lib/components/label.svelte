<script lang="ts">
	import type { ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/label.svelte';

	const { title, config }: ComponentProps['label'] = $props();
</script>

<label class="fieldset-legend" for={config.id} {...config.uiOptions?.labelAttributes}>
	{title}
	{#if config.required}
		*
	{/if}
</label>
