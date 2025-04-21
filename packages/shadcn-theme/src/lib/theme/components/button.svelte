<script lang="ts" module>
	import type { ButtonType } from '@sjsf/form/fields/components';

	import type { ButtonProps } from '../types/button';

	declare module '@sjsf/form' {
		interface UiOptions {
			shadcnButton?: ButtonProps;
			shadcnButtons?: {
				[B in ButtonType]: ButtonProps;
			};
		}
	}
</script>

<script lang="ts">
	import { defineDisabled, getFormContext, type ComponentProps } from '@sjsf/form';

	import { getThemeContext } from '../context';

	const { children, disabled, onclick, config, type }: ComponentProps['button'] = $props();

	const ctx = getFormContext();
	const themeCtx = getThemeContext();
	const { Button } = $derived(themeCtx.components);

	const attributes = $derived(
		defineDisabled(ctx, {
			type: 'button' as const,
			onclick,
			disabled,
			...config.uiOptions?.shadcnButton,
			...config.uiOptions?.shadcnButtons?.[type],
			...ctx.extraUiOptions?.('shadcnButton', config),
			...ctx.extraUiOptions?.('shadcnButtons', config)?.[type]
		})
	);
</script>

<Button {...attributes}>
	{@render children()}
</Button>
