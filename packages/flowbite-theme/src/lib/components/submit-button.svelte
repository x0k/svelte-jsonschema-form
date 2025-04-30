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
	import { getFormContext, retrieveInputAttributes, type ComponentProps } from '@sjsf/form';
	import Button from 'flowbite-svelte/Button.svelte';

	const { children, config }: ComponentProps['submitButton'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(
		retrieveInputAttributes(ctx, config, 'flowbiteSubmitButton', () => ({
			color: 'primary',
			type: 'submit',
			size: 'md'
		}))
	);
</script>

<Button {...attributes}>
	{@render children()}
</Button>
