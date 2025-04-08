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

	const attributes = $derived(
		inputAttributes(
			ctx,
			config,
			handlers,
			config.uiOptions?.file,
			ctx.extraUiOptions?.('file', config)
		)
	);
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
