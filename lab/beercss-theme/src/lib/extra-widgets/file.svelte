<script lang="ts">
	import { getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/extra-widgets/file.svelte';

	let {
		config,
		handlers,
		multiple,
		loading,
		processing,
		value = $bindable()
	}: ComponentProps['fileWidget'] = $props();

	const ctx = getFormContext();
</script>

<input
	{...inputAttributes(ctx, config, 'file', handlers, {
		multiple,
		'data-loading': loading,
		'data-processing': processing
	})}
	type="file"
	bind:files={value}
/>
<input type="text" />
