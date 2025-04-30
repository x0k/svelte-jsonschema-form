<script lang="ts" module>
	import type { TextareaProps } from 'flowbite-svelte';
	import '@sjsf/form/fields/extra-widgets/textarea';

	declare module '@sjsf/form' {
		interface UiOptions {
			flowbite3Textarea?: TextareaProps;
		}
	}
</script>

<script lang="ts">
	import {
		getFormContext,
		retrieveInputAttributes,
		textareaAttributes,
		type ComponentProps,
	} from '@sjsf/form';
	import Textarea from 'flowbite-svelte/Textarea.svelte';

	let { value = $bindable(), config, handlers }: ComponentProps['textareaWidget'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(
		retrieveInputAttributes(ctx, config, 'flowbite3Textarea', textareaAttributes(handlers))
	);
</script>

<Textarea bind:value {...attributes} />
