<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';

	declare module '@sjsf/form' {
		interface UiOptions {
			/**
			 * Overrides the attributes of the help.
			 */
			skeletonHelpAttributes?: HTMLAttributes<HTMLDivElement>;
		}
	}
</script>

<script lang="ts">
	import type { ComponentProps } from '@sjsf/form';

	const { help, config }: ComponentProps['help'] = $props();
</script>

<div class="opacity-60" {...config.uiOptions.skeletonHelpAttributes}>{help}</div>
