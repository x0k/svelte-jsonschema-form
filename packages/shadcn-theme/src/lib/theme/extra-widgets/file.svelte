<script lang="ts" module>
	import type { HTMLInputAttributes } from 'svelte/elements';
	import '@sjsf/form/fields/extra-widgets/file';

	declare module '@sjsf/form' {
		interface UiOptions {
			shadcnFile?: Omit<HTMLInputAttributes, 'type'>;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';

	import { getThemeContext } from '../context';

	const ctx = getFormContext();
	const themeCtx = getThemeContext();

	const { Input } = $derived(themeCtx.components);

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

<Input
	type="file"
	{multiple}
	data-loading={loading}
	data-processing={processing}
	{...attributes}
	bind:files={value}
/>
