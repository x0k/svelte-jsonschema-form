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
	import { getFormContext, defineDisabled, type ComponentProps } from '@sjsf/form';

	let { value = $bindable(), config, handlers, errors }: ComponentProps['rangeWidget'] = $props();

	const ctx = getFormContext();

	const attributes: SvelteComponentProps<typeof SkeletonSlider> = $derived(
		defineDisabled(ctx, {
			ids: {
				hiddenInput() {
					return config.id;
				}
			},
			name: config.name,
			readOnly: config.schema.readOnly,
			min: config.schema.minimum,
			max: config.schema.maximum,
			step: config.schema.multipleOf,
			invalid: errors.length > 0,
			onFocusChange: handlers.onblur,
			onValueChange: (details) => {
				value = details.value[0];
				handlers.onchange?.();
			},
			...config.uiOptions?.skeleton3Slider,
			...ctx.extraUiOptions?.('skeleton3Slider', config)
		})
	);
	const boxed = $derived.by(() => {
		if (value === undefined) {
			return undefined;
		}
		return [value];
	});
</script>

<SkeletonSlider value={boxed} {...attributes} />
