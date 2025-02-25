<script lang="ts">
	import { getFormContext, type ComponentProps } from '@sjsf/form';

	let { children, ref = $bindable(), attributes, config }: ComponentProps['form'] = $props();

	const ctx = getFormContext();
</script>

<form
	class="flex flex-col gap-4"
	onsubmit={ctx.submitHandler}
	onreset={ctx.resetHandler}
	bind:this={ref}
	{...config.uiOptions?.form}
	{...attributes}
>
	{@render children?.()}
</form>
