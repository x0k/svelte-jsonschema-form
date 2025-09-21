<script lang="ts" module>
	import type { ComponentProps as SvelteComponentProps } from 'svelte';
	// NOTE: avoids types collision
	import { Slider as SkeletonSlider } from '@skeletonlabs/skeleton-svelte';
	import '@sjsf/form/fields/extra-widgets/range';

	declare module '@sjsf/form' {
		interface UiOptions {
			skeleton3Slider?: SvelteComponentProps<typeof SkeletonSlider>;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, type ComponentProps, customInputAttributes } from '@sjsf/form';

	let { value = $bindable(), config, handlers, errors }: ComponentProps['rangeWidget'] = $props();

	const ctx = getFormContext();
</script>

<SkeletonSlider
	{...customInputAttributes(ctx, config, 'skeleton3Slider', {
		ids: {
			hiddenInput() {
				return config.id;
			}
		},
		name: config.id,
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
