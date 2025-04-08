<script lang="ts">
	import { getFormContext, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/label.svelte';

	const { title, config }: ComponentProps['label'] = $props();

	const ctx = getFormContext();
</script>

<label
	class="fieldset-legend"
	for={config.id}
	{...config.uiOptions?.labelAttributes}
	{...ctx.extraUiOptions?.('labelAttributes', config)}
>
	{title}
	{#if config.required}
		*
	{/if}
</label>
