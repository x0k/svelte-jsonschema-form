<script lang="ts" module>
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { ButtonProps as ButtonPropsUnion } from 'flowbite-svelte';

	type ButtonProps = Extract<ButtonPropsUnion, { type?: HTMLButtonAttributes['type'] }>;

	declare module '@sjsf/form' {
		interface UiOptions {
			flowbite3SubmitButton?: ButtonProps;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, retrieveAttributes, type ComponentProps } from '@sjsf/form';
	import Button from 'flowbite-svelte/Button.svelte';

	const { children, config }: ComponentProps['submitButton'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(
		retrieveAttributes(ctx, config, 'flowbite3SubmitButton', () => ({
			color: 'primary',
			type: 'submit',
			size: 'md'
		}))
	);
</script>

<Button color="primary" type="submit" size="md" {...attributes}>
	{@render children()}
</Button>
