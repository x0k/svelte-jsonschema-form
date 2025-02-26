<script lang="ts" module>
	import { type ToggleProps } from 'flowbite-svelte/Toggle.svelte';
	import type { WidgetCommonProps } from '@sjsf/legacy-fields/exports';

	declare module '@sjsf/form' {
		interface ComponentProps {
			flowbiteToggleWidget: WidgetCommonProps<boolean>;
		}
		interface ComponentBindings {
			flowbiteToggleWidget: 'value';
		}
		interface UiOptions {
			flowbiteToggle?: ToggleProps;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';
	import Toggle from 'flowbite-svelte/Toggle.svelte';

	let { config, value = $bindable(), handlers }: ComponentProps['flowbiteToggleWidget'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(
		inputAttributes(ctx, config, handlers, config.uiOptions?.flowbiteToggle)
	);
</script>

<Toggle bind:checked={value} {...attributes}>
	{config.title}
</Toggle>
