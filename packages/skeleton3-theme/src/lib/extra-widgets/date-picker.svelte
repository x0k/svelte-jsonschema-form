<script lang="ts">
	import { getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/extra-widgets/date-picker.svelte';

	let { value = $bindable(), config, handlers }: ComponentProps['datePickerWidget'] = $props();

	const ctx = getFormContext();
</script>

<input
	bind:value
	class="input"
	{...inputAttributes(ctx, config, 'datePicker', handlers, { type: 'date' })}
/>
