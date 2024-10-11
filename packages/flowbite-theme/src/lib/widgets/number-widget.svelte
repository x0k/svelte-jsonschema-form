<script lang="ts">
	import type { WidgetProps } from '@sjsf/form';
	import Input, { type InputProps } from 'flowbite-svelte/Input.svelte';
	import Range from 'flowbite-svelte/Range.svelte';

	let { value = $bindable(), attributes }: WidgetProps<'number'> = $props();

	const inputProps = $derived(attributes as InputProps);
</script>

{#if attributes.type === 'range'}
	<span class="min-w-min w-14 px-4">
		{value}
	</span>
	<Range bind:value {...inputProps} />
{:else}
	<Input type="number" bind:value {...inputProps} />
{/if}
