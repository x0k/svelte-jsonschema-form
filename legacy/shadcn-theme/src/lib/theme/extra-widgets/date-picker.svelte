<script lang="ts" module>
	import type { Component } from 'svelte';
	import type { Calendar, CalendarSingleRootProps, WithoutChildrenOrChild } from 'bits-ui';
	import '@sjsf/form/fields/extra-widgets/date-picker';

	import type { ButtonProps } from '../types/button';
	import '../types/popover';

	declare module '@sjsf/form' {
		interface UiOptions {
			shadcnDatePicker?: Omit<WithoutChildrenOrChild<CalendarSingleRootProps>, 'type'>;
			shadcnDatePickerTrigger?: ButtonProps;
			shadcnDateFormatter?: (date: Date) => string;
		}
	}

	declare module '../context.js' {
		interface ThemeComponents {
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
	import {
		customInputAttributes,
		getFormContext,
		retrieveUiOption,
		uiOptionProps,
		type ComponentProps
	} from '@sjsf/form';

	import { getThemeContext } from '../context';

	const ctx = getFormContext();
	const themeCtx = getThemeContext();

	const { Popover, PopoverTrigger, Button, PopoverContent, Calendar } = $derived(
		themeCtx.components
	);

	let { value = $bindable(), config, handlers }: ComponentProps['datePickerWidget'] = $props();

	const attributes = $derived(
		customInputAttributes(ctx, config, 'shadcnDatePicker', {
			initialFocus: true,
			onValueChange: handlers.onchange
		})
	);

	const parsedDate = $derived(value !== undefined ? parseDate(value) : undefined);

	const formatDate = $derived.by(() => {
		const formatter = retrieveUiOption(ctx, config, 'shadcnDateFormatter');
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

	const triggerContent = $derived.by(() => {
		const v = parsedDate;
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
				class={['w-full', parsedDate === undefined && 'text-muted-foreground']}
				{...uiOptionProps('shadcnDatePickerTrigger')({}, config, ctx)}
			>
				{triggerContent}
			</Button>
		{/snippet}
	</PopoverTrigger>
	<PopoverContent>
		<Calendar
			bind:value={
				() => parsedDate,
				(v) => {
					value = v?.toDate(getLocalTimeZone()).toLocaleDateString('en-CA');
				}
			}
			{...attributes}
			type="single"
		/>
	</PopoverContent>
</Popover>
