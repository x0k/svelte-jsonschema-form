<script lang="ts">
	import type { WidgetProps } from '@sjsf/form';

	import { getThemeContext } from '../context'

	const themeCtx = getThemeContext();

	const { FilesInput } = $derived(ctx.components)

	let {
		attributes,
		multiple,
		loading,
		processing,
		value = $bindable()
	}: WidgetProps<'file'> = $props();
</script>

<FilesInput
	bind:files={value}
	{multiple}
	data-loading={loading}
	data-processing={processing}
	{...attributes}
/>
