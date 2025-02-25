<script lang="ts">
	import { defineDisabled, getFormContext, type ComponentProps } from '@sjsf/form';

	const { children, config }: ComponentProps['submitButton'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(defineDisabled(ctx, config.uiOptions?.submitButton ?? {}));
</script>

<button class="btn btn-primary w-full" type="submit" {...attributes}>
	{@render children()}
</button>
