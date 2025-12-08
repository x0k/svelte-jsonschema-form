<script lang="ts">
	import { getFormContext, labelAttributes, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/label.svelte';

	const { title, config }: ComponentProps['label'] = $props();

	const ctx = getFormContext();
</script>

<label {...labelAttributes(ctx, config, 'labelAttributes', {})}>
	{title}
	{#if config.required}
		*
	{/if}
</label>
