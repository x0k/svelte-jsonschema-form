<script lang="ts">
	import { getFormContext, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/label.svelte';
	import { createExpect } from 'vitest';

	const { title, config }: ComponentProps['label'] = $props();

	const ctx = getFormContext();
</script>

<label
	class="label-text"
	for={config.id}
	{...config.uiOptions?.labelAttributes}
	{...ctx.extraUiOptions?.('labelAttributes', config)}
>
	{title}
	{#if config.required}
		<span>*</span>
	{/if}
</label>
