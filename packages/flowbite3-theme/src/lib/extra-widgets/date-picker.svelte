<script lang="ts" module>
	import type { DatepickerProps } from 'flowbite-svelte';
	import '@sjsf/form/fields/extra-widgets/date-picker';

	declare module '@sjsf/form' {
		interface UiOptions {
			flowbite3Datepicker?: Partial<DatepickerProps>;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, retrieveAttributes, type ComponentProps } from '@sjsf/form';
	import Datepicker from 'flowbite-svelte/Datepicker.svelte';

	let { value = $bindable(), config }: ComponentProps['datePickerWidget'] = $props();

	function parseLocalDate(date: string) {
		const [year, month, day] = date.split('-').map(Number);
		return new Date(year, month - 1, day);
	}

	const ctx = getFormContext();

	const attributes = $derived(
		retrieveAttributes(ctx, config, 'flowbite3Datepicker', () => ({
			required: config.required,
			showActionButtons: true,
			autohide: false
		}))
	);

	const date = {
		get value() {
			return value ? parseLocalDate(value) : null;
		},
		set value(v) {
			if (!v) {
				value = undefined;
				return;
			}
			value = v.toLocaleDateString('en-CA');
		}
	};
</script>

<div class="w-full">
	<Datepicker bind:value={date.value} {...attributes as any} />
</div>
