<script lang="ts" module>
	import type { SliderSingleRootProps, WithoutChildrenOrChild } from 'bits-ui';
	declare module '@sjsf/form' {
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

	let { value = $bindable(), config, handlers }: ComponentProps['numberWidget'] = $props();

	const slider = {
		get value() {
			return value ?? 0;
		},
		set value(v) {
			value = v;
		}
	};

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

<Slider bind:value={slider.value} {...attributes} />
