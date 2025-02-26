<script lang="ts" module>
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { WidgetCommonProps } from '@sjsf/legacy-fields/exports';

	declare module '@sjsf/form' {
		interface ComponentProps {
			daisyui5ToggleWidget: WidgetCommonProps<boolean>;
		}
		interface ComponentBindings {
			daisyui5ToggleWidget: 'value';
		}
		interface UiOptions {
			daisyui5Toggle?: HTMLInputAttributes;
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
	}: ComponentProps['daisyui5ToggleWidget'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(
		inputAttributes(ctx, config, handlers, config.uiOptions?.daisyui5Toggle)
	);
</script>

<label class="fieldset-label">
	<input
		type="checkbox"
		class={['toggle', errors.length > 0 && 'toggle-error']}
		bind:checked={value}
		{...attributes}
	/>
	{config.title}
</label>
