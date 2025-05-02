<script lang="ts">
	import { errorsListAttributes, getFormContext, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/errors-list.svelte';

	const { errors, config }: ComponentProps['errorsList'] = $props();

	const ctx = getFormContext();
</script>

<ul
	class="text-error-500 list-disc list-inside"
	{...errorsListAttributes(ctx, config, 'errorsList', {})}
>
	{#each errors as err}
		<li>{err.message}</li>
	{/each}
</ul>
