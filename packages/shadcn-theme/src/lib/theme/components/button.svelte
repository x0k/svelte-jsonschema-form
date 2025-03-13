<script lang="ts">
	import { defineDisabled, getFormContext, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/button.svelte';

	import { getThemeContext } from '../context';

	const { children, disabled, onclick, config, type }: ComponentProps['button'] = $props();

	const ctx = getFormContext();
	const themeCtx = getThemeContext();
	const { Button } = $derived(themeCtx.components);

	const attributes = $derived(
		defineDisabled(ctx, {
			type: 'button' as const,
			onclick,
			disabled,
			...config.uiOptions?.button,
			...config.uiOptions?.buttons?.[type]
		})
	);
</script>

<Button {...attributes}>
	{@render children()}
</Button>
