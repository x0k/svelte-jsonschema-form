<script lang="ts">
	import { getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/extra-widgets/file.svelte';

	let {
		config,
		handlers,
		multiple,
		loading,
		processing,
		value = $bindable(),
		errors
	}: ComponentProps['fileWidget'] = $props();

	const ctx = getFormContext();
</script>

<input
	type="file"
	bind:files={value}
	class={['file-input grow', errors.length > 0 && 'file-input-error']}
	{...inputAttributes('file', handlers)(
		{
			multiple,
			'data-loading': loading,
			'data-processing': processing
		},
		config,
		ctx
	)}
/>
