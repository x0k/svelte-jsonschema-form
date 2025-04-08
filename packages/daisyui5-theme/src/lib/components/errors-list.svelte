<script lang="ts">
	import { getFormContext, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/errors-list.svelte';

	const { errors, config }: ComponentProps['errorsList'] = $props();

	const ctx = getFormContext();
</script>

<ui
	class="text-error"
	data-errors-for={config.id}
	{...config.uiOptions?.errorsList}
	{...ctx.extraUiOptions?.('errorsList', config)}
>
	{#each errors as err}
		<li>{err.message}</li>
	{/each}
</ui>
