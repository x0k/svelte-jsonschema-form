<script lang="ts" module>
	import type { ComponentProps as SvelteComponentProps } from 'svelte';
	import { DateRangePicker as SvarDateRangePicker } from '@svar-ui/svelte-core';
	import type { Range } from '@sjsf/form/lib/range';
	import type { WidgetCommonProps } from '@sjsf/form/fields/widgets';

	declare module '@sjsf/form' {
		interface ComponentProps {
			svarDateRangePickerWidget: WidgetCommonProps<Partial<Range<string>>>;
		}
		interface ComponentBindings {
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
	}: ComponentProps['svarDateRangePickerWidget'] = $props();

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
