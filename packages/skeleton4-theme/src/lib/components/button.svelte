<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import {
		composeProps,
		disabledProp,
		getFormContext,
		uiOptionNestedProps,
		uiOptionProps,
		type ComponentProps
	} from '@sjsf/form';
	import '@sjsf/basic-theme/components/button.svelte';

	const { children, onclick, config, disabled, type }: ComponentProps['button'] = $props();

	const ctx = getFormContext();
</script>

<button
	class="btn preset-filled"
	{...composeProps(
		ctx,
		config,
		{
			type: 'button',
			disabled,
			onclick
		} satisfies HTMLButtonAttributes,
		uiOptionProps('button'),
		uiOptionNestedProps('buttons', (b) => b[type]),
		disabledProp
	)}
>
	{@render children()}
</button>
