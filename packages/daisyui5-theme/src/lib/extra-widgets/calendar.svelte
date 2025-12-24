<script lang="ts" module>
	import type { ClassValue } from 'svelte/elements';
	import type { CalendarDateProps } from 'cally';
	import "@sjsf/form/fields/extra-widgets/calendar";

	type MapEvents<T> = {
		[K in keyof T as K extends `on${infer E}` ? `on:${Lowercase<E>}` : K]: T[K];
	};

	export type CalendarProps = MapEvents<CalendarDateProps> & {
		class?: ClassValue | null;
		placeholder?: string;
	};

	declare module '@sjsf/form' {
		interface UiOptions {
			daisyui5CallyCalendar?: CalendarProps;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, uiOptionProps, type ComponentProps } from '@sjsf/form';
	import 'cally';

	let {
		value = $bindable(),
		config,
		handlers
	}: ComponentProps['calendarWidget'] = $props();

	const ctx = getFormContext();
</script>

<!-- svelte-ignore event_directive_deprecated -->
<calendar-date
	class="cally"
	on:change={({ target }) => {
		if (target === null || !('value' in target)) {
			return;
		}
		value = target.value as string;
		handlers.onchange?.();
	}}
	{...uiOptionProps('daisyui5CallyCalendar')(
		{
			value
		},
		config,
		ctx
	)}
>
	<svg
		aria-label="Previous"
		class="size-4"
		slot="previous"
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"><path d="M15.75 19.5 8.25 12l7.5-7.5"></path></svg
	>
	<svg
		aria-label="Next"
		class="size-4"
		slot="next"
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"><path d="m8.25 4.5 7.5 7.5-7.5 7.5"></path></svg
	>
	<calendar-month></calendar-month>
</calendar-date>
