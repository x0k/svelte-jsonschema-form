<script lang="ts" module>
	import type { ComponentProps as SvelteComponentProps } from 'svelte';
	import { ColorPicker as SvarColorPicker } from '@svar-ui/svelte-core';
	import type { WidgetCommonProps } from '@sjsf/form/fields/widgets';

	declare module '@sjsf/form' {
		interface ComponentProps {
			svarColorPickerWidget: WidgetCommonProps<string>;
		}
		interface ComponentBindings {
			svarColorPickerWidget: 'value';
		}
		interface UiOptions {
			svarColorPicker?: SvelteComponentProps<typeof SvarColorPicker>;
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
	}: ComponentProps['svarColorPickerWidget'] = $props();

	const ctx = getFormContext();

	const id = $derived(getId(ctx, config.path));

	function onchange() {
		handlers.oninput?.();
		handlers.onchange?.();
	}
</script>

<SvarColorPicker
	bind:value={() => value ?? '', (v) => (value = v)}
	{...uiOptionProps('svarColorPicker')(
		{
			id,
			disabled: isDisabled(ctx),
			error: errors.length > 0,
			onchange
		},
		config,
		ctx
	)}
/>
