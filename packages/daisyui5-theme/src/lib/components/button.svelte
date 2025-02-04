<script lang="ts">
	import type { ComponentProps } from '@sjsf/form';

	const { children, type, attributes, disabled, onclick }: ComponentProps<'button'> = $props();

	const isSubmit = $derived(type === 'submit');
</script>

<button
	class={[
		"btn join-item",
		isSubmit ? "btn-primary w-full" : "btn-sm",
	]}
	type={isSubmit ? 'submit' : 'button'}
	{onclick}
	{...attributes}
	{disabled}
>
	{@render children()}
</button>
