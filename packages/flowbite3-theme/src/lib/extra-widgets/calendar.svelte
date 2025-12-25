<script lang="ts" module>
	import type { DatepickerProps } from 'flowbite-svelte/types';
	import '@sjsf/form/fields/extra-widgets/calendar';

	declare module '@sjsf/form' {
		interface UiOptions {
			flowbite3Calendar?: DatepickerProps;
		}
	}
</script>

<script lang="ts">
	import {
		customInputAttributes,
		getFormContext,
		handlersAttachment,
		getId,
		type ComponentProps
	} from '@sjsf/form';
	import Datepicker from 'flowbite-svelte/Datepicker.svelte';

	import { parseLocalDate, toLocalDate } from '$lib/local-date.js';

	let { value = $bindable(), config, handlers }: ComponentProps['calendarWidget'] = $props();

	const ctx = getFormContext();

	const id = $derived(getId(ctx, config.path));

	function onChange() {
		handlers.oninput?.();
		handlers.onchange?.();
	}
</script>

<Datepicker
	bind:value={
		() => (value ? parseLocalDate(value) : undefined), (v) => (value = v && toLocalDate(v))
	}
	{...customInputAttributes(ctx, config, 'flowbite3Calendar', {
		inputProps: handlersAttachment(handlers)({
			id,
			name: id
		}),
		required: config.required,
		showActionButtons: true,
		autohide: false,
		onselect: onChange,
		onclear: onChange,
		inline: true
	})}
/>
