<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';

	declare module '@sjsf/form' {
		interface UiOptions {
			flowbiteDescription?: HTMLAttributes<HTMLDivElement>;
		}
	}
</script>

<script lang="ts">
	import type { ComponentProps } from '@sjsf/form';

	const { description, config }: ComponentProps['description'] = $props();
</script>

<div class="text-sm opacity-70" {...config.uiOptions?.flowbiteDescription}>{description}</div>
