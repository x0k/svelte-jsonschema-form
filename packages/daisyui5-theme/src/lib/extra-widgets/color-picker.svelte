<script lang="ts">
	import { getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/extra-widgets/color-picker.svelte';

	let {
		handlers,
		value = $bindable(),
		config,
		errors
	}: ComponentProps['colorPickerWidget'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(
		inputAttributes(ctx, config, 'colorPicker', handlers, { type: 'color' })
	);
</script>

<input
	bind:value
	class={['input input-bordered w-full', errors.length > 0 && 'input-error']}
	{...attributes}
/>
