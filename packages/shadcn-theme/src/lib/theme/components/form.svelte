<script lang="ts">
	import { enhance, getFormContext, retrieveUiProps, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/form.svelte';

	let { children, ref = $bindable(), config, attributes }: ComponentProps['form'] = $props();

	const ctx = getFormContext();
</script>

<form
	bind:this={ref}
	use:enhance={ctx}
	class="flex flex-col gap-4"
	{...retrieveUiProps(ctx, config, 'form', {})}
	{...attributes}
>
	{@render children?.()}
</form>
