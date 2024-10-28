<script lang="ts">
	import type { ComponentProps } from '@sjsf/form';
	
	import { getThemeContext } from '../context';

	const { children, type, attributes, disabled, onclick }: ComponentProps<'button'> = $props();

	const ctx = getThemeContext();
	const { Button } = $derived(ctx.components)

	const isSubmit = $derived(type === 'submit');
</script>

<Button type={isSubmit ? 'submit' : 'button'} {onclick} {...attributes} {disabled}>
	{@render children()}
</Button>
