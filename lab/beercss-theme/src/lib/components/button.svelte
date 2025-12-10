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

	const { children, type, disabled, onclick, config }: ComponentProps['button'] = $props();

	const ctx = getFormContext();
</script>

<button
	{...composeProps(
		ctx,
		config,
		{ type: 'button', onclick, disabled, class: 'small fill' } satisfies HTMLButtonAttributes,
		uiOptionProps('button'),
		uiOptionNestedProps('buttons', (b) => b[type]),
		disabledProp
	)}
>
	{@render children()}
</button>
