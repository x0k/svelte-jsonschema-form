<script lang="ts" module>
	import type { TextareaProps } from 'flowbite-svelte/Textarea.svelte';
	import '@sjsf/form/fields/extra-widgets/textarea';

	declare module '@sjsf/form' {
		interface UiOptions {
			flowbiteTextarea?: TextareaProps;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, textareaAttributes, type ComponentProps } from '@sjsf/form';
	import Textarea from 'flowbite-svelte/Textarea.svelte';

	let { value = $bindable(), config, handlers }: ComponentProps['textareaWidget'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(
		textareaAttributes(
			ctx,
			config,
			handlers,
			config.uiOptions?.flowbiteTextarea,
			ctx.extraUiOptions?.('flowbiteTextarea', config)
		)
	);
</script>

<Textarea bind:value {...attributes} />
