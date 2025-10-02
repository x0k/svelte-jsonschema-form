<script lang="ts" module>
	import type { ClassValue, HTMLButtonAttributes } from 'svelte/elements';
	import type { CalendarRangeProps, CalendarMonthProps, CalendarDateProps } from 'cally';
	import type { WidgetCommonProps } from '@sjsf/form/fields/widgets';

	type MapEvents<T> = {
		[K in keyof T as K extends `on${infer E}` ? `on:${Lowercase<E>}` : K]: T[K];
	};

	export type CalendarProps = MapEvents<CalendarDateProps> & {
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
			slot?: string | null;
		}
	}

	declare module '@sjsf/form' {
		interface ComponentProps {
			daisyui5CallyDatePickerWidget: WidgetCommonProps<string>;
		}
		interface ComponentBindings {
			daisyui5CallyDatePickerWidget: 'value';
		}
		interface UiOptions {
			daisyui5CallyCalendarDateFormatter?: (date: string) => string;
			daisyui5CallyCalendarTrigger?: HTMLButtonAttributes;
			daisyui5CallyCalendar?: CalendarProps;
		}
	}
</script>

<script lang="ts">
	import { formatAsCustomPropertyName } from '@sjsf/form/lib/css';
	import {
		buttonAttributes,
		getFormContext,
		createId,
		uiOptionProps,
		type ComponentProps
	} from '@sjsf/form';
	import 'cally';

	let {
		value = $bindable(),
		config,
		errors,
		handlers,
		uiOption
	}: ComponentProps['daisyui5CallyDatePickerWidget'] = $props();

	const ctx = getFormContext();

	const formatDate = $derived.by(() => {
		const formatDate = uiOption('daisyui5CallyCalendarDateFormatter');
		if (formatDate !== undefined) {
			return formatDate;
		}
		const format = new Intl.DateTimeFormat(undefined, {
			year: 'numeric',
			month: '2-digit',
			day: 'numeric'
		});
		return (date: string) => format.format(new Date(date));
	});

	const id = $derived(createId(ctx, config.path));

	const anchorName = $derived(formatAsCustomPropertyName(id));

	const triggerAttributes = $derived(
		buttonAttributes(ctx, config, 'daisyui5CallyCalendarTrigger', 'button', {
			popovertarget: `${id}-popover`,
			style: `anchor-name: ${anchorName};`
		})
	);
</script>

<button
	type="button"
	popovertarget="{id}-popover"
	class={['input input-border w-full', errors.length > 0 && 'input-error']}
	style="anchor-name:{anchorName}"
	{...triggerAttributes}
>
	{value ? formatDate(value) : triggerAttributes.placeholder}
</button>
<div
	id="{id}-popover"
	class="dropdown bg-base-100 rounded-box shadow-lg"
	style="position-anchor:{anchorName}"
	popover="auto"
>
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
</div>
