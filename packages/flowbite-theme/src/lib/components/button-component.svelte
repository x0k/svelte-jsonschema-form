<script lang="ts">
	import type { ComponentProps } from '@sjsf/form';
	import Button, { type ButtonProps } from 'flowbite-svelte/Button.svelte';
	import ArrowUpOutline from 'flowbite-svelte-icons/ArrowUpOutline.svelte'
	import ArrowDownOutline from 'flowbite-svelte-icons/ArrowDownOutline.svelte'
	import TrashBinOutline from 'flowbite-svelte-icons/TrashBinOutline.svelte'
	import FileCopyOutline from 'flowbite-svelte-icons/FileCopyOutline.svelte'

	const { children, type, attributes, disabled, onclick }: ComponentProps<'button'> = $props();

	const isSubmit = $derived(type === 'submit');
</script>

<Button
	color={isSubmit ? 'primary' : 'alternative'}
	type={isSubmit ? 'submit' : 'button'}
	size={isSubmit ? 'md' : 'sm'}
	{onclick}
	{...attributes as ButtonProps}
	{disabled}
>
	{#if type === "array-item-move-up"}
		<ArrowUpOutline />
	{:else if type === "array-item-move-down"}
		<ArrowDownOutline />
	{:else if type === "array-item-remove" || type === "object-property-remove"}
		<TrashBinOutline />
	{:else if type === "array-item-copy"}
		<FileCopyOutline />
	{:else}
		{@render children()}
	{/if}
</Button>
