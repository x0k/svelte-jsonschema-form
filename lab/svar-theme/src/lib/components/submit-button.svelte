<script lang="ts" module>
	import type { ComponentProps as SvelteComponentProps } from 'svelte';
	import { Button as SvarButton } from '@svar-ui/svelte-core';

	declare module '@sjsf/form' {
		interface UiOptions {
			svarSubmitButton?: SvelteComponentProps<typeof SvarButton>;
		}
	}
</script>

<script lang="ts">
	import {
		composeProps,
		uiOptionProps,
		disabledProp,
		getFormContext,
		type ComponentProps
	} from '@sjsf/form';

	const { children, config }: ComponentProps['submitButton'] = $props();

	const ctx = getFormContext();
</script>

<SvarButton
	{...composeProps(
		ctx,
		config,
		{
			type: 'primary block'
		} satisfies SvelteComponentProps<typeof SvarButton>,
		uiOptionProps('svarSubmitButton'),
		disabledProp
	)}
>
	{@render children()}
</SvarButton>
