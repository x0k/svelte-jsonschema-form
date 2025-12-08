<script lang="ts">
	import { errorsListAttributes, getFormContext, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/errors-list.svelte';

	const { errors, config }: ComponentProps['errorsList'] = $props();

	const ctx = getFormContext();
</script>

<ul
	{...errorsListAttributes(ctx, config, 'errorsList', {
		class: 'errors-list'
	})}
>
	{#each errors as err}
		<li class="error-text">{err}</li>
	{/each}
</ul>

<style>
	.errors-list {
		margin: 0 !important;
	}
	:global(.field > .errors-list) {
		margin-top: 1rem !important;
	}
</style>
