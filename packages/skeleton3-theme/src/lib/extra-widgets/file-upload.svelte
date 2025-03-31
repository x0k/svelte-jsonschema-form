<script lang="ts" module>
	import { untrack, type ComponentProps as SvelteComponentProps } from 'svelte';
	import { FileUpload } from '@skeletonlabs/skeleton-svelte';
	import '@sjsf/form/fields/extra-widgets/file-widget';

	declare module '@sjsf/form' {
		interface UiOptions {
			skeleton3FileUpload?: SvelteComponentProps<typeof FileUpload>;
		}
	}
</script>

<script lang="ts">
	import { type FileUploadApi } from '@skeletonlabs/skeleton-svelte';
	import { defineDisabled, getFormContext, type ComponentProps } from '@sjsf/form';

	let { config, handlers, multiple, value = $bindable(), errors }: ComponentProps['fileWidget'] = $props();

	const ctx = getFormContext();

	let lastFiles: FileList | undefined;
	const attributes: SvelteComponentProps<typeof FileUpload> = $derived(
		defineDisabled(ctx, {
			ids: {
				root: config.id
			},
			invalid: errors.length > 0,
			name: config.name,
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
			},
			...config.uiOptions?.skeleton3FileUpload
		})
	);

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

	let isApiReady = $state.raw(false);
	let api: FileUploadApi;
	$effect(() => {
		if (isApiReady === false || areFilesEqual(value, lastFiles)) {
			return;
		}
		untrack(() => {
			if (value == undefined) {
				lastFiles = undefined;
				api.clearFiles();
			} else {
				// Looks like `type` and `lastModified` props are modified by zag,
				const toAdd = Array.from(value).filter(
					(fl) =>
						api.acceptedFiles.find((f) => fl.name === f.name && fl.size === f.size) === undefined
				);
				if (toAdd.length > 0) {
					api.setFiles(toAdd);
				}
			}
		});
	});
</script>

<FileUpload
	classes="w-full"
	{...attributes}
	onApiReady={(a) => {
		api = a;
		isApiReady = true;
	}}
/>
