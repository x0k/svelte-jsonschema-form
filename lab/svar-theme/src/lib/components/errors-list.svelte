<script lang="ts">
	import { errorsListAttributes, getFormContext, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/errors-list.svelte';

	const { errors, config }: ComponentProps['errorsList'] = $props();

	const ctx = getFormContext();
</script>

<ul {...errorsListAttributes(ctx, config, 'errorsList', {})}>
	{#each errors as err}
		<li>{err}</li>
	{/each}
</ul>

<style>
	ul {
		color: var(--wx-color-danger);
		list-style-position: inside;
		padding: 0;
		margin: 0;
	}
</style>
