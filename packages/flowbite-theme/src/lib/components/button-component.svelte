<script lang="ts">
	import type { ComponentProps } from '@sjsf/form';
	import Button, { type ButtonProps } from 'flowbite-svelte/Button.svelte';

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
	{@render children()}
</Button>
