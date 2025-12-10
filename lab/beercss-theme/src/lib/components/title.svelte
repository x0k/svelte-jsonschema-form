<script lang="ts">
	import { getFormContext, titleAttributes, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/title.svelte';

	const { title, config, templateType }: ComponentProps['title'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(titleAttributes(ctx, config, 'titleAttributes', {}));
</script>

{#if templateType === 'fieldTemplate'}
	<div class="title" {...attributes}>
		{title}
		{#if config.required}
			*
		{/if}
	</div>
{:else}
	<h6 {...attributes}>
		{title}
	</h6>
{/if}

<style>
	.title {
		font-size: 0.75rem;
	}
</style>
