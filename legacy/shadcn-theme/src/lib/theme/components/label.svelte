<script lang="ts" module>
	import type { LabelProps } from '../types/label';

	declare module '@sjsf/form' {
		interface UiOptions {
			shadcnLabel?: LabelProps;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, labelAttributes, type ComponentProps } from '@sjsf/form';

	import { getThemeContext } from '../context';

	const { title, config }: ComponentProps['label'] = $props();

	const ctx = getFormContext();
	const themeCtx = getThemeContext();

	const { Label } = $derived(themeCtx.components);
</script>

<Label {...labelAttributes(ctx, config, 'shadcnLabel', {})}>
	{title}
	{#if config.required}
		<span>*</span>
	{/if}
</Label>
