<script lang="ts" module>
	import type { SliderRootProps } from '@skeletonlabs/skeleton-svelte';
	import '@sjsf/form/fields/extra-widgets/range-slider';

	declare module '@sjsf/form' {
		interface UiOptions {
			skeleton4RangeSlider?: SliderRootProps;
		}
	}

	const properties = ['start', 'end'];
</script>

<script lang="ts">
	import {
		customInputAttributes,
		getChildPath,
		getFormContext,
		getId,
		type ComponentProps
	} from '@sjsf/form';
	import { Slider } from '@skeletonlabs/skeleton-svelte';

	let {
		value = $bindable(),
		config,
		handlers,
		errors
	}: ComponentProps['rangeSliderWidget'] = $props();

	const ctx = getFormContext();

	const inputIds = $derived(properties.map((p) => getId(ctx, getChildPath(ctx, config.path, p))));
</script>

<Slider
	value={[value?.start ?? 0, value?.end ?? 0]}
	{...customInputAttributes(ctx, config, 'skeleton4RangeSlider', {
		ids: {
			hiddenInput(index) {
				return inputIds[index];
			},
		},
		readOnly: config.schema.readOnly,
		min: config.schema.minimum,
		max: config.schema.maximum,
		step: config.schema.multipleOf,
		invalid: errors.length > 0,
		onFocusChange: handlers.onblur,
		onValueChange: (e) => {
			value = {
				start: e.value[0],
				end: e.value[1]
			};
			handlers.oninput?.();
		},
		onValueChangeEnd: handlers.onchange
	})}
>
	<Slider.Control>
		<Slider.Track>
			<Slider.Range />
		</Slider.Track>
		<Slider.Thumb index={0}>
			<Slider.HiddenInput name={inputIds[0]}/>
		</Slider.Thumb>
		<Slider.Thumb index={1}>
			<Slider.HiddenInput name={inputIds[1]}/>
		</Slider.Thumb>
	</Slider.Control>
</Slider>
