<script lang="ts" module>
	import type { InputProps } from '../types/input';

	declare module '@sjsf/form' {
		interface UiOptions {
			shadcnText?: InputProps;
		}
	}
</script>

<script lang="ts">
	import {
		Datalist,
		getFormContext,
		inputAttributes,
		retrieveInputAttributes,
		type ComponentProps
	} from '@sjsf/form';

	import { getThemeContext } from '../context';

	const ctx = getFormContext();
	const themeCtx = getThemeContext();

	const { Input } = $derived(themeCtx.components);

	let { value = $bindable(), config, handlers }: ComponentProps['textWidget'] = $props();

	const attributes = $derived(
		retrieveInputAttributes(ctx, config, 'shadcnText', inputAttributes(handlers))
	);
</script>

<Input bind:value {...attributes} />
<Datalist id={attributes.list} {config} />
