<script lang="ts">
	import { formAttributes, formHandlers, getFormContext, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/form.svelte';

	let { children, ref = $bindable(), attributes, config }: ComponentProps['form'] = $props();

	const ctx = getFormContext();
</script>

<form
	class="flex flex-col gap-4"
	{@attach formHandlers(ctx)}
	bind:this={ref}
	{...formAttributes(ctx, config, 'form', attributes, {})}
>
	{@render children?.()}
</form>
