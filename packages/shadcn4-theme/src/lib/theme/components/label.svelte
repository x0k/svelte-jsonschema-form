<script lang="ts" module>
	import type { LabelProps } from '../types/label.js';

	declare module '@sjsf/form' {
		interface UiOptions {
			shadcn4Label?: LabelProps;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, labelAttributes, type ComponentProps } from '@sjsf/form';

	import { getThemeContext } from '../context.js';

	const { title, config }: ComponentProps['label'] = $props();

	const ctx = getFormContext();
	const themeCtx = getThemeContext();

	const { Label } = $derived(themeCtx.components);
</script>

<Label {...labelAttributes(ctx, config, 'shadcn4Label', {})}>
	{title}
	{#if config.required}
		<span>*</span>
	{/if}
</Label>
