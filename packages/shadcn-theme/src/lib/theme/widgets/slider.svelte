<script lang="ts" module>
	import type { SliderSingleRootProps, WithoutChildrenOrChild } from 'bits-ui';
	import type { WidgetCommonProps } from '@sjsf/legacy-fields/widgets';
	declare module '@sjsf/form' {
		interface ComponentProps {
			shadcnSliderWidget: WidgetCommonProps<number>;
		}
		interface ComponentBindings {
			shadcnSliderWidget: 'value';
		}
		interface UiOptions {
			shadcnSlider?: Omit<WithoutChildrenOrChild<SliderSingleRootProps>, 'type'>;
		}
	}
</script>

<script lang="ts">
	import { defineDisabled, getFormContext, type ComponentProps } from '@sjsf/form';

	import { getThemeContext } from '../context';

	const ctx = getFormContext();
	const themeCtx = getThemeContext();

	const { Slider } = $derived(themeCtx.components);

	let { value = $bindable(), config, handlers }: ComponentProps['shadcnSliderWidget'] = $props();

	const attributes = $derived.by(() => {
		const props: SliderSingleRootProps = {
			type: 'single',
			onValueChange: handlers.oninput,
			onValueCommit: handlers.onchange,
			...config.uiOptions?.shadcnSlider
		};
		return defineDisabled(ctx, props);
	});
</script>

<Slider bind:value={() => value ?? 0, (v) => (value = v)} {...attributes} />
