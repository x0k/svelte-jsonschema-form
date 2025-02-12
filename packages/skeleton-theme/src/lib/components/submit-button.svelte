<script lang="ts" module>
	import type { HTMLButtonAttributes } from 'svelte/elements';

	declare module '@sjsf/form' {
		interface UiOptions {
			skeletonSubmitButton?: HTMLButtonAttributes;
		}
	}
</script>

<script lang="ts">
	import { defineDisabled, getFormContext, type ComponentProps } from '@sjsf/form';

	const { children, config }: ComponentProps['submitButton'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(defineDisabled(ctx, config.uiOptions?.skeletonSubmitButton ?? {}));
</script>

<button class="btn preset-filled preset-filled-primary-500 w-full" type="submit" {...attributes}>
	{@render children()}
</button>
