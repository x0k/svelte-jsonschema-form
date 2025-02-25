<script lang="ts">
	import type { ComponentProps } from '@sjsf/form';

	const { errors, forId, config }: ComponentProps['errorsList'] = $props();
</script>

<ui class="text-error-500" data-errors-for={forId} {...config.uiOptions?.errorsList}>
	{#each errors as err}
		<li>{err.message}</li>
	{/each}
</ui>
