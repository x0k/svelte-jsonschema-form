<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';
	declare module '@sjsf/form' {
		interface UiOptions {
			flowbite3ErrorsList?: HTMLAttributes<HTMLUListElement>;
		}
	}
</script>

<script lang="ts">
	import { ERRORS_FOR_KEY, getFormContext, retrieveUiProps, type ComponentProps } from '@sjsf/form';

	const { errors, config }: ComponentProps['errorsList'] = $props();

	const ctx = getFormContext();
</script>

<ui
	class="text-red-700 dark:text-red-500"
	{...retrieveUiProps(ctx, config, 'flowbite3ErrorsList', {
		[ERRORS_FOR_KEY]: config.id
	})}
>
	{#each errors as err}
		<li>{err.message}</li>
	{/each}
</ui>
