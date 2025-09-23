<script lang="ts" module>
	import type { ButtonGroupProps, RadioButtonProps } from 'flowbite-svelte/types';
	import '@sjsf/form/fields/extra-widgets/radio-buttons';

	declare module '@sjsf/form' {
		interface UiOptions {
			flowbite3RadioButtons?: Omit<ButtonGroupProps, 'children'>;
			flowbite3RadioButtonsItem?: Partial<RadioButtonProps<string>>;
		}
	}
</script>

<script lang="ts">
	import RadioButton from 'flowbite-svelte/RadioButton.svelte';
	import ButtonGroup from 'flowbite-svelte/ButtonGroup.svelte';
	import {
		customInputAttributes,
		getFormContext,
		inputAttributes,
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

	const attributes = $derived(
		inputAttributes(ctx, config, 'flowbite3RadioButtonsItem', handlers, {
			checkedClass: 'outline-1 outline-primary-500'
		})
	);
</script>

<ButtonGroup {...customInputAttributes(ctx, config, 'flowbite3RadioButtons', {})}>
	{#each options as option, index (option.id)}
		{@const strIndex = index.toString()}
		<RadioButton
			bind:group={mapped.value}
			value={strIndex}
			{...attributes}
			id={option.id}
			disabled={option.disabled || attributes.disabled}>{option.label}</RadioButton
		>
	{/each}
</ButtonGroup>
