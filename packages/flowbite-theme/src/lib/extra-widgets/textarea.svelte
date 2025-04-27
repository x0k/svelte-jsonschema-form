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
	import {
		getFormContext,
		retrieveAttributes,
		textareaAttributes,
		type ComponentProps
	} from '@sjsf/form';
	import Textarea from 'flowbite-svelte/Textarea.svelte';

	let { value = $bindable(), config, handlers }: ComponentProps['textareaWidget'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(
		retrieveAttributes(ctx, config, 'flowbiteTextarea', textareaAttributes(handlers))
	);
</script>

<Textarea bind:value {...attributes} />
