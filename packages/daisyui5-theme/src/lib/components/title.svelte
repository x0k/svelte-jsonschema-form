<script lang="ts">
	import { getFormContext, titleAttributes, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/title.svelte';

	const { title, config, type }: ComponentProps['title'] = $props();

	const ctx = getFormContext();
</script>

<legend
	class={['fieldset-legend', { 'text-base': type !== 'field' }]}
	{...titleAttributes("titleAttributes")({}, config, ctx)}
>
	{title}
</legend>
