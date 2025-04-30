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
	import {
		getFormContext,
		inputAttributes,
		retrieveInputAttributes,
		type ComponentProps
	} from '@sjsf/form';
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

	const attributes = $derived(
		retrieveInputAttributes(ctx, config, 'flowbiteFile', inputAttributes(handlers))
	);
</script>

<FileUpload
	bind:files={value}
	{multiple}
	data-loading={loading}
	data-processing={processing}
	{...attributes}
/>
