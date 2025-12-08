<script lang="ts" module>
	import type { HTMLInputAttributes } from 'svelte/elements';
	import '@sjsf/form/fields/extra-widgets/date-picker';

	declare module '@sjsf/form' {
		interface UiOptions {
			daisyui5PikadayCalendar?: HTMLInputAttributes;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';

	let {
		value = $bindable(),
		handlers,
		config
	}: ComponentProps['datePickerWidget'] = $props();

	const ctx = getFormContext();
</script>

<input
	{...inputAttributes(ctx, config, 'daisyui5PikadayCalendar', handlers, { type: 'date' })}
	bind:value
/>
