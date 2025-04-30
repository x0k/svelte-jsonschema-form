<script lang="ts" module>
	import type { ComponentProps as SvelteComponentProps } from 'svelte';
	import { Segment } from '@skeletonlabs/skeleton-svelte';
	import '@sjsf/form/fields/extra-widgets/radio-buttons';

	declare module '@sjsf/form' {
		interface UiOptions {
			skeleton3Segment?: SvelteComponentProps<typeof Segment>;
			skeleton3SegmentItem?: SvelteComponentProps<typeof Segment.Item>;
		}
	}
</script>

<script lang="ts">
	import {
		getFormContext,
		type ComponentProps,
		defineDisabled,
		retrieveInputAttributes,
		retrieveUiProps
	} from '@sjsf/form';
	import { stringIndexMapper, singleOption } from '@sjsf/form/options.svelte';

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

	const attributes: SvelteComponentProps<typeof Segment> = $derived(
		retrieveInputAttributes(ctx, config, 'skeleton3Segment', () => ({
			ids: {
				root: config.id
			},
			name: config.name,
			readOnly: config.schema.readOnly,
			onValueChange: (details) => {
				mapped.value = details.value ?? '';
				handlers.onchange?.();
			}
		}))
	);
</script>

<Segment value={mapped.value} {...attributes}>
	{#each options as option, index (option.id)}
		<Segment.Item
			{...retrieveUiProps(ctx, config, 'skeleton3SegmentItem', {
				value: index.toString(),
				disabled: option.disabled
			})}
		>
			{option.label}
		</Segment.Item>
	{/each}
</Segment>
