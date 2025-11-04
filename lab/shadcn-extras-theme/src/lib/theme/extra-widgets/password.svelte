<script lang="ts" module>
	import type { Component } from 'svelte';
	import type { WidgetCommonProps } from '@sjsf/form/fields/widgets';

	import type {
		PasswordInputProps,
		PasswordRootProps,
		PasswordStrengthProps,
		PasswordToggleVisibilityProps
	} from '$lib/components/ui/password/types.js';

	declare module '@sjsf/form' {
		interface ComponentProps {
			shadcnExtrasPasswordWidget: WidgetCommonProps<string>;
		}
		interface ComponentBindings {
			shadcnExtrasPasswordWidget: 'value';
		}
		interface UiOptions {
			shadcnExtrasPassword?: PasswordInputProps;
		}
	}

	declare module '@sjsf/shadcn4-theme' {
		interface ThemeComponents {
			PasswordRoot: Component<PasswordRootProps, {}, 'ref' | 'hidden'>;
			PasswordInput: Component<PasswordInputProps, {}, 'ref' | 'value'>;
			PasswordToggleVisibility: Component<PasswordToggleVisibilityProps, {}, 'ref'>;
			PasswordStrength: Component<PasswordStrengthProps, {}, 'strength'>;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';
	import { getThemeContext } from '@sjsf/shadcn4-theme';

	let {
		config,
		handlers,
		value = $bindable()
	}: ComponentProps['shadcnExtrasPasswordWidget'] = $props();

	const ctx = getFormContext();
	const themeCtx = getThemeContext();

	const { PasswordInput, PasswordRoot, PasswordStrength, PasswordToggleVisibility } = $derived(
		themeCtx.components
	);
</script>

<PasswordRoot>
	<PasswordInput
		bind:value={() => value ?? '', (v) => (value = v)}
		{...inputAttributes(ctx, config, 'shadcnExtrasPassword', handlers, {})}
	>
		<PasswordToggleVisibility />
	</PasswordInput>
	<PasswordStrength />
</PasswordRoot>
