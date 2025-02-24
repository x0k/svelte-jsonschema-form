<script lang="ts" module>
	import type { HTMLInputAttributes } from 'svelte/elements';
	declare module '@sjsf/form' {
		interface UiOptions {
			shadcnText?: HTMLInputAttributes;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';

	import { getThemeContext } from '../context';

	const ctx = getFormContext();
	const themeCtx = getThemeContext();

	const { Input } = $derived(themeCtx.components);

	let { value = $bindable(), config, handlers }: ComponentProps['textWidget'] = $props();

	const attributes = $derived(inputAttributes(ctx, config, handlers, config.uiOptions?.shadcnText));
</script>

<Input bind:value {...attributes} />
