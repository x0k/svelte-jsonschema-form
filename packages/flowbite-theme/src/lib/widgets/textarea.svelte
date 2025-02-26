<script lang="ts" module>
	import type { TextareaProps } from 'flowbite-svelte/Textarea.svelte';
	import type { WidgetCommonProps } from '@sjsf/legacy-fields/exports';

	declare module '@sjsf/form' {
		interface ComponentProps {
			flowbiteTextareaWidget: WidgetCommonProps<string>;
		}
		interface ComponentBindings {
			flowbiteTextareaWidget: 'value';
		}
		interface UiOptions {
			flowbiteTextarea?: TextareaProps;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, textareaAttributes, type ComponentProps } from '@sjsf/form';
	import Textarea from 'flowbite-svelte/Textarea.svelte';

	let {
		value = $bindable(),
		config,
		handlers
	}: ComponentProps['flowbiteTextareaWidget'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(
		textareaAttributes(ctx, config, handlers, config.uiOptions?.flowbiteTextarea)
	);
</script>

<Textarea bind:value {...attributes} />
