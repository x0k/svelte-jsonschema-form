<script lang="ts">
	import type { WidgetProps } from '@sjsf/form';
	import Textarea, { type TextareaProps } from 'flowbite-svelte/Textarea.svelte';

	let { value = $bindable(), attributes }: WidgetProps<'textarea'> = $props();

	const textareaProps = $derived(attributes as TextareaProps);
</script>

<Textarea bind:value {...textareaProps} />
