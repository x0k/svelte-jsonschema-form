<script lang="ts" module>
	import type { InputProps } from '../types/input.js';

	declare module '@sjsf/form' {
		interface UiOptions {
			shadcnNumber?: InputProps;
		}
	}
</script>

<script lang="ts">
	import { Datalist, getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';

	import { getThemeContext } from '../context.js';

	const ctx = getFormContext();
	const themeCtx = getThemeContext();

	const { Input } = $derived(themeCtx.components);

	let { value = $bindable(), config, handlers }: ComponentProps['numberWidget'] = $props();

	const attributes = $derived(
		inputAttributes(ctx, config, 'shadcnNumber', handlers, { type: 'number' })
	);
</script>

<Input bind:value={() => value ?? null, (v) => (value = v ?? undefined)} {...attributes} />
<Datalist id={attributes.list} {config} />
