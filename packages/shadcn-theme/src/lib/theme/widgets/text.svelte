<script lang="ts" module>
	import type { HTMLInputAttributes, HTMLInputTypeAttribute } from 'svelte/elements';

	type InputType = Exclude<HTMLInputTypeAttribute, 'file'>;
	declare module '@sjsf/form' {
		interface UiOptions {
			shadcnText?: Omit<HTMLInputAttributes, 'type'> & { type?: InputType; files?: undefined };
		}
	}
</script>

<script lang="ts">
	import { Datalist, getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';

	import { getThemeContext } from '../context';

	const ctx = getFormContext();
	const themeCtx = getThemeContext();

	const { Input } = $derived(themeCtx.components);

	let { value = $bindable(), config, handlers }: ComponentProps['textWidget'] = $props();

	const attributes = $derived(inputAttributes(ctx, config, handlers, config.uiOptions?.shadcnText));
</script>

<Input bind:value {...attributes} />
<Datalist id={attributes.list} {config} />
