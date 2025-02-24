<script lang="ts" module>
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { CalendarSingleRootProps, WithoutChildrenOrChild } from 'bits-ui';
	declare module '@sjsf/form' {
		interface UiOptions {
			shadcnCalendar?: Omit<WithoutChildrenOrChild<CalendarSingleRootProps>, 'type'>;
			shadcnCalendarTrigger?: HTMLButtonAttributes;
		}
	}
</script>

<script lang="ts">
	import { defineDisabled, getFormContext, type ComponentProps } from '@sjsf/form';
	import { getLocalTimeZone, parseDate } from '@internationalized/date';

	import { cn } from '$lib/utils';

	import { getThemeContext } from '../context';

	const ctx = getFormContext();
	const themeCtx = getThemeContext();

	const { Popover, PopoverTrigger, Button, PopoverContent, Calendar } = $derived(
		themeCtx.components
	);

	let { value = $bindable(), config, handlers }: ComponentProps['textWidget'] = $props();

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
			...config.uiOptions?.shadcnCalendar
		};
		return defineDisabled(ctx, props);
	});

	const formattedValue = $derived.by(() => {
		const v = date.value;
		if (v === undefined) {
			return attributes.placeholder;
		}
		return themeCtx.formatDate(v.toDate(getLocalTimeZone()));
	});
</script>

<Popover>
	<PopoverTrigger>
		{#snippet child({ props })}
			<Button
				{...props}
				class={cn('w-full', date.value === undefined && 'text-muted-foreground')}
				{...config.uiOptions?.shadcnCalendarTrigger}
			>
				{formattedValue}
			</Button>
		{/snippet}
	</PopoverTrigger>
	<PopoverContent>
		<Calendar bind:value={date.value} {...attributes} />
	</PopoverContent>
</Popover>
