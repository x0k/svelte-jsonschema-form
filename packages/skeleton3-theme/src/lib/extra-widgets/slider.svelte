<script lang="ts" module>
	import type { ComponentProps as SvelteComponentProps } from 'svelte';
	import type { WidgetCommonProps } from '@sjsf/form/fields/widgets';
	// NOTE: avoids types collision
	import { Slider as SkeletonSlider } from '@skeletonlabs/skeleton-svelte';

	declare module '@sjsf/form' {
		interface ComponentProps {
			skeleton3SliderWidget: WidgetCommonProps<number>;
		}
		interface ComponentBindings {
			skeleton3SliderWidget: 'value';
		}
		interface UiOptions {
			skeleton3Slider?: SvelteComponentProps<typeof SkeletonSlider>;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, type ComponentProps, customInputAttributes, createId } from '@sjsf/form';

	let {
		value = $bindable(),
		config,
		handlers,
		errors
	}: ComponentProps['skeleton3SliderWidget'] = $props();

	const ctx = getFormContext();

	const id = $derived(createId(ctx, config.path));
</script>

<SkeletonSlider
	{...customInputAttributes(ctx, config, 'skeleton3Slider', {
		ids: {
			hiddenInput() {
				return id;
			}
		},
		name: id,
		readOnly: config.schema.readOnly,
		min: config.schema.minimum,
		max: config.schema.maximum,
		step: config.schema.multipleOf,
		invalid: errors.length > 0,
		onFocusChange: handlers.onblur,
		onValueChange: (details) => {
			value = details.value[0];
			handlers.oninput?.();
		},
		onValueChangeEnd: handlers.onchange,
		value: value === undefined ? undefined : [value]
	})}
/>
