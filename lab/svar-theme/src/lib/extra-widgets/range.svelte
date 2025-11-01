<script lang="ts" module>
	import type { ComponentProps as SvelteComponentProps } from 'svelte';
	import { Slider as SvarSlider } from '@svar-ui/svelte-core';
	import '@sjsf/form/fields/extra-widgets/range';

	declare module '@sjsf/form' {
		interface UiOptions {
			svarRange?: SvelteComponentProps<typeof SvarSlider>;
		}
	}
</script>

<script lang="ts">
	import {
		getFormContext,
		getId,
		isDisabled,
		uiOptionProps,
		type ComponentProps
	} from '@sjsf/form';

	let { value = $bindable(), config, handlers }: ComponentProps['rangeWidget'] = $props();

	const ctx = getFormContext();

	const id = $derived(getId(ctx, config.path));
</script>

<SvarSlider
	bind:value={() => value ?? 0, (v) => (value = v)}
	{...uiOptionProps('svarRange')(
		{
			id,
			min: config.schema.minimum,
			max: config.schema.maximum,
			step: config.schema.multipleOf,
			disabled: isDisabled(ctx),
			onchange: ({ input }) => {
				if (input) {
					handlers.oninput?.();
				} else {
					handlers.onchange?.();
				}
			}
		},
		config,
		ctx
	)}
/>
