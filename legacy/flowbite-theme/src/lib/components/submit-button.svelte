<script lang="ts" module>
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { ButtonProps as ButtonPropsUnion } from 'flowbite-svelte/Button.svelte';

	type ButtonProps = Extract<ButtonPropsUnion, { type?: HTMLButtonAttributes['type'] }>;

	declare module '@sjsf/form' {
		interface UiOptions {
			flowbiteSubmitButton?: ButtonProps;
		}
	}
</script>

<script lang="ts">
	import { buttonAttributes, getFormContext, type ComponentProps } from '@sjsf/form';
	import Button from 'flowbite-svelte/Button.svelte';

	const { children, config }: ComponentProps['submitButton'] = $props();

	const ctx = getFormContext();
</script>

<Button
	{...buttonAttributes(ctx, config, 'flowbiteSubmitButton', 'submit', {
		color: 'primary',
		size: 'md'
	})}
>
	{@render children()}
</Button>
