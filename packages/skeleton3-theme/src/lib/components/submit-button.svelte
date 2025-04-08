<script lang="ts">
	import { defineDisabled, getFormContext, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/submit-button.svelte';

	const { children, config }: ComponentProps['submitButton'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(
		defineDisabled(ctx, {
			...config.uiOptions?.submitButton,
			...ctx.extraUiOptions?.('submitButton', config)
		})
	);
</script>

<button class="btn preset-filled preset-filled-primary-500 w-full" type="submit" {...attributes}>
	{@render children()}
</button>
