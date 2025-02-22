<script lang="ts">
	import { defineDisabled, getFormContext, type ComponentProps } from '@sjsf/form';

	import { getThemeContext } from '../context';

	const { children, config }: ComponentProps['submitButton'] = $props();

	const ctx = getFormContext();
	const themeCtx = getThemeContext();
	const { Button } = $derived(themeCtx.components);

	const attributes = $derived(defineDisabled(ctx, config.uiOptions?.submitButton ?? {}));
</script>

<Button type="submit" {...attributes}>
	{@render children()}
</Button>
