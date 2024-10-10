<script lang="ts">
	import type { ComponentProps } from '@sjsf/form';

	const { children, type, attributes, disabled, onclick }: ComponentProps<'button'> = $props();

	const isSubmit = $derived(type === 'submit');
  // const isControl = $derived
</script>

<button
	class="btn join-item"
  class:btn-sm={!isSubmit}
  class:btn-primary={isSubmit}
	type={isSubmit ? 'submit' : 'button'}
	{onclick}
	{...attributes}
	{disabled}
>
	{@render children()}
</button>
