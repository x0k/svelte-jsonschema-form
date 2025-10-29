<script lang="ts" module>
	import type { Component } from 'svelte';
	import type { WidgetCommonProps } from '@sjsf/form/fields/widgets';

	import type { FileDropZoneProps } from '$lib/components/ui/file-drop-zone/index.js';

	declare module '@sjsf/form' {
		interface ComponentProps {
			shadcnExtrasFileDropZoneWidget: WidgetCommonProps<FileList> & {
				multiple: boolean;
				loading: boolean;
				processing: boolean;
			};
		}
		interface ComponentBindings {
			shadcnExtrasFileDropZoneWidget: 'value';
		}
		interface UiOptions {
			shadcnExtrasFileDropZone?: Omit<FileDropZoneProps, 'onUpload'>;
		}
	}

	declare module '@sjsf/shadcn4-theme' {
		interface ThemeComponents {
			FileDropZone?: Component<FileDropZoneProps>;
		}
	}
</script>

<script lang="ts">
	import XIcon from '@lucide/svelte/icons/x';
	import { createId, customInputAttributes, getFormContext, type ComponentProps } from '@sjsf/form';
	import { getThemeContext } from '@sjsf/shadcn4-theme';

	import { displaySize } from '$lib/components/ui/file-drop-zone/index.js';

	let {
		value = $bindable(),
		config,
		multiple
	}: ComponentProps['shadcnExtrasFileDropZoneWidget'] = $props();

	const ctx = getFormContext();
	const themeCtx = getThemeContext();

	const { Button, FileDropZone } = $derived(themeCtx.components);

	const id = $derived(createId(ctx, config.path));

	async function onUpload(files: File[]) {
		const data = new DataTransfer();
		if (value) {
			for (const file of value) {
				data.items.add(file);
			}
		}
		for (const file of files) {
			data.items.add(file);
		}
		value = data.files;
	}
</script>

<div class="flex w-full flex-col gap-2 p-6">
	<FileDropZone
		{onUpload}
		fileCount={value?.length ?? 0}
		{...customInputAttributes(ctx, config, 'shadcnExtrasFileDropZone', {
			maxFiles: multiple ? config.schema.maxItems : 1
		})}
	/>
	<input name={id} {id} type="file" bind:files={value} class="hidden" />
	<div class="flex flex-col gap-2">
		{#each value as file, i (file)}
			<div class="flex place-items-center justify-between gap-2">
				<div class="flex place-items-center gap-2">
					<div class="flex flex-col">
						<span>{file.name}</span>
						<span class="text-xs text-muted-foreground">{displaySize(file.size)}</span>
					</div>
				</div>
				<Button
					variant="outline"
					size="icon"
					onclick={() => {
						if (!value) {
							return;
						}
						const data = new DataTransfer();
						for (let j = 0; j < value.length; j++) {
							if (j !== i) {
								data.items.add(value[j]);
							}
						}
						value = data.files;
					}}
				>
					<XIcon />
				</Button>
			</div>
		{/each}
	</div>
</div>
