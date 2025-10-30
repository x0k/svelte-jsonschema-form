<script lang="ts" module>
	import type { Component } from 'svelte';
	import type { WidgetCommonProps } from '@sjsf/form/fields/widgets';

	import type { PhoneInputProps } from '$lib/components/ui/phone-input/types.js';

	declare module '@sjsf/form' {
		interface ComponentProps {
			shadcnExtrasPhoneInputWidget: WidgetCommonProps<string>;
		}
		interface ComponentBindings {
			shadcnExtrasPhoneInputWidget: 'value';
		}
		interface UiOptions {
			shadcnExtrasPhoneInput?: PhoneInputProps;
		}
	}

	declare module '@sjsf/shadcn4-theme' {
		interface ThemeComponents {
			PhoneInput: Component<
				PhoneInputProps,
				{ focus: () => void },
				'country' | 'placeholder' | 'readonly' | 'disabled' | 'value' | 'valid' | 'detailedValue'
			>;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';
	import { getThemeContext } from '@sjsf/shadcn4-theme';

	let {
		config,
		value = $bindable(),
		handlers,
		errors
	}: ComponentProps['shadcnExtrasPhoneInputWidget'] = $props();

	const ctx = getFormContext();
	const themeCtx = getThemeContext();

	const { PhoneInput } = $derived(themeCtx.components);
</script>

<PhoneInput
	bind:value={() => value ?? null, (v) => (value = v ?? undefined)}
	{...inputAttributes(ctx, config, 'shadcnExtrasPhoneInput', handlers, {
		valid: errors.length === 0
	})}
/>
