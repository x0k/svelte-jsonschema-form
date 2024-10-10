<script lang="ts">
	import type { WidgetProps } from '@sjsf/form';

	let {
		attributes,
		multiple,
		loading,
		processing,
		value = $bindable(),
		errors
	}: WidgetProps<'file'> = $props();
</script>

<input
	type="file"
	bind:files={value}
	{multiple}
	class="file-input file-input-sm grow"
	class:file-input-error={errors.length}
	data-loading={loading}
	data-processing={processing}
	{...attributes}
/>
