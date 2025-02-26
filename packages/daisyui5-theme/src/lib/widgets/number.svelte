<script lang="ts">
	import { getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';

	let { value = $bindable(), config, handlers, errors }: ComponentProps['numberWidget'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(inputAttributes(ctx, config, handlers, config.uiOptions?.number));

	const isRange = $derived(attributes.type === 'range');
</script>

<input
	type="number"
	bind:value
	class={[
		'w-full',
		isRange ? 'range' : 'input input-bordered',
		errors.length > 0 && (isRange ? 'range-error' : 'input-error')
	]}
	{...attributes}
/>
