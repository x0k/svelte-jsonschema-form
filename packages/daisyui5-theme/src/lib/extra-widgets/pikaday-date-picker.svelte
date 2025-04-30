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
	import {
		getFormContext,
		inputAttributes,
		retrieveAttributes,
		retrieveUiProps,
		type ComponentProps
	} from '@sjsf/form';

	let {
		value = $bindable(),
		handlers,
		errors,
		config
	}: ComponentProps['datePickerWidget'] = $props();

	let input: HTMLInputElement;
	$effect(() => {
		import('pikaday').then(({ default: Pikaday }) => {
			const picker = new Pikaday(
				retrieveUiProps(ctx, config, 'daisyui5PikadayCalendarOptions', {
					field: input,
					blurFieldOnSelect: false,
					onSelect(date) {
						value = date.toLocaleDateString('en-CA');
					}
				})
			);
			return () => picker.destroy();
		});
	});

	const ctx = getFormContext();

	const attributes = $derived(
		retrieveAttributes(ctx, config, 'daisyui5PikadayCalendar', inputAttributes(handlers))
	);
</script>

<input
	bind:this={input}
	type="text"
	{value}
	class={['input pika-single w-full', errors.length > 0 && 'input-error']}
	{...attributes}
/>
