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

	const { errors, config }: ComponentProps['errorsList'] = $props();
</script>

<ui
	class="text-red-700 dark:text-red-500"
	data-errors-for={config.id}
	{...config.uiOptions?.flowbiteErrorsList}
>
	{#each errors as err}
		<li>{err.message}</li>
	{/each}
</ui>
