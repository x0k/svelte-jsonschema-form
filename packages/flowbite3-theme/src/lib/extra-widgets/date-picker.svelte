<script lang="ts" module>
	import type { DatepickerProps } from 'flowbite-svelte/types';
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
		handlersAttachment,
		idFromPath,
		type ComponentProps
	} from '@sjsf/form';
	import Datepicker from 'flowbite-svelte/Datepicker.svelte';

	let { value = $bindable(), config, handlers }: ComponentProps['datePickerWidget'] = $props();

	function parseLocalDate(date: string) {
		const [year, month, day] = date.split('-').map(Number);
		return new Date(year, month - 1, day);
	}

	const ctx = getFormContext();

	const id = $derived(idFromPath(ctx, config.path));

	function onChange() {
		handlers.oninput?.();
		handlers.onchange?.();
	}
</script>

<div class="w-full">
	<Datepicker
		bind:value={
			() => (value ? parseLocalDate(value) : undefined),
			(v) => (value = v?.toLocaleDateString('en-CA'))
		}
		{...customInputAttributes(ctx, config, 'flowbite3Datepicker', {
			inputProps: handlersAttachment(handlers)({
				id,
				name: id
			}),
			required: config.required,
			showActionButtons: true,
			autohide: false,
			onselect: onChange,
			onclear: onChange,
			'aria-describedby': describedBy(ctx, config)
		})}
	/>
</div>
