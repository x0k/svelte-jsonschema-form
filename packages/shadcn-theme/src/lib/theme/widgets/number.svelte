<script lang="ts" module>
	import type { HTMLInputAttributes } from 'svelte/elements';

	declare module '@sjsf/form' {
		interface UiOptions {
			shadcnNumber?: HTMLInputAttributes;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';

	import { getThemeContext } from '../context';

	const ctx = getFormContext();
	const themeCtx = getThemeContext();

	const { Input } = $derived(themeCtx.components);

	let { value = $bindable(), config, handlers }: ComponentProps['numberWidget'] = $props();

	const attributes = $derived(
		inputAttributes(ctx, config, handlers, config.uiOptions?.shadcnNumber)
	);
</script>

<Input
	type="number"
	bind:value={() => value ?? null, (v) => (value = v ?? undefined)}
	{...attributes}
/>
