<script lang="ts" module>
	import type { ButtonProps } from '../types/button';

	declare module '@sjsf/form' {
		interface UiOptions {
			shadcnSubmitButton?: ButtonProps;
		}
	}
</script>

<script lang="ts">
	import { buttonAttributes, getFormContext, type ComponentProps } from '@sjsf/form';

	import { getThemeContext } from '../context';

	const { children, config }: ComponentProps['submitButton'] = $props();

	const ctx = getFormContext();
	const themeCtx = getThemeContext();
	const { Button } = $derived(themeCtx.components);
</script>

<Button {...buttonAttributes(ctx, config, 'shadcnSubmitButton', 'submit', {})}>
	{@render children()}
</Button>
