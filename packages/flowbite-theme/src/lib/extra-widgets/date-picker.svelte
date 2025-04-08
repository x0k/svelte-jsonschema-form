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
	import { defineDisabled, getFormContext, type ComponentProps } from '@sjsf/form';
	import Datepicker from 'flowbite-svelte/Datepicker.svelte';

	let { value = $bindable(), config }: ComponentProps['datePickerWidget'] = $props();

	function parseLocalDate(date: string) {
		const [year, month, day] = date.split('-').map(Number);
		return new Date(year, month - 1, day);
	}

	const ctx = getFormContext();

	const attributes = $derived(
		defineDisabled(ctx, {
			required: config.required,
			...config.uiOptions?.flowbiteDatepicker,
			...ctx.extraUiOptions?.('flowbiteDatepicker', config)
		})
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
	<Datepicker bind:value={date.value} showActionButtons autohide={false} {...attributes} />
</div>
