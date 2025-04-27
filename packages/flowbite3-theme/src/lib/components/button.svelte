<script lang="ts" module>
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { ButtonProps as ButtonPropsUnion } from 'flowbite-svelte';
	import type { ButtonType } from '@sjsf/form/fields/exports';

	type ButtonProps = Extract<ButtonPropsUnion, { type?: HTMLButtonAttributes['type'] }>;

	declare module '@sjsf/form' {
		interface UiOptions {
			flowbite3Button?: ButtonProps;
			flowbite3Buttons?: {
				[B in ButtonType]?: ButtonProps;
			};
		}
	}
</script>

<script lang="ts">
	import {
		defineDisabled,
		getFormContext,
		retrieveNestedUiProps,
		retrieveUiProps,
		type ComponentProps
	} from '@sjsf/form';
	import Button from 'flowbite-svelte/Button.svelte';

	const { children, type, disabled, onclick, config }: ComponentProps['button'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(
		defineDisabled(
			ctx,
			retrieveNestedUiProps(
				ctx,
				config,
				'flowbite3Buttons',
				(p) => p[type],
				retrieveUiProps(ctx, config, 'flowbite3Button', {
					color: 'alternative',
					type: 'button',
					size: 'sm',
					disabled,
					onclick
				})
			)
		)
	);
</script>

<Button {...attributes}>
	{@render children()}
</Button>
