<script lang="ts" module>
	import CarbonButton, {
		type ButtonProps
	} from 'carbon-components-svelte/src/Button/Button.svelte';
	import type { ButtonType } from '@sjsf/form/fields/components';

	declare module '@sjsf/form' {
		interface UiOptions {
			carbonButton?: ButtonProps;
			carbonButtons?: {
				[B in ButtonType]: ButtonProps;
			};
		}
	}
</script>

<script lang="ts">
	import {
		composeProps,
		disabledProp,
		getFormContext,
		uiOptionNestedProps,
		uiOptionProps,
		type ComponentProps
	} from '@sjsf/form';

	const { children, onclick, config, disabled, type }: ComponentProps['button'] = $props();

	const ctx = getFormContext();
</script>

<CarbonButton
	{...composeProps(
		ctx,
		config,
		{
			// type: 'button',
			disabled,
			onclick: (e: MouseEvent) => {
				e.preventDefault();
				onclick();
			},
			children
		},
		uiOptionProps('carbonButton'),
		uiOptionNestedProps('carbonButtons', (b) => b[type]),
		disabledProp
	)}
/>
