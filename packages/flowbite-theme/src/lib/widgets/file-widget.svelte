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

</script>

<FileUpload
	bind:files={value}
	{multiple}
	data-loading={loading}
	data-processing={processing}
	{...attributes as FileuploadProps}
/>
