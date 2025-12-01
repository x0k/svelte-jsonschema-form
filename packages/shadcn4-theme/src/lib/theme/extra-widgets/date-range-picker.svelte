<script lang="ts" module>
	import type { Component } from 'svelte';
	import type { RangeCalendarRootProps, RangeCalendar, WithoutChildrenOrChild } from 'bits-ui';
	import type { DateValue } from '@internationalized/date';
	import type { Range } from '@sjsf/form/lib/range';

	import '../types/popover';

	declare module '@sjsf/form' {
		interface ComponentProps {
			shadcn4DateRangePickerWidget: WidgetCommonProps<Partial<Range<string>>>;
		}
		interface ComponentBindings {
			shadcn4DateRangePickerWidget: 'value';
		}
		interface UiOptions {
			shadcn4DateRangePicker?: RangeCalendarRootProps;
			shadcn4DateRangePickerPlaceholder?: string;
			shadcn4DateRangeFormatter?: (range: Range<DateValue | undefined>) => string;
		}
	}

	declare module '../context.js' {
		interface ThemeComponents {
			RangeCalendar: Component<
				WithoutChildrenOrChild<RangeCalendar.RootProps>,
				{},
				'ref' | 'value' | 'placeholder'
			>;
		}
	}
</script>

<script lang="ts">
	import { DateFormatter, getLocalTimeZone, parseDate } from '@internationalized/date';
	import {
		customInputAttributes,
		getFormContext,
		retrieveUiOption,
		type ComponentProps
	} from '@sjsf/form';
	import type { WidgetCommonProps } from '@sjsf/form/fields/widgets';
	import CalendarIcon from '@lucide/svelte/icons/calendar';

	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';

	import { getThemeContext } from '../context.js';

	const ctx = getFormContext();
	const themeCtx = getThemeContext();

	let {
		value = $bindable(),
		config,
		handlers
	}: ComponentProps['shadcn4DateRangePickerWidget'] = $props();

	const { oninput, onchange, ...buttonHandlers } = $derived(handlers);

	const { Popover, PopoverTrigger, PopoverContent, RangeCalendar } = $derived(themeCtx.components);

	const attributes = $derived(
		customInputAttributes(ctx, config, 'shadcn4DateRangePicker', {
			numberOfMonths: 2,
			onValueChange: () => {
				oninput?.();
				onchange?.();
			}
		})
	);

	const formatDateRange = $derived.by(() => {
		const formatter = retrieveUiOption(ctx, config, 'shadcn4DateRangeFormatter');
		if (formatter !== undefined) {
			return formatter;
		}
		const placeholder = retrieveUiOption(ctx, config, 'shadcn4DateRangePickerPlaceholder');
		const f = new DateFormatter('en-US', {
			dateStyle: 'medium'
		});
		return ({ start, end }: Range<DateValue | undefined>) =>
			start && end
				? `${f.format(start.toDate(getLocalTimeZone()))} - ${f.format(end.toDate(getLocalTimeZone()))}`
				: start
					? f.format(start.toDate(getLocalTimeZone()))
					: placeholder;
	});

	const parsed: Range<DateValue | undefined> = $derived({
		start: typeof value?.start === 'string' ? parseDate(value.start) : undefined,
		end: typeof value?.end === 'string' ? parseDate(value.end) : undefined
	});
</script>

<Popover>
	<PopoverTrigger
		{...buttonHandlers}
		class={cn(
			buttonVariants({
				variant: 'outline',
				class: 'justify-start text-start font-normal'
			}),
			!value && 'text-muted-foreground'
		)}
	>
		<CalendarIcon class="me-2 size-4" />
		{formatDateRange(parsed)}
	</PopoverTrigger>
	<PopoverContent class="w-auto p-0" align="start">
		<RangeCalendar
			{...attributes}
			bind:value={
				() => parsed,
				(v) => {
					const tz = getLocalTimeZone();
					value = {
						start: v?.start?.toDate(tz).toLocaleDateString('en-CA'),
						end: v?.end?.toDate(tz).toLocaleDateString('en-CA')
					};
				}
			}
		/>
	</PopoverContent>
</Popover>
