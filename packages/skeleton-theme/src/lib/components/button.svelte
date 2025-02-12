<script lang="ts" module>
	import type { HTMLButtonAttributes } from 'svelte/elements';

	declare module '@sjsf/form' {
		interface UiOptions {
			skeletonButton?: HTMLButtonAttributes;
		}
	}
</script>

<script lang="ts">
	import { defineDisabled, getFormContext, type ComponentProps } from '@sjsf/form';

	const { children, onclick, config }: ComponentProps['button'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(defineDisabled(ctx, config.uiOptions?.skeletonButton ?? {}));
</script>

<button class="btn preset-filled" type="button" {onclick} {...attributes}>
	{@render children()}
</button>
