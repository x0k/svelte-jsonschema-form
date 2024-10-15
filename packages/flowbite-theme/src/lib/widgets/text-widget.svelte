<script lang="ts">
	import { type WidgetProps } from '@sjsf/form';
	import Input, { type InputProps } from 'flowbite-svelte/Input.svelte';

	let { value = $bindable(), attributes }: WidgetProps<'text'> = $props();
</script>

<Input type="text" bind:value {...attributes as InputProps} />
