<script lang="ts" module>
	import type { DatepickerProps } from 'flowbite-svelte/types';
	import '@sjsf/form/fields/extra-widgets/date-range-picker';

	declare module '@sjsf/form' {
		interface UiOptions {
			flowbite3DateRangePicker?: DatepickerProps;
		}
	}
</script>

<script lang="ts">
	import {
		customInputAttributes,
		getFormContext,
		getId,
		handlersAttachment,
		type ComponentProps
	} from '@sjsf/form';
	import Datepicker from 'flowbite-svelte/Datepicker.svelte';

	import { parseLocalDate, toLocalDate } from '$lib/local-date.js';
	let { value = $bindable(), config, handlers }: ComponentProps['dateRangePickerWidget'] = $props();

	const ctx = getFormContext();

	const id = $derived(getId(ctx, config.path));

	const parsed = $derived(
		value?.start
			? value.end
				? {
						start: parseLocalDate(value.start),
						end: parseLocalDate(value.end)
					}
				: { start: parseLocalDate(value.start) }
			: undefined
	);

	function onChange() {
		handlers.oninput?.();
		handlers.onchange?.();
	}
</script>

<div class="w-full">
	<Datepicker
		{...customInputAttributes(ctx, config, 'flowbite3DateRangePicker', {
			range: true,
			inputProps: handlersAttachment(handlers)({
				id,
				name: id
			}),
			required: config.required,
			showActionButtons: true,
			autohide: false,
			onseeked: onChange,
			onclear: onChange
		})}
		bind:rangeFrom={() => parsed?.start, (v) => (value = { ...value, start: v && toLocalDate(v) })}
		bind:rangeTo={() => parsed?.end, (v) => (value = { ...value, end: v && toLocalDate(v) })}
	/>
</div>
