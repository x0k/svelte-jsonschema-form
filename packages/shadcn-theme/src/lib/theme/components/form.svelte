<script lang="ts">
	import { getFormContext, type ComponentProps } from '@sjsf/form';

	let { children, ref = $bindable(), config, attributes }: ComponentProps['form'] = $props();

	const ctx = getFormContext();
</script>

<form
	bind:this={ref}
	class="flex flex-col gap-4"
	{...attributes}
	onsubmit={ctx.submitHandler}
	onreset={ctx.resetHandler}
	{...config.uiOptions?.form}
	{...attributes}
>
	{@render children?.()}
</form>
