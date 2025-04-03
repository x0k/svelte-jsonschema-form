<script lang="ts">
	import type { ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/errors-list.svelte';

	const { errors, config }: ComponentProps['errorsList'] = $props();
</script>

<ui class="text-error-500" data-errors-for={config.id} {...config.uiOptions?.errorsList}>
	{#each errors as err}
		<li>{err.message}</li>
	{/each}
</ui>
