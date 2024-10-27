<script lang="ts">
	import type { ComponentProps } from '@sjsf/form';
	import { Button, type ButtonProps } from './ui/button';

	const { children, type, attributes, disabled, onclick }: ComponentProps<'button'> = $props();

	const isSubmit = $derived(type === 'submit');
</script>

<Button type={isSubmit ? 'submit' : 'button'} {onclick} {...attributes as ButtonProps} {disabled}>
	{@render children()}
</Button>
<!-- <button
	class="btn preset-filled"
  class:preset-filled-primary-500={isSubmit}
  class:w-full={isSubmit}
	type={isSubmit ? 'submit' : 'button'}
	{onclick}
	{...attributes}
	{disabled}
>
	{@render children()}
</button> -->
