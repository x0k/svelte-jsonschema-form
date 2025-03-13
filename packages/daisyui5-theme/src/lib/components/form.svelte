<script lang="ts">
	import { enhance, getFormContext, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/components/form.svelte';

	let { children, ref = $bindable(), attributes, config }: ComponentProps['form'] = $props();

	const ctx = getFormContext();
</script>

<form
	class="flex flex-col gap-4"
	use:enhance={ctx}
	bind:this={ref}
	{...config.uiOptions?.form}
	{...attributes}
>
	{@render children?.()}
</form>
