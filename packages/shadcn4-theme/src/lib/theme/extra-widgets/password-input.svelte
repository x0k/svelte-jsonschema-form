<script lang="ts" module>
	import '@sjsf/form/fields/extra-widgets/password-input';

	import type { InputProps } from '../types/input.js';

	declare module '@sjsf/form' {
		interface UiOptions {
			shadcn4PasswordInput?: InputProps;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';

	import { getThemeContext } from '../context.js';

	const ctx = getFormContext();
	const themeCtx = getThemeContext();

	const { Input } = $derived(themeCtx.components);

	let { value = $bindable(), config, handlers }: ComponentProps['passwordInputWidget'] = $props();

	const attributes = $derived(
		inputAttributes(ctx, config, 'shadcn4PasswordInput', handlers, {
			type: 'password'
		})
	);
</script>

<Input bind:value {...attributes} />
