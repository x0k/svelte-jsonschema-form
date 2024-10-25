<script lang="ts">
	import type { WidgetProps } from '@sjsf/form';

	let {
		attributes,
		multiple,
		loading,
		processing,
		value = $bindable()
	}: WidgetProps<'file'> = $props();
</script>

<input
	type="file"
	bind:files={value}
	{multiple}
	class="input"
	data-loading={loading}
	data-processing={processing}
	{...attributes}
/>
