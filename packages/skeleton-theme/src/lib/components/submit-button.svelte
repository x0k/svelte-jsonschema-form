<script lang="ts">
	import { defineDisabled, getFormContext, type ComponentProps } from '@sjsf/form';

	const { children, config }: ComponentProps['submitButton'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(defineDisabled(ctx, config.uiOptions?.submitButton ?? {}));
</script>

<button class="btn preset-filled preset-filled-primary-500 w-full" type="submit" {...attributes}>
	{@render children()}
</button>
