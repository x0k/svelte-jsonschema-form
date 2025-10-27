<script lang="ts" module>
	import type { WidgetCommonProps } from '@sjsf/form/fields/widgets';
	import type { SliderRootProps } from '@skeletonlabs/skeleton-svelte';

	declare module '@sjsf/form' {
		interface ComponentProps {
			skeleton4SliderWidget: WidgetCommonProps<number>;
		}
		interface ComponentBindings {
			skeleton4SliderWidget: 'value';
		}
		interface UiOptions {
			skeleton4Slider?: SliderRootProps;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, type ComponentProps, customInputAttributes, createId } from '@sjsf/form';
	import { Slider } from '@skeletonlabs/skeleton-svelte';

	let {
		value = $bindable(),
		config,
		handlers,
		errors
	}: ComponentProps['skeleton4SliderWidget'] = $props();

	const ctx = getFormContext();

	const id = $derived(createId(ctx, config.path));
</script>

<Slider
	{...customInputAttributes(ctx, config, 'skeleton4Slider', {
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
>
	<Slider.Control>
		<Slider.Track>
			<Slider.Range />
		</Slider.Track>
		<Slider.Thumb index={0}>
			<Slider.HiddenInput />
		</Slider.Thumb>
	</Slider.Control>
</Slider>
