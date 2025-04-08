<script lang="ts">
	import { getFormContext, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/title.svelte';

	const { title, type, config }: ComponentProps['title'] = $props();

	const ctx = getFormContext();
</script>

<div
	class={type === 'field' ? 'label-text' : 'font-bold text-xl'}
	{...config.uiOptions?.titleAttributes}
	{...ctx.extraUiOptions?.('titleAttributes', config)}
>
	{title}
</div>
