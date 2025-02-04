<script lang="ts" module>
	import type { ClassValue, HTMLButtonAttributes } from 'svelte/elements';
	import type { WidgetCommonProps, WidgetProps } from '@sjsf/form';
	import type { CalendarRangeProps, CalendarMonthProps, CalendarDateProps } from 'cally';

	type MapEvents<T> = {
		[K in keyof T as K extends `on${infer E}` ? `on:${Lowercase<E>}` : K]: T[K];
	};

	type CalendarProps = MapEvents<CalendarDateProps> & {
		class?: ClassValue | null;
		placeholder?: string;
	};

	declare module 'svelte/elements' {
		interface SvelteHTMLElements {
			'calendar-range': MapEvents<CalendarRangeProps>;
			'calendar-month': MapEvents<CalendarMonthProps>;
			'calendar-date': CalendarProps;
		}
		interface SVGAttributes<T extends EventTarget> {
			slot?: string;
		}
	}

	declare module '@sjsf/form' {
		interface UiOptions {
			trigger?: HTMLButtonAttributes
			formatDate?: (date: string) => string;
		}

		interface WidgetsAndProps<V> {
			callyCalendar: WidgetCommonProps<V, CalendarProps>;
		}

		interface WidgetValue {
			callyCalendar: string;
		}
	}
</script>

<script lang="ts">
	import { formatAsCustomPropertyName } from '@sjsf/form/lib/css'
	import 'cally';

	let { value = $bindable(), attributes, config }: WidgetProps<'callyCalendar'> = $props();

	const triggerAttributes = $derived(config.uiOptions?.trigger);

	const formatDate = $derived.by(() => {
		const formatDate = config.uiOptions?.formatDate;
		if (formatDate) {
			return formatDate;
		}
		const format = new Intl.DateTimeFormat(undefined, {
			year: 'numeric',
			month: '2-digit',
			day: 'numeric'
		});
		return (date: string) => format.format(new Date(date));
	});

	const anchorName = $derived(formatAsCustomPropertyName(attributes.id));
</script>

<button
	type="button"
	popovertarget="{attributes.id}-popover"
	class="input input-border"
	{...triggerAttributes}
	disabled={attributes.disabled || triggerAttributes?.disabled}
	style="anchor-name:{anchorName}"
>
	{value ? formatDate(value) : attributes.placeholder}
</button>
<div
	id="{attributes.id}-popover"
	class="dropdown bg-base-100 rounded-box shadow-lg"
	style="position-anchor:{anchorName}"
	popover="auto"
>
	<!-- svelte-ignore event_directive_deprecated -->
	<calendar-date
		{value}
		on:change={({ target }) => {
			if (target === null || !('value' in target)) {
				return;
			}
			value = target.value as string;
		}}
		class="cally"
		{...attributes}
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
</div>
