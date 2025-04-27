<script lang="ts">
	import { ERRORS_FOR_KEY, getFormContext, retrieveUiProps, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/errors-list.svelte';

	const { errors, config }: ComponentProps['errorsList'] = $props();

	const ctx = getFormContext();
</script>

<ui
	class="text-error"
	{...retrieveUiProps(ctx, config, 'errorsList', {
		[ERRORS_FOR_KEY]: config.id
	})}
>
	{#each errors as err}
		<li>{err.message}</li>
	{/each}
</ui>
