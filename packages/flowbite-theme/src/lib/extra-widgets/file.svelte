<script lang="ts" module>
	import type { FileuploadProps } from 'flowbite-svelte/Fileupload.svelte';
	import '@sjsf/form/fields/extra-widgets/file';

	declare module '@sjsf/form' {
		interface UiOptions {
			flowbiteFile?: FileuploadProps;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';
	import FileUpload from 'flowbite-svelte/Fileupload.svelte';

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

<FileUpload
	bind:files={value}
	{...inputAttributes(ctx, config, 'flowbiteFile', handlers, {
		multiple,
		'data-loading': loading,
		'data-processing': processing
	})}
/>
