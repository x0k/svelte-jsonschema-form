<script lang="ts" module>
	import type { DatepickerProps } from 'flowbite-svelte/Datepicker.svelte';
	import '@sjsf/form/fields/extra-widgets/date-picker';

	declare module '@sjsf/form' {
		interface UiOptions {
			flowbiteDatepicker?: DatepickerProps;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, retrieveInputAttributes, type ComponentProps } from '@sjsf/form';
	import Datepicker from 'flowbite-svelte/Datepicker.svelte';

	let { value = $bindable(), config }: ComponentProps['datePickerWidget'] = $props();

	function parseLocalDate(date: string) {
		const [year, month, day] = date.split('-').map(Number);
		return new Date(year, month - 1, day);
	}

	const ctx = getFormContext();

	const attributes = $derived(
		retrieveInputAttributes(ctx, config, 'flowbiteDatepicker', () => ({
			showActionButtons: true,
			autohide: false,
			required: config.required
		}))
	);
</script>

<div class="w-full">
	<Datepicker
		bind:value={
			() => (value ? parseLocalDate(value) : null),
			(v) => {
				if (!v) {
					value = undefined;
					return;
				}
				value = v.toLocaleDateString('en-CA');
			}
		}
		{...attributes}
	/>
</div>
