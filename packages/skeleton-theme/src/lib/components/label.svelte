<script lang="ts">
	import { getFormContext, retrieveUiProps, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/label.svelte';

	const { title, config }: ComponentProps['label'] = $props();

	const ctx = getFormContext();
</script>

<label class="label-text" {...retrieveUiProps(ctx, config, 'labelAttributes', { for: config.id })}>
	{title}
	{#if config.required}
		<span>*</span>
	{/if}
</label>
