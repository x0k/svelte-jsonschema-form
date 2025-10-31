<script lang="ts" module>
	import type { Component } from 'svelte';
	import type { WidgetCommonProps } from '@sjsf/form/fields/widgets';

	import type { IPv4AddressInputProps } from '$lib/components/ui/ipv4address-input/types.js';

	declare module '@sjsf/form' {
		interface ComponentProps {
			shadcnExtrasIPv4AddressInputWidget: WidgetCommonProps<string>;
		}
		interface ComponentBindings {
			shadcnExtrasIPv4AddressInputWidget: 'value';
		}
		interface UiOptions {
			shadcnExtrasIPv4AddressInput?: IPv4AddressInputProps;
		}
	}

	declare module '@sjsf/shadcn4-theme' {
		interface ThemeComponents {
			IPv4AddressInput: Component<IPv4AddressInputProps, {}, 'value' | 'valid'>;
		}
	}
</script>

<script lang="ts">
	import { getId, getFormContext, uiOptionProps, type ComponentProps } from '@sjsf/form';
	import { getThemeContext } from '@sjsf/shadcn4-theme';

	let {
		value = $bindable(),
		errors,
		config
	}: ComponentProps['shadcnExtrasIPv4AddressInputWidget'] = $props();

	const ctx = getFormContext();
	const themeCtx = getThemeContext();

	const { IPv4AddressInput } = $derived(themeCtx.components);

	const id = $derived(getId(ctx, config.path));
</script>

<IPv4AddressInput
	bind:value={() => value ?? null, (v) => (value = v ?? undefined)}
	{...uiOptionProps('shadcnExtrasIPv4AddressInput')(
		{
			name: id,
			valid: errors.length === 0
		},
		config,
		ctx
	)}
/>
