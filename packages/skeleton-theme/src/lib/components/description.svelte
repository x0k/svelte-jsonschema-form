<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';

	declare module '@sjsf/form' {
		interface UiOptions {
			skeletonDescriptionContainer?: HTMLAttributes<HTMLDivElement>;
		}
	}
</script>

<script lang="ts">
	import type { ComponentProps } from '@sjsf/form';

	const { description, config }: ComponentProps['description'] = $props();
</script>

<div class="opacity-60" {...config.uiOptions.skeletonDescriptionContainer}>{description}</div>
