<script lang="ts" module>
	import type { ButtonToggleGroupProps, ButtonToggleProps } from 'flowbite-svelte/types';
	import type { SchemaValue } from '@sjsf/form';
	import type { SingleSelectOptions, WidgetCommonProps } from '@sjsf/form/fields/widgets';

	declare module '@sjsf/form' {
		interface ComponentProps {
			flowbite3ToggleRadioButtonsWidget: WidgetCommonProps<SchemaValue> & SingleSelectOptions;
		}
		interface ComponentBindings {
			flowbite3ToggleRadioButtonsWidget: 'value';
		}
		interface UiOptions {
			flowbite3ToggleRadioButtons?: Omit<ButtonToggleGroupProps, 'children'>;
			flowbite3ToggleRadioButtonsItem?: Partial<ButtonToggleProps>;
		}
	}
</script>

<script lang="ts">
	import ButtonToggle from 'flowbite-svelte/ButtonToggle.svelte';
	import ButtonToggleGroup from 'flowbite-svelte/ButtonToggleGroup.svelte';
	import {
		composeProps,
		customInputAttributes,
		disabledProp,
		getFormContext,
		uiOptionProps,
		type ComponentProps
	} from '@sjsf/form';
	import { idMapper, singleOption, EMPTY_VALUE } from '@sjsf/form/options.svelte';

	let {
		config,
		handlers,
		value = $bindable(),
		options,
		mapped = singleOption({
			mapper: () => idMapper(options),
			value: () => value,
			update: (v) => (value = v)
		})
	}: ComponentProps['flowbite3ToggleRadioButtonsWidget'] = $props();

	const ctx = getFormContext();

	const itemAttributes = $derived(
		composeProps(ctx, config, {}, uiOptionProps('flowbite3ToggleRadioButtonsItem'), disabledProp)
	);
</script>

<ButtonToggleGroup
	{...customInputAttributes(ctx, config, 'flowbite3ToggleRadioButtons', {
		onSelect(val: string | string[] | null) {
			mapped.current = (val as string) ?? EMPTY_VALUE;
			handlers.onchange?.();
		}
	})}
>
	{#each options as option (option.id)}
		{@const ov = option.mappedValue ?? option.id}
		<ButtonToggle {...itemAttributes} selected={mapped.current === ov} value={ov}
			>{option.label}</ButtonToggle
		>
	{/each}
</ButtonToggleGroup>
