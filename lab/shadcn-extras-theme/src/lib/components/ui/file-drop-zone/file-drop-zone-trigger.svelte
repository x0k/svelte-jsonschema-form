<script lang="ts">
	import { cn } from '$lib/utils.js';
	import { useFileDropZoneTrigger } from '$lib/components/ui/file-drop-zone/file-drop-zone.svelte.js';
	import { displaySize } from '$lib/components/ui/file-drop-zone/index.js';
	import type { FileDropZoneTriggerProps } from '$lib/components/ui/file-drop-zone/types.js';
	import UploadIcon from '@lucide/svelte/icons/upload';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...rest
	}: FileDropZoneTriggerProps = $props();

	const triggerState = useFileDropZoneTrigger();
</script>

<label
	bind:this={ref}
	class={cn('group/file-drop-zone-trigger', className)}
	{...triggerState.props}
	{...rest}
>
	{#if children}
		{@render children()}
	{:else}
		<div
			class="flex h-48 flex-col place-items-center justify-center gap-2 rounded-lg border border-dashed p-6 transition-all group-aria-disabled/file-drop-zone-trigger:opacity-50 hover:cursor-pointer hover:bg-accent/25 group-aria-disabled/file-drop-zone-trigger:hover:cursor-not-allowed"
		>
			<div
				class="flex size-14 place-items-center justify-center rounded-full border border-dashed border-border text-muted-foreground"
			>
				<UploadIcon class="size-7" />
			</div>
			<div class="flex flex-col gap-0.5 text-center">
				<span class="font-medium text-muted-foreground">
					Drag 'n' drop files here, or click to select files
				</span>
				{#if triggerState.rootState.opts.maxFiles.current || triggerState.rootState.opts.maxFileSize.current}
					<span class="text-sm text-muted-foreground/75">
						{#if triggerState.rootState.opts.maxFiles.current}
							<span>
								You can upload {triggerState.rootState.opts.maxFiles.current} files
							</span>
						{/if}
						{#if triggerState.rootState.opts.maxFiles.current && triggerState.rootState.opts.maxFileSize.current}
							<span>
								(up to {displaySize(triggerState.rootState.opts.maxFileSize.current)} each)
							</span>
						{/if}
						{#if triggerState.rootState.opts.maxFileSize.current && !triggerState.rootState.opts.maxFiles.current}
							<span>
								Maximum size {displaySize(triggerState.rootState.opts.maxFileSize.current)}
							</span>
						{/if}
					</span>
				{/if}
			</div>
		</div>
	{/if}
</label>
