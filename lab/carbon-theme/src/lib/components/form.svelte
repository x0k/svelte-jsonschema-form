<script lang="ts">
	import { formAttributes, getFormContext, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/form.svelte';

	let { children, ref = $bindable(), config, attributes }: ComponentProps['form'] = $props();

	const ctx = getFormContext();
</script>

<form
	bind:this={ref}
	onsubmit={ctx.submit}
	onreset={ctx.reset}
	{...formAttributes(ctx, config, 'form', attributes, {
		style: 'display: flex; flex-direction: column; gap: 1rem'
	})}
>
	{@render children()}
</form>
