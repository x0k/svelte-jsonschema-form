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
	import { defineDisabled, getFormContext, type ComponentProps } from '@sjsf/form';

	import { getThemeContext } from '../context';

	const ctx = getFormContext();
	const themeCtx = getThemeContext();

	const { Slider } = $derived(themeCtx.components);

	let { value = $bindable(), config, handlers }: ComponentProps['rangeWidget'] = $props();

	const attributes = $derived.by(() => {
		const props: SliderSingleRootProps = {
			id: config.id,
			min: config.schema.minimum,
			max: config.schema.maximum,
			step: config.schema.multipleOf,
			type: 'single',
			onValueChange: handlers.oninput,
			onValueCommit: handlers.onchange,
			...config.uiOptions?.shadcnRange,
			...ctx.extraUiOptions?.('shadcnRange', config)
		};
		return defineDisabled(ctx, props);
	});
</script>

<Slider bind:value={() => value ?? 0, (v) => (value = v)} {...attributes} />
