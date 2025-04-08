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

	let {
		value = $bindable(),
		handlers,
		errors,
		config
	}: ComponentProps['datePickerWidget'] = $props();

	let input: HTMLInputElement;
	$effect(() => {
		import('pikaday').then(({ default: Pikaday }) => {
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
				...config.uiOptions?.daisyui5PikadayCalendarOptions,
				...ctx.extraUiOptions?.('daisyui5PikadayCalendarOptions', config)
			});
			return () => picker.destroy();
		});
	});

	const ctx = getFormContext();

	const attributes = $derived(
		inputAttributes(
			ctx,
			config,
			handlers,
			config.uiOptions?.daisyui5PikadayCalendar,
			ctx.extraUiOptions?.('daisyui5PikadayCalendar', config)
		)
	);
</script>

<input
	bind:this={input}
	type="text"
	{value}
	class={['input pika-single w-full', errors.length > 0 && 'input-error']}
	{...attributes}
/>
