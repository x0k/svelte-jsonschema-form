<script lang="ts" module>
	import type { Component } from 'svelte';
	import type { Calendar, CalendarSingleRootProps, Popover, WithoutChildrenOrChild } from 'bits-ui';
	import '@sjsf/form/fields/extra-widgets/date-picker';

	import type { ButtonProps } from '../types/button';

	declare module '@sjsf/form' {
		interface UiOptions {
			shadcnDatePicker?: Omit<WithoutChildrenOrChild<CalendarSingleRootProps>, 'type'>;
			shadcnDatePickerTrigger?: ButtonProps;
			shadcnDateFormatter?: (date: Date) => string;
		}
	}

	declare module '../context.js' {
		interface ThemeComponents {
			Popover: Component<Popover.ContentProps>;
			PopoverTrigger: Component<Popover.TriggerProps>;
			PopoverContent: Component<Popover.ContentProps>;
			// @ts-expect-error too complex
			Calendar: Component<
				WithoutChildrenOrChild<Calendar.RootProps>,
				{},
				'value' | 'placeholder' | 'ref'
			>;
		}
	}
</script>

<script lang="ts">
	import { getLocalTimeZone, parseDate } from '@internationalized/date';
	import { defineDisabled, getFormContext, type ComponentProps } from '@sjsf/form';

	import { getThemeContext } from '../context';

	const ctx = getFormContext();
	const themeCtx = getThemeContext();

	const { Popover, PopoverTrigger, Button, PopoverContent, Calendar } = $derived(
		themeCtx.components
	);

	let { value = $bindable(), config, handlers }: ComponentProps['datePickerWidget'] = $props();

	const date = {
		get value() {
			return value ? parseDate(value) : undefined;
		},
		set value(v) {
			if (!v) {
				value = undefined;
				return;
			}
			value = v.toDate(getLocalTimeZone()).toLocaleDateString('en-CA');
		}
	};

	const attributes = $derived.by(() => {
		const props: CalendarSingleRootProps = {
			type: 'single',
			initialFocus: true,
			onValueChange: handlers.onchange,
			...config.uiOptions?.shadcnDatePicker,
			...ctx.extraUiOptions?.('shadcnDatePicker', config)
		};
		return defineDisabled(ctx, props);
	});

	const formatDate = $derived.by(() => {
		const formatter = config.uiOptions?.shadcnDateFormatter;
		if (formatter !== undefined) {
			return formatter;
		}
		const dateTimeFormat = new Intl.DateTimeFormat(undefined, {
			year: 'numeric',
			month: '2-digit',
			day: 'numeric'
		});
		return (date: Date) => dateTimeFormat.format(date);
	});

	const formattedValue = $derived.by(() => {
		const v = date.value;
		if (v === undefined) {
			return attributes.placeholder;
		}
		return formatDate(v.toDate(getLocalTimeZone()));
	});
</script>

<Popover>
	<PopoverTrigger>
		{#snippet child({ props })}
			<Button
				{...props}
				class={['w-full', date.value === undefined && 'text-muted-foreground']}
				{...config.uiOptions?.shadcnDatePickerTrigger}
				{...ctx.extraUiOptions?.('shadcnDatePickerTrigger', config)}
			>
				{formattedValue}
			</Button>
		{/snippet}
	</PopoverTrigger>
	<PopoverContent>
		<Calendar
			bind:value={
				() => (value !== undefined ? parseDate(value) : undefined),
				(v) => {
					value = v?.toDate(getLocalTimeZone()).toLocaleDateString('en-CA');
				}
			}
			{...attributes}
		/>
	</PopoverContent>
</Popover>
