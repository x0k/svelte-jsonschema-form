<script lang="ts">
	import type { ComponentProps } from '@sjsf/form';

	const { children, type, attributes, disabled, onclick }: ComponentProps<'button'> = $props();

	const isSubmit = $derived(type === 'submit');
</script>

<button
	class="btn preset-filled"
  class:preset-filled-primary-500={isSubmit}
  class:w-full={isSubmit}
	type={isSubmit ? 'submit' : 'button'}
	{onclick}
	{...attributes}
	{disabled}
>
	{@render children()}
</button>
