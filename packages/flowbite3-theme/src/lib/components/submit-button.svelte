<script lang="ts" module>
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { ButtonProps as ButtonPropsUnion } from 'flowbite-svelte/types';

	type ButtonProps = Extract<ButtonPropsUnion, { type?: HTMLButtonAttributes['type'] }>;

	declare module '@sjsf/form' {
		interface UiOptions {
			flowbite3SubmitButton?: ButtonProps;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, buttonAttributes, type ComponentProps } from '@sjsf/form';
	import Button from 'flowbite-svelte/Button.svelte';

	const { children, config }: ComponentProps['submitButton'] = $props();

	const ctx = getFormContext();
</script>

<Button
	color="primary"
	type="submit"
	size="md"
	{...buttonAttributes(ctx, config, 'flowbite3SubmitButton', 'submit', {
		type: 'submit',
		size: 'md'
	})}
>
	{@render children()}
</Button>
