<script lang="ts">
	import { Datalist, getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';

	let { handlers, value = $bindable(), config, errors }: ComponentProps['textWidget'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(inputAttributes(ctx, config, handlers, config.uiOptions?.text));
</script>

<input
	type="text"
	bind:value
	class={['input input-bordered grow', errors.length > 0 && 'input-error']}
	{...attributes}
/>
<Datalist id={attributes.list} {config} />
