<script lang="ts">
	import { getFormContext, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/title.svelte';

	const { title, config, type }: ComponentProps['title'] = $props();

	const ctx = getFormContext();
</script>

<legend
	class={['fieldset-legend', { 'text-base': type !== 'field' }]}
	{...config.uiOptions?.titleAttributes}
	{...ctx.extraUiOptions?.('titleAttributes', config)}
>
	{title}
</legend>
