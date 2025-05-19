<script lang="ts" module>
	import type { Component } from 'svelte';
	import type { Slider, SliderSingleRootProps, WithoutChildrenOrChild } from 'bits-ui';
	import '@sjsf/form/fields/extra-widgets/range';

	declare module '@sjsf/form' {
		interface UiOptions {
			shadcnRange?: Omit<WithoutChildrenOrChild<SliderSingleRootProps>, 'type'>;
		}
	}

	declare module '../context.js' {
		interface ThemeComponents {
			Slider: Component<WithoutChildrenOrChild<Slider.RootProps>, {}, 'value' | 'ref'>;
		}
	}
</script>

<script lang="ts">
	import { customInputAttributes, getFormContext, type ComponentProps } from '@sjsf/form';

	import { getThemeContext } from '../context.js';

	const ctx = getFormContext();
	const themeCtx = getThemeContext();

	const { Slider } = $derived(themeCtx.components);

	let { value = $bindable(), config, handlers }: ComponentProps['rangeWidget'] = $props();
</script>

<Slider
	bind:value={() => value ?? 0, (v) => (value = v)}
	{...customInputAttributes(ctx, config, 'shadcnRange', {
		id: config.id,
		min: config.schema.minimum,
		max: config.schema.maximum,
		step: config.schema.multipleOf,
		onValueChange: handlers.oninput,
		onValueCommit: handlers.onchange
	})}
	type="single"
/>
