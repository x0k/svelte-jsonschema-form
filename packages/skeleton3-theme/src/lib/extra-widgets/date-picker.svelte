<script lang="ts">
	import { getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';
	import '@sjsf/basic-theme/extra-widgets/date-picker.svelte';

	let { value = $bindable(), config, handlers }: ComponentProps['datePickerWidget'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(
		inputAttributes(
			ctx,
			config,
			handlers,
			config.uiOptions?.datePicker,
			ctx.extraUiOptions?.('datePicker', config)
		)
	);
</script>

<input type="date" bind:value class="input" {...attributes} />
