<script lang="ts" module>
	import type { SliderSingleRootProps, WithoutChildrenOrChild } from 'bits-ui';
	import '@sjsf/form/fields/extra-widgets/range';

	declare module '@sjsf/form' {
		interface UiOptions {
			shadcnRange?: Omit<WithoutChildrenOrChild<SliderSingleRootProps>, 'type'>;
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
			type: 'single',
			onValueChange: handlers.oninput,
			onValueCommit: handlers.onchange,
			...config.uiOptions?.shadcnRange
		};
		return defineDisabled(ctx, props);
	});
</script>

<Slider bind:value={() => value ?? 0, (v) => (value = v)} {...attributes} />
