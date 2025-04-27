<script lang="ts" module>
	import type { LabelProps } from '../types/label';

	declare module '@sjsf/form' {
		interface UiOptions {
			shadcnLabel?: LabelProps;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, retrieveUiProps, type ComponentProps } from '@sjsf/form';

	import { getThemeContext } from '../context';

	const { title, config }: ComponentProps['label'] = $props();

	const ctx = getFormContext();
	const themeCtx = getThemeContext();

	const { Label } = $derived(themeCtx.components);
</script>

<Label
	{...retrieveUiProps(ctx, config, 'shadcnLabel', {
		for: config.id
	})}
>
	{title}
	{#if config.required}
		<span>*</span>
	{/if}
</Label>
