<script lang="ts" module>
	import type { CalendarSingleRootProps, WithoutChildrenOrChild } from 'bits-ui';
	import '@sjsf/form/fields/extra-widgets/calendar';

	import '../types/calendar.js';

	declare module '@sjsf/form' {
		interface UiOptions {
			shadcn4Calendar?: Omit<WithoutChildrenOrChild<CalendarSingleRootProps>, 'type'>;
		}
	}
</script>

<script lang="ts">
	import { getLocalTimeZone, parseDate } from '@internationalized/date';
	import { customInputAttributes, getFormContext, type ComponentProps } from '@sjsf/form';

	import { getThemeContext } from '../context.js';

	const ctx = getFormContext();
	const themeCtx = getThemeContext();

	const { Calendar } = $derived(themeCtx.components);

	let { value = $bindable(), config, handlers }: ComponentProps['calendarWidget'] = $props();

	const { oninput, onchange } = $derived(handlers);

	const attributes = $derived(
		customInputAttributes(ctx, config, 'shadcn4Calendar', {
			initialFocus: true,
			onValueChange: () => {
				oninput?.();
				onchange?.();
			}
		})
	);

	const parsedDate = $derived(value !== undefined ? parseDate(value) : undefined);
</script>

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
