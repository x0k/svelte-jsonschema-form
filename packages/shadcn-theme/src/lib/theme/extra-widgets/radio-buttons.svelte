<script lang="ts" module>
	import type { Component } from 'svelte';
	import type {
		BitsPrimitiveDivAttributes,
		SingleToggleGroupRootPropsWithoutHTML,
		ToggleGroupItemProps,
		ToggleGroupRootPropsWithoutHTML,
		Without
	} from 'bits-ui';
	import '@sjsf/form/fields/extra-widgets/radio-buttons';

	import type { ToggleVariants } from '$lib/default-ui/toggle';

	type ToggleGroupProps = SingleToggleGroupRootPropsWithoutHTML &
		Without<BitsPrimitiveDivAttributes, ToggleGroupRootPropsWithoutHTML> &
		ToggleVariants;

	declare module '@sjsf/form' {
		interface UiOptions {
			shadcnRadioButtons?: ToggleGroupProps;
			shadcnRadioButtonsItem?: ToggleGroupItemProps & ToggleVariants;
		}
	}

	declare module '../context.js' {
		interface ThemeComponents {
			ToggleGroup: Component<ToggleGroupProps & ToggleVariants, {}, 'ref' | 'value'>;
			ToggleGroupItem: Component<ToggleGroupItemProps & ToggleVariants, {}, 'ref' | 'value'>;
		}
	}
</script>

<script lang="ts">
	import {
		customInputAttributes,
		getFormContext,
		uiOptionProps,
		type ComponentProps
	} from '@sjsf/form';

	import { getThemeContext } from '../context';
	import { singleOption, stringIndexMapper } from '@sjsf/form/options.svelte';

	const ctx = getFormContext();
	const themeCtx = getThemeContext();

	const { ToggleGroup, ToggleGroupItem } = $derived(themeCtx.components);

	let {
		value = $bindable(),
		config,
		handlers,
		options
	}: ComponentProps['radioButtonsWidget'] = $props();

	const mapped = singleOption({
		mapper: () => stringIndexMapper(options),
		value: () => value,
		update: (v) => (value = v)
	});

	const attributes = $derived(
		customInputAttributes(ctx, config, 'shadcnRadioButtons', {
			type: 'single',
			id: config.id,
			'aria-required': config.required,
			'aria-readonly': config.schema.readOnly,
			onValueChange: handlers.onchange
		})
	);
</script>

<ToggleGroup bind:value={mapped.value} {...attributes}>
	{#each options as option, index (option.id)}
		<ToggleGroupItem
			{...uiOptionProps('shadcnRadioButtonsItem')(
				{
					value: index.toString(),
					disabled: option.disabled
				},
				config,
				ctx
			)}
		>
			{option.label}
		</ToggleGroupItem>
	{/each}
</ToggleGroup>
