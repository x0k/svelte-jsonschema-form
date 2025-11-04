<script lang="ts">
	import { formAttributes, getFormContext, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/form.svelte';

	let { children, ref = $bindable(), attributes, config }: ComponentProps['form'] = $props();

	const ctx = getFormContext();
</script>

<form
	class="flex flex-col gap-4"
	onsubmit={ctx.submit}
	onreset={ctx.reset}
	bind:this={ref}
	{...formAttributes(ctx, config, 'form', attributes, {})}
>
	{@render children?.()}
</form>
