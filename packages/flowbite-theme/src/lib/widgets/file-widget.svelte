<script lang="ts">
	import type { WidgetProps } from '@sjsf/form';
	import FileUpload, { type FileuploadProps } from 'flowbite-svelte/Fileupload.svelte';

	let {
		attributes,
		multiple,
		loading,
		processing,
		value = $bindable(),
	}: WidgetProps<'file'> = $props();

	const fileUploadProps = $derived(attributes as FileuploadProps);
</script>

<FileUpload
	bind:files={value}
	{multiple}
	data-loading={loading}
	data-processing={processing}
	{...fileUploadProps}
/>
