<script lang="ts" module>
	import type { ComponentProps as SvelteComponentProps } from 'svelte';
	import { DateRangePicker as SvarDateRangePicker } from '@svar-ui/svelte-core';
	import type { Range } from '@sjsf/form/lib/range';
	import type { WidgetCommonProps } from '@sjsf/form/fields/widgets';
	import '@sjsf/form/fields/extra-widgets/date-range-picker';

	declare module '@sjsf/form' {
		interface ComponentProps {
			// TODO: Remove in v4
			/** @deprecated use `dateRangePickerWidget` instead */
			svarDateRangePickerWidget: WidgetCommonProps<Partial<Range<string>>>;
		}
		interface ComponentBindings {
			// TODO: Remove in v4
			/** @deprecated use `dateRangePickerWidget` instead */
			svarDateRangePickerWidget: 'value';
		}
		interface UiOptions {
			svarDateRangePicker?: SvelteComponentProps<typeof SvarDateRangePicker>;
		}
	}
</script>

<script lang="ts">
	import {
		getFormContext,
		getId,
		isDisabled,
		uiOptionProps,
		type ComponentProps
	} from '@sjsf/form';

	import { parseLocalDate, toLocalDate } from '$lib/local-date.js';

	let {
		value = $bindable(),
		config,
		handlers,
		errors
	}: ComponentProps['dateRangePickerWidget'] = $props();

	const ctx = getFormContext();

	const id = $derived(getId(ctx, config.path));

	const parsed = $derived(
		value?.start
			? value.end
				? {
						start: parseLocalDate(value.start),
						end: parseLocalDate(value.end)
					}
				: { start: parseLocalDate(value.start) }
			: undefined
	);

	function onchange() {
		handlers.oninput?.();
		handlers.onchange?.();
	}
</script>

<SvarDateRangePicker
	bind:value={
		() => parsed,
		(v) => {
			value = v && {
				start: v?.start && toLocalDate(v.start),
				end: v?.end && toLocalDate(v.end)
			};
		}
	}
	{...uiOptionProps('svarDateRangePicker')(
		{
			id,
			disabled: isDisabled(ctx),
			error: errors.length > 0,
			onchange,
			editable: true
		},
		config,
		ctx
	)}
/>
