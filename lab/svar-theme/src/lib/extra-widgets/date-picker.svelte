<script lang="ts" module>
	import type { ComponentProps as SvelteComponentProps } from 'svelte';
	import { DatePicker as SvarDatePicker } from '@svar-ui/svelte-core';
	import '@sjsf/form/fields/extra-widgets/date-picker';

	declare module '@sjsf/form' {
		interface UiOptions {
			svarDatePicker?: SvelteComponentProps<typeof SvarDatePicker>;
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

	let {
		value = $bindable(),
		config,
		handlers,
		errors
	}: ComponentProps['datePickerWidget'] = $props();

	const ctx = getFormContext();

	const id = $derived(getId(ctx, config.path));

	function parseLocalDate(date: string) {
		const [year, month, day] = date.split('-').map(Number);
		return new Date(year, month - 1, day);
	}

	function onchange() {
		handlers.oninput?.();
		handlers.onchange?.();
	}
</script>

<SvarDatePicker
	bind:value={
		() => (value ? parseLocalDate(value) : undefined),
		(v) => (value = v?.toLocaleDateString('en-CA'))
	}
	{...uiOptionProps('svarDatePicker')(
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
