<script lang="ts">
	import { getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';

	let {
		config,
		handlers,
		multiple,
		loading,
		processing,
		value = $bindable()
	}: ComponentProps['fileWidget'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(
		inputAttributes(ctx, config, handlers, config.uiOptions?.file)
	);
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
