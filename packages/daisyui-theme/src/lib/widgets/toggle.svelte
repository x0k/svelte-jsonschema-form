<script lang="ts" module>
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { WidgetCommonProps } from '@sjsf/legacy-fields/exports';

	declare module '@sjsf/form' {
		interface ComponentProps {
			daisyuiToggleWidget: WidgetCommonProps<boolean>;
		}
		interface ComponentBindings {
			daisyuiToggleWidget: 'value';
		}
		interface UiOptions {
			daisyuiToggle?: HTMLInputAttributes;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';

	let {
		config,
		value = $bindable(),
		handlers,
		errors
	}: ComponentProps['daisyuiToggleWidget'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(
		inputAttributes(ctx, config, handlers, config.uiOptions?.daisyuiToggle)
	);
</script>

<label class="label cursor-pointer gap-2">
	<input
		type="checkbox"
		class={['toggle', errors.length > 0 && 'toggle-error']}
		bind:checked={value}
		{...attributes}
	/>
	<span class="label-text">{config.title}</span>
</label>
