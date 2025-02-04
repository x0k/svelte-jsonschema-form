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
	class={['file-input w-full', errors.length > 0 && 'file-input-error']}
	data-loading={loading}
	data-processing={processing}
	{...attributes}
/>
