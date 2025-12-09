<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';

	declare module '@sjsf/form' {
		interface UiOptions {
			beercssDescription?: HTMLAttributes<HTMLElement>;
		}
	}
</script>

<script lang="ts">
	import { descriptionAttributes, getFormContext, type ComponentProps } from '@sjsf/form';

	const { description, config }: ComponentProps['description'] = $props();

	const ctx = getFormContext();
</script>

<em {...descriptionAttributes(ctx, config, 'beercssDescription', {})}>
	{description}
</em>
