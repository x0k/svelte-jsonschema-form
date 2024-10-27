<script lang="ts">
	import type { ComponentProps } from '@sjsf/form';
	import { Button, type ButtonProps } from './ui/button';

	const { children, type, attributes, disabled, onclick }: ComponentProps<'button'> = $props();

	const isSubmit = $derived(type === 'submit');
</script>

<Button type={isSubmit ? 'submit' : 'button'} {onclick} {...attributes as ButtonProps} {disabled}>
	{@render children()}
</Button>
