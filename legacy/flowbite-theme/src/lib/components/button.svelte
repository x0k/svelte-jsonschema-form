<script lang="ts" module>
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { ButtonProps as ButtonPropsUnion } from 'flowbite-svelte/Button.svelte';
	import type { ButtonType } from '@sjsf/form/fields/exports';

	type ButtonProps = Extract<ButtonPropsUnion, { type?: HTMLButtonAttributes['type'] }>;

	declare module '@sjsf/form' {
		interface UiOptions {
			flowbiteButton?: ButtonProps;
			flowbiteButtons?: {
				[B in ButtonType]?: ButtonProps;
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
	import Button from 'flowbite-svelte/Button.svelte';

	const { children, type, disabled, onclick, config }: ComponentProps['button'] = $props();

	const ctx = getFormContext();
</script>

<Button
	{...composeProps(
		ctx,
		config,
		{
			color: 'alternative',
			type: 'button',
			size: 'sm',
			disabled,
			onclick
		} satisfies ButtonProps,
		uiOptionProps('flowbiteButton'),
		uiOptionNestedProps('flowbiteButtons', (b) => b[type]),
		disabledProp
	)}
>
	{@render children()}
</Button>
