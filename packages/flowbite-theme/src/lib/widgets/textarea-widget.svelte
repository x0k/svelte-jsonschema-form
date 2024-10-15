<script lang="ts">
	import type { WidgetProps } from '@sjsf/form';
	import Textarea, { type TextareaProps } from 'flowbite-svelte/Textarea.svelte';

	let { value = $bindable(), attributes }: WidgetProps<'textarea'> = $props();
</script>

<Textarea bind:value {...attributes as TextareaProps} />
