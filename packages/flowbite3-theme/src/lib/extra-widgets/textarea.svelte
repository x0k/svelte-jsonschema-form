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
	import { getFormContext, textareaAttributes, type ComponentProps } from '@sjsf/form';
	import Textarea from 'flowbite-svelte/Textarea.svelte';

	let { value = $bindable(), config, handlers }: ComponentProps['textareaWidget'] = $props();

	const ctx = getFormContext();
</script>

<Textarea
	bind:value
	{...textareaAttributes(ctx, config, 'flowbite3Textarea', handlers, { divClass: 'w-full' })}
/>
