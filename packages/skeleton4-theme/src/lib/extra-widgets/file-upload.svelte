<script lang="ts" module>
	import { untrack } from 'svelte';
	import type { WidgetCommonProps } from '@sjsf/form/fields/widgets';
	import { type FileUploadRootProviderProps, useFileUpload } from '@skeletonlabs/skeleton-svelte';

	declare module '@sjsf/form' {
		interface ComponentProps {
			skeleton4FileUploadWidget: WidgetCommonProps<FileList> & {
				multiple: boolean;
				loading: boolean;
				processing: boolean;
			};
		}
		interface ComponentBindings {
			skeleton4FileUploadWidget: 'value';
		}
		interface UiOptions {
			skeleton4FileUpload?: Omit<FileUploadRootProviderProps, 'value'>;
		}
	}
</script>

<script lang="ts">
	import { customInputAttributes, getFormContext, getId, type ComponentProps } from '@sjsf/form';
	import { FileUpload } from '@skeletonlabs/skeleton-svelte';

	let {
		config,
		handlers,
		multiple,
		value = $bindable(),
		errors
	}: ComponentProps['skeleton4FileUploadWidget'] = $props();

	const ctx = getFormContext();

	const id = $derived(getId(ctx, config.path));

	const componentId = $props.id();

	const api = useFileUpload(() => ({
		id: componentId,
		ids: {
			hiddenInput: id
		},
		name: id,
		invalid: errors.length > 0,
		required: config.required,
		maxFiles: config.schema.maxItems ?? (multiple ? Infinity : 1),
		onFileChange: handlers.onchange,
		onFileAccept: ({ files }) => {
			if (files.length === 0 && lastFiles === undefined) {
				return;
			}
			const data = new DataTransfer();
			for (const file of files) {
				data.items.add(file);
			}
			value = lastFiles = data.files;
		}
	}));

	let lastFiles: FileList | undefined;

	function areFilesEqual(fl1: FileList | undefined, fl2: FileList | undefined) {
		if (fl1 === fl2) {
			return true;
		}
		if (fl1 === undefined || fl2 === undefined || fl1.length !== fl2.length) {
			return false;
		}
		for (let i = 0; i < fl1.length; i++) {
			if (fl1.item(i) !== fl2.item(i)) {
				return false;
			}
		}
		return true;
	}

	$effect(() => {
		if (areFilesEqual(value, lastFiles)) {
			return;
		}
		untrack(() => {
			const a = api();
			if (value === undefined) {
				lastFiles = undefined;
				a.clearFiles();
			} else {
				// Looks like `type` and `lastModified` props are modified by zag,
				const toAdd = Array.from(value).filter(
					(fl) =>
						a.acceptedFiles.find((f) => fl.name === f.name && fl.size === f.size) === undefined
				);
				if (toAdd.length > 0) {
					a.setFiles(toAdd);
				}
			}
		});
	});
</script>

<FileUpload.Provider
	class="w-full"
	value={api}
	{...customInputAttributes(ctx, config, 'skeleton4FileUpload', {})}
>
	<FileUpload.Dropzone>
		<span>Select file or drag here.</span>
		<FileUpload.Trigger>Browse Files</FileUpload.Trigger>
		<FileUpload.HiddenInput data-testid="hidden-input" />
	</FileUpload.Dropzone>
	<FileUpload.ItemGroup>
		<FileUpload.Context>
			{#snippet children(fileUpload)}
				{#each fileUpload().acceptedFiles as file (file)}
					<FileUpload.Item {file}>
						<FileUpload.ItemName>{file.name}</FileUpload.ItemName>
						<FileUpload.ItemSizeText>{file.size} bytes</FileUpload.ItemSizeText>
						<FileUpload.ItemDeleteTrigger />
					</FileUpload.Item>
				{/each}
			{/snippet}
		</FileUpload.Context>
	</FileUpload.ItemGroup>
</FileUpload.Provider>
