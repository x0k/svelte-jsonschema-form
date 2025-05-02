<script lang="ts" module>
	import type { DatepickerProps } from 'flowbite-svelte';
	import '@sjsf/form/fields/extra-widgets/date-picker';

	declare module '@sjsf/form' {
		interface UiOptions {
			flowbite3Datepicker?: DatepickerProps;
		}
	}
</script>

<script lang="ts">
	import {
		customInputAttributes,
		describedBy,
		getFormContext,
		type ComponentProps
	} from '@sjsf/form';
	import Datepicker from 'flowbite-svelte/Datepicker.svelte';

	let { value = $bindable(), config, handlers }: ComponentProps['datePickerWidget'] = $props();

	function parseLocalDate(date: string) {
		const [year, month, day] = date.split('-').map(Number);
		return new Date(year, month - 1, day);
	}

	const ctx = getFormContext();
</script>

<div class="w-full">
	<Datepicker
		bind:value={
			() => (value ? parseLocalDate(value) : undefined),
			(v) => (value = v?.toLocaleDateString('en-CA'))
		}
		{...customInputAttributes(ctx, config, 'flowbite3Datepicker', {
			id: config.id,
			required: config.required,
			showActionButtons: true,
			autohide: false,
			onselect: handlers.onchange,
			onclear: handlers.onchange,
			'aria-describedby': describedBy(ctx, config)
		})}
	/>
</div>
