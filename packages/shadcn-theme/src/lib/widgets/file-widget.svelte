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
	class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
	data-loading={loading}
	data-processing={processing}
	{...attributes}
/>
