<script lang="ts" module>
	import type { ButtonProps } from '../types/button.js';

	declare module '@sjsf/form' {
		interface UiOptions {
			shadcn4SubmitButton?: ButtonProps;
		}
	}
</script>

<script lang="ts">
	import { buttonAttributes, getFormContext, type ComponentProps } from '@sjsf/form';

	import { getThemeContext } from '../context.js';

	const { children, config }: ComponentProps['submitButton'] = $props();

	const ctx = getFormContext();
	const themeCtx = getThemeContext();
	const { Button } = $derived(themeCtx.components);
</script>

<Button {...buttonAttributes(ctx, config, 'shadcn4SubmitButton', 'submit', {})}>
	{@render children()}
</Button>
