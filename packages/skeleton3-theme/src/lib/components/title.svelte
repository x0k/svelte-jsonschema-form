<script lang="ts">
	import { getFormContext, retrieveUiProps, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/title.svelte';

	const { title, type, config }: ComponentProps['title'] = $props();

	const ctx = getFormContext();
</script>

<div
	class={type === 'field' ? 'label-text' : 'font-bold text-xl'}
	{...retrieveUiProps(ctx, config, 'titleAttributes', {})}
>
	{title}
</div>
