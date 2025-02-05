<script lang="ts">
	import type { ComponentProps } from '@sjsf/form';

	const { errors, forId }: ComponentProps<'errorsList'> = $props();
</script>

<ui class="error" data-errors-for={forId}>
	{#each errors as err}
		<li>{err.message}</li>
	{/each}
</ui>

<style>
	.error {
		color: rgb(var(--m3-scheme-error));
	}
</style>
