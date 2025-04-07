<script lang="ts">
	import { enhance, getFormContext, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/form.svelte';

	let { children, attributes, ref = $bindable(), config }: ComponentProps['form'] = $props();

	const ctx = getFormContext();
</script>

<form
	bind:this={ref}
	use:enhance={ctx}
	class="flex flex-col gap-4"
	{...config.uiOptions?.form}
	{...ctx.extraUiOptions?.('form', config)}
	{...attributes}
>
	{@render children?.()}
</form>
