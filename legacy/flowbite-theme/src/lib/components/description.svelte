<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';

	declare module '@sjsf/form' {
		interface UiOptions {
			flowbiteDescription?: HTMLAttributes<HTMLDivElement>;
		}
	}
</script>

<script lang="ts">
	import { descriptionAttributes, getFormContext, type ComponentProps } from '@sjsf/form';

	const { description, config }: ComponentProps['description'] = $props();

	const ctx = getFormContext();
</script>

<div class="text-sm opacity-70" {...descriptionAttributes(ctx, config, 'flowbiteDescription', {})}>
	{description}
</div>
