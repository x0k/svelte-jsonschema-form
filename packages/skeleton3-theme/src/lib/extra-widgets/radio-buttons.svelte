<script lang="ts" module>
	import '@sjsf/form/fields/extra-widgets/radio-buttons';

	import type { SegmentProps, SegmentItemProps } from '$lib/segment-types.js';

	declare module '@sjsf/form' {
		interface UiOptions {
			skeleton3Segment?: SegmentProps;
			skeleton3SegmentItem?: SegmentItemProps;
		}
	}
</script>

<script lang="ts">
	import {
		customInputAttributes,
		getFormContext,
		createId,
		uiOptionProps,
		type ComponentProps
	} from '@sjsf/form';
	import { stringIndexMapper, singleOption } from '@sjsf/form/options.svelte';
	import { Segment } from '@skeletonlabs/skeleton-svelte';

	let {
		config,
		handlers,
		value = $bindable(),
		options
	}: ComponentProps['radioButtonsWidget'] = $props();

	const mapped = singleOption({
		mapper: () => stringIndexMapper(options),
		value: () => value,
		update: (v) => (value = v)
	});

	const ctx = getFormContext();

	const id = $derived(createId(ctx, config.path))
</script>

<Segment
	value={mapped.value}
	{...customInputAttributes(ctx, config, 'skeleton3Segment', {
		ids: {
			root: id
		},
		name: id,
		readOnly: config.schema.readOnly,
		onValueChange: (details) => {
			mapped.value = details.value ?? '';
			handlers.oninput?.();
			handlers.onchange?.();
		}
	})}
>
	{#each options as option, index (option.id)}
		<Segment.Item
			{...uiOptionProps('skeleton3SegmentItem')(
				{
					value: index.toString(),
					disabled: option.disabled
				},
				config,
				ctx
			)}
		>
			{option.label}
		</Segment.Item>
	{/each}
</Segment>
