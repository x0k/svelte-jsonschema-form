<script lang="ts" module>
	import type { ButtonProps } from '../types/button';

	declare module '@sjsf/form' {
		interface UiOptions {
			shadcnSubmitButton?: ButtonProps;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, retrieveInputAttributes, type ComponentProps } from '@sjsf/form';

	import { getThemeContext } from '../context';

	const { children, config }: ComponentProps['submitButton'] = $props();

	const ctx = getFormContext();
	const themeCtx = getThemeContext();
	const { Button } = $derived(themeCtx.components);

	const attributes = $derived(
		retrieveInputAttributes(ctx, config, 'shadcnSubmitButton', () => ({
			type: 'submit'
		}))
	);
</script>

<Button type="submit" {...attributes}>
	{@render children()}
</Button>
