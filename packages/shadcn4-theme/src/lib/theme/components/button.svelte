<script lang="ts" module>
	import type { ButtonType } from '@sjsf/form/fields/components';

	import type { ButtonProps } from '../types/button.js';

	declare module '@sjsf/form' {
		interface UiOptions {
			shadcn4Button?: ButtonProps;
			shadcn4Buttons?: {
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

	import { getThemeContext } from '../context.js';

	const { children, disabled, onclick, config, type }: ComponentProps['button'] = $props();

	const ctx = getFormContext();
	const themeCtx = getThemeContext();
	const { Button } = $derived(themeCtx.components);
</script>

<Button
	{...composeProps(
		ctx,
		config,
		{
			type: 'button',
			disabled,
			onclick
		} satisfies ButtonProps,
		uiOptionProps('shadcn4Button'),
		uiOptionNestedProps('shadcn4Buttons', (b) => b[type]),
		disabledProp
	)}
>
	{@render children()}
</Button>
