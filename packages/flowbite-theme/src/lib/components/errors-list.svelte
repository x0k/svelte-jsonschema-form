<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';
	declare module '@sjsf/form' {
		interface UiOptions {
			flowbiteErrorsList?: HTMLAttributes<HTMLUListElement>;
		}
	}
</script>

<script lang="ts">
	import type { ComponentProps } from '@sjsf/form';

	const { errors, forId, config }: ComponentProps['errorsList'] = $props();
</script>

<ui
	class="text-red-700 dark:text-red-500"
	data-errors-for={forId}
	{...config.uiOptions?.flowbiteErrorsList}
>
	{#each errors as err}
		<li>{err.message}</li>
	{/each}
</ui>
