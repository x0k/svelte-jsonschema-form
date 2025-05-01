<script lang="ts">
	import { errorsListAttributes, getFormContext, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/errors-list.svelte';

	const { errors, config }: ComponentProps['errorsList'] = $props();

	const ctx = getFormContext();
</script>

<ui class="text-error" {...errorsListAttributes('errorsList')({}, config, ctx)}>
	{#each errors as err}
		<li>{err.message}</li>
	{/each}
</ui>
