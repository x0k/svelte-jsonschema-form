<script lang="ts" module>
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { PikadayOptions } from 'pikaday';
	import '@sjsf/form/fields/extra-widgets/date-picker';

	declare module '@sjsf/form' {
		interface UiOptions {
			daisyui5PikadayCalendar?: HTMLInputAttributes;
			daisyui5PikadayCalendarOptions?: PikadayOptions;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';
	import Pikaday from 'pikaday';

	let {
		value = $bindable(),
		handlers,
		errors,
		config
	}: ComponentProps['datePickerWidget'] = $props();

	let input: HTMLInputElement | undefined;
	$effect(() => {
		if (!input) {
			return;
		}
		const format = new Intl.DateTimeFormat('en-CA', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit'
		});
		const picker = new Pikaday({
			field: input,
			onSelect(date) {
				value = format.format(date);
			},
			...config.uiOptions?.daisyui5PikadayCalendarOptions
		});
		return () => picker.destroy();
	});

	const ctx = getFormContext();

	const attributes = $derived(
		inputAttributes(ctx, config, handlers, config.uiOptions?.daisyui5PikadayCalendar)
	);
</script>

<input
	bind:this={input}
	type="text"
	{value}
	class={['input pika-single w-full', errors.length > 0 && 'input-error']}
	{...attributes}
/>
