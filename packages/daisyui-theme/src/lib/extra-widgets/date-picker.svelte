<script lang="ts">
	import { getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/extra-widgets/date-picker.svelte';

	let {
		handlers,
		value = $bindable(),
		config,
		errors
	}: ComponentProps['datePickerWidget'] = $props();

	const ctx = getFormContext();
</script>

<input
	type="date"
	bind:value
	class={['input input-bordered grow', errors.length > 0 && 'input-error']}
	{...inputAttributes('datePicker', handlers)({ type: 'date' }, config, ctx)}
/>
