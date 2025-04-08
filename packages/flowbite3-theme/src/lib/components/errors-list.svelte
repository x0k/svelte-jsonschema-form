<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';
	declare module '@sjsf/form' {
		interface UiOptions {
			flowbiteErrorsList?: HTMLAttributes<HTMLUListElement>;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, type ComponentProps } from '@sjsf/form';

	const { errors, config }: ComponentProps['errorsList'] = $props();

	const ctx = getFormContext();
</script>

<ui
	class="text-red-700 dark:text-red-500"
	data-errors-for={config.id}
	{...config.uiOptions?.flowbiteErrorsList}
	{...ctx.extraUiOptions?.('flowbiteErrorsList', config)}
>
	{#each errors as err}
		<li>{err.message}</li>
	{/each}
</ui>
