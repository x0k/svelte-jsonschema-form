<script lang="ts" module>
	import type { ButtonToggleGroupProps, ButtonToggleProps } from 'flowbite-svelte';
	import '@sjsf/form/fields/extra-widgets/radio-buttons';

	declare module '@sjsf/form' {
		interface UiOptions {
			flowbite3ToggleRadioButtons?: Omit<ButtonToggleGroupProps, 'children'>;
			flowbite3ToggleRadioButtonsItem?: Partial<ButtonToggleProps>;
		}
	}
</script>

<script lang="ts">
	import { ButtonToggle, ButtonToggleGroup } from 'flowbite-svelte';
	import {
		composeProps,
		customInputAttributes,
		disabledProp,
		getFormContext,
		uiOptionProps,
		type ComponentProps
	} from '@sjsf/form';
	import { stringIndexMapper, singleOption } from '@sjsf/form/options.svelte';

	let {
		config,
		handlers,
		value = $bindable(),
		options
	}: ComponentProps['radioButtonsWidget'] = $props();

	const mapper = $derived(stringIndexMapper(options));
	const mapped = singleOption({
		mapper: () => mapper,
		value: () => value,
		update: (v) => (value = v)
	});

	const ctx = getFormContext();

	const itemAttributes = $derived(
		composeProps(ctx, config, {}, uiOptionProps('flowbite3ToggleRadioButtonsItem'), disabledProp)
	);
</script>

<ButtonToggleGroup
	{...customInputAttributes(ctx, config, 'flowbite3ToggleRadioButtons', {
		onSelect(val: string | null) {
			mapped.value = val ?? '-1';
			handlers.onchange?.();
		}
	})}
>
	{#each options as option, index (option.id)}
		{@const strIndex = index.toString()}
		<ButtonToggle
			{...itemAttributes}
			selected={mapper.fromValue(option.value) === strIndex}
			value={strIndex}>{option.label}</ButtonToggle
		>
	{/each}
</ButtonToggleGroup>
