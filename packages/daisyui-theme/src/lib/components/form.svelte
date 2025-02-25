<script lang="ts">
	import { getFormContext, type ComponentProps } from '@sjsf/form';

	let { children, attributes, ref = $bindable(), config }: ComponentProps['form'] = $props();

	const ctx = getFormContext();
</script>

<form
	bind:this={ref}
	onsubmit={ctx.submitHandler}
	onreset={ctx.resetHandler}
	class="flex flex-col gap-4"
	{...config.uiOptions?.form}
	{...attributes}
>
	{@render children?.()}
</form>
