<script lang="ts">
	import { enhance, formAttributes, getFormContext, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/form.svelte';

	let { config, children, ref = $bindable(), attributes }: ComponentProps['form'] = $props();

	const ctx = getFormContext();
</script>

<form
	bind:this={ref}
	use:enhance={ctx}
	class="flex flex-col gap-4"
	{...formAttributes(ctx, config, "form", attributes, {})}
>
	{@render children?.()}
</form>
