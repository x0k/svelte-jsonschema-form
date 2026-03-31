<script lang="ts" module>
	import type {
		SegmentedControlRootProps,
		SegmentedControlItemProps
	} from '@skeletonlabs/skeleton-svelte';
	import '@sjsf/form/fields/extra-widgets/radio-buttons';

	declare module '@sjsf/form' {
		interface UiOptions {
			skeleton4Segment?: SegmentedControlRootProps;
			skeleton4SegmentItem?: Omit<SegmentedControlItemProps, 'value'>;
		}
	}
</script>

<script lang="ts">
	import {
		customInputAttributes,
		getFormContext,
		getId,
		uiOptionProps,
		type ComponentProps
	} from '@sjsf/form';
	import { idMapper, singleOption, EMPTY_VALUE } from '@sjsf/form/options.svelte';
	import { SegmentedControl } from '@skeletonlabs/skeleton-svelte';

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
	}: ComponentProps['radioButtonsWidget'] = $props();

	const ctx = getFormContext();

	const id = $derived(getId(ctx, config.path));

	const itemAttributes = $derived(uiOptionProps('skeleton4SegmentItem')({}, config, ctx));
</script>

<SegmentedControl
	value={mapped.current}
	{...customInputAttributes(ctx, config, 'skeleton4Segment', {
		ids: {
			root: id
		},
		name: id,
		readOnly: config.schema.readOnly,
		onValueChange: (details) => {
			mapped.current = details.value ?? EMPTY_VALUE;
			handlers.oninput?.();
			handlers.onchange?.();
		}
	})}
>
	<SegmentedControl.Control>
		<SegmentedControl.Indicator />
		{#each options as option (option.id)}
			<SegmentedControl.Item
				value={option.mappedValue ?? option.id}
				disabled={option.disabled}
				{...itemAttributes}
			>
				<SegmentedControl.ItemText>{option.label}</SegmentedControl.ItemText>
				<SegmentedControl.ItemHiddenInput />
			</SegmentedControl.Item>
		{/each}
	</SegmentedControl.Control>
</SegmentedControl>
