<script lang="ts" module>
	import type { InputProps } from '../types/input';

	declare module '@sjsf/form' {
		interface UiOptions {
			shadcnNumber?: InputProps;
		}
	}
</script>

<script lang="ts">
	import {
		Datalist,
		getFormContext,
		inputAttributes,
		retrieveAttributes,
		type ComponentProps
	} from '@sjsf/form';

	import { getThemeContext } from '../context';

	const ctx = getFormContext();
	const themeCtx = getThemeContext();

	const { Input } = $derived(themeCtx.components);

	let { value = $bindable(), config, handlers }: ComponentProps['numberWidget'] = $props();

	const attributes = $derived(
		retrieveAttributes(ctx, config, 'shadcnNumber', inputAttributes(handlers))
	);
</script>

<Input
	type="number"
	bind:value={() => value ?? null, (v) => (value = v ?? undefined)}
	{...attributes}
/>
<Datalist id={attributes.list} {config} />
