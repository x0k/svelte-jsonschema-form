<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';

	declare module '@sjsf/form' {
		interface UiOptions {
			/**
			 * Overrides the attributes of the errors list.
			 */
			skeletonErrorsList?: HTMLAttributes<HTMLUListElement>;
		}
	}
</script>

<script lang="ts">
	import type { ComponentProps } from '@sjsf/form';

	const { errors, forId, config }: ComponentProps['errorsList'] = $props();
</script>

<ui class="text-error-500" data-errors-for={forId} {...config.uiOptions.skeletonErrorsList}>
	{#each errors as err}
		<li>{err.message}</li>
	{/each}
</ui>
