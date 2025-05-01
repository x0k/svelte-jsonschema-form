<script lang="ts">
	import { enhance, formAttributes, getFormContext, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/form.svelte';

	let { children, attributes, ref = $bindable(), config }: ComponentProps['form'] = $props();

	const ctx = getFormContext();
</script>

<form
	bind:this={ref}
	use:enhance={ctx}
	class="flex flex-col gap-4"
	{...formAttributes('form', attributes)({}, config, ctx)}
>
	{@render children?.()}
</form>
