<script lang="ts">
	import { type WidgetProps } from '@sjsf/form';
	import Input, { type InputProps } from 'flowbite-svelte/Input.svelte';

	let { value = $bindable(), attributes }: WidgetProps<'text'> = $props();

	const inputProps = $derived(attributes as InputProps);
</script>

<Input type="text" bind:value {...inputProps} />
