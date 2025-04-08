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
	import { getFormContext, type ComponentProps, defineDisabled } from '@sjsf/form';
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
		defineDisabled(ctx, {
			ids: {
				root: config.id
			},
			name: config.name,
			readOnly: config.schema.readOnly,
			onValueChange: (details) => {
				mapped.value = details.value ?? '';
				handlers.onchange?.();
			},
			...config.uiOptions?.skeleton3Segment,
			...ctx.extraUiOptions?.('skeleton3Segment', config)
		})
	);

	const itemAttributes = $derived({
		...config.uiOptions?.skeleton3SegmentItem,
		...ctx.extraUiOptions?.('skeleton3SegmentItem', config)
	});
</script>

<Segment value={mapped.value} {...attributes}>
	{#each options as option, index (option.id)}
		<Segment.Item value={index.toString()} {...itemAttributes} disabled={option.disabled}>
			{option.label}
		</Segment.Item>
	{/each}
</Segment>
