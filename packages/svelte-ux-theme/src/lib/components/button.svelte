<script lang="ts" module>
	declare module "@sjsf/form" {
		interface UiOptions {
			// svelteUxButton: 
		}
	}
</script>
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
	import { Button } from 'svelte-ux';

	const { children, type, disabled, onclick, config }: ComponentProps['button'] = $props();

	const ctx = getFormContext();
</script>

<!-- <button
	class="btn join-item btn-sm"
	{...composeProps(
		ctx,
		config,
		{ type: 'button', onclick, disabled } satisfies HTMLButtonAttributes,
		uiOptionProps('button'),
		uiOptionNestedProps('buttons', (b) => b[type]),
		disabledProp
	)}
>
	{@render children()}
</button> -->
<Button>
	{@render children()}
</Button>