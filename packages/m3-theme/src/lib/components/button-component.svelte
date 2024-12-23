<script lang="ts">
	import type { ComponentProps } from '@sjsf/form';
	import { Button } from 'm3-svelte'

	const { children, type, attributes, disabled, onclick }: ComponentProps<'button'> = $props();

	const isSubmit = $derived(type === 'submit');
</script>

<Button
	type="tonal"
	extraOptions={{
		...attributes,
		type: isSubmit ? 'submit' : 'button',
	}}
	on:click={(e) => {
		onclick?.(e)
	}}
	{disabled}
>
	{@render children()}
</Button>
