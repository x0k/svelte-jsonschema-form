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
	import { defineDisabled, getFormContext, type ComponentProps } from '@sjsf/form';
	import Button from 'flowbite-svelte/Button.svelte';

	const { children, type, disabled, onclick, config }: ComponentProps['button'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(
		defineDisabled(ctx, {
			disabled,
			onclick,
			...config.uiOptions?.flowbiteButton,
			...config.uiOptions?.flowbiteButtons?.[type]
		})
	);
</script>

<Button color="alternative" type="button" size="sm" {...attributes}>
	{@render children()}
</Button>
