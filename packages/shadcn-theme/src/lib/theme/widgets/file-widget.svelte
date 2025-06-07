<script lang="ts">
	import type { WidgetProps } from '@sjsf/form';

	import { getThemeContext } from '../context';

	const ctx = getThemeContext();

	const { FilesInput } = $derived(ctx.components);

	let {
		attributes,
		multiple,
		loading,
		processing,
		value = $bindable()
	}: WidgetProps<'file'> = $props();
</script>

<FilesInput
	{multiple}
	data-loading={loading}
	data-processing={processing}
	{...attributes}
	bind:files={value}
/>
