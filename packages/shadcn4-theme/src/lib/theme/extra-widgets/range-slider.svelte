<script lang="ts" module>
	import type { SliderMultipleRootProps, WithoutChildrenOrChild } from 'bits-ui';
	import '@sjsf/form/fields/extra-widgets/number-range';

	import '../types/slider.js';

	declare module '@sjsf/form' {
		interface UiOptions {
			shadcn4RangeSlider?: Omit<WithoutChildrenOrChild<SliderMultipleRootProps>, 'type'>;
		}
	}
</script>

<script lang="ts">
	import { customInputAttributes, getFormContext, getId, type ComponentProps } from '@sjsf/form';

	import { getThemeContext } from '../context.js';

	let { value = $bindable(), config, handlers }: ComponentProps['numberRangeWidget'] = $props();

	const ctx = getFormContext();
	const themeCtx = getThemeContext();

	const { Slider } = $derived(themeCtx.components);

	const id = $derived(getId(ctx, config.path));
</script>

<Slider
	bind:value={
		() => [value?.start ?? 0, value?.end ?? 0],
		(v) => {
			value = {
				start: v[0],
				end: v[1]
			};
		}
	}
	{...customInputAttributes(ctx, config, 'shadcn4RangeSlider', {
		id,
		min: config.schema.minimum,
		max: config.schema.maximum,
		step: config.schema.multipleOf,
		onValueChange: handlers.oninput,
		onValueCommit: handlers.onchange
	})}
	type="multiple"
/>
