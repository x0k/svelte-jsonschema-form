<script lang="ts">
	import type { WidgetProps } from '@sjsf/form';
	import Input, { type InputProps } from 'flowbite-svelte/Input.svelte';
	import Range, { type RangeProps } from 'flowbite-svelte/Range.svelte';

	let { value = $bindable(), attributes }: WidgetProps<'number'> = $props();
</script>

{#if attributes.type === 'range'}
	<Range bind:value {...attributes as RangeProps} />
{:else}
	<Input type="number" bind:value {...attributes as InputProps} />
{/if}
