<script lang="ts">
	import { formAttributes, formHandlers, getFormContext, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/form.svelte';

	let { children, attributes, ref = $bindable(), config }: ComponentProps['form'] = $props();

	const ctx = getFormContext();
</script>

<form
	bind:this={ref}
	{@attach formHandlers(ctx)}
	class="flex flex-col gap-4"
	{...formAttributes(ctx, config, 'form', attributes, {})}
>
	{@render children?.()}
</form>
