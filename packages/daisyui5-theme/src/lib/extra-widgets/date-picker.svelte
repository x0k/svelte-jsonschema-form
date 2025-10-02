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
	import { getFormContext, inputAttributes, uiOptionProps, type ComponentProps } from '@sjsf/form';

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
				uiOptionProps('daisyui5PikadayCalendarOptions')(
					{
						field: input,
						blurFieldOnSelect: false,
						onSelect(date) {
							value = date.toLocaleDateString('en-CA');
						}
					},
					config,
					ctx
				)
			);
			return () => picker.destroy();
		});
	});

	const ctx = getFormContext();
</script>

<input
	bind:this={input}
	class={['input pika-single w-full', errors.length > 0 && 'input-error']}
	{...inputAttributes(ctx, config, 'daisyui5PikadayCalendar', handlers, { type: 'text', value })}
/>
