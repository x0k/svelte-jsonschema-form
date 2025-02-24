<script lang="ts" module>
	import type { HTMLInputAttributes } from 'svelte/elements';

	declare module '@sjsf/form' {
		interface UiOptions {
			shadcnFile?: HTMLInputAttributes;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';

	import { getThemeContext } from '../context';

	const ctx = getFormContext();
	const themeCtx = getThemeContext();

	const { FilesInput } = $derived(themeCtx.components);

	let {
		config,
		handlers,
		multiple,
		loading,
		processing,
		value = $bindable()
	}: ComponentProps['fileWidget'] = $props();

	const attributes = $derived(inputAttributes(ctx, config, handlers, config.uiOptions?.shadcnFile));
</script>

<FilesInput
	bind:files={value}
	{multiple}
	data-loading={loading}
	data-processing={processing}
	{...attributes}
/>
