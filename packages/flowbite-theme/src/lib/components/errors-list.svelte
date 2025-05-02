<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';
	declare module '@sjsf/form' {
		interface UiOptions {
			flowbiteErrorsList?: HTMLAttributes<HTMLUListElement>;
		}
	}
</script>

<script lang="ts">
	import { errorsListAttributes, getFormContext, type ComponentProps } from '@sjsf/form';

	const { errors, config }: ComponentProps['errorsList'] = $props();

	const ctx = getFormContext();
</script>

<ul
	class="text-red-700 dark:text-red-500"
	{...errorsListAttributes(ctx, config, 'flowbiteErrorsList', {})}
>
	{#each errors as err}
		<li>{err.message}</li>
	{/each}
</ul>
