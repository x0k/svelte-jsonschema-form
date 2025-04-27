<script lang="ts" module>
	import type { HTMLFormAttributes } from 'svelte/elements';

	declare module '@sjsf/form' {
		interface UiOptions {
			flowbiteForm?: HTMLFormAttributes;
		}
	}
</script>

<script lang="ts">
	import { enhance, getFormContext, retrieveUiProps, type ComponentProps } from '@sjsf/form';

	let { config, children, ref = $bindable(), attributes }: ComponentProps['form'] = $props();

	const ctx = getFormContext();
</script>

<form
	bind:this={ref}
	use:enhance={ctx}
	class="flex flex-col gap-4"
	{...retrieveUiProps(ctx, config, 'flowbiteForm', {})}
	{...attributes}
>
	{@render children?.()}
</form>
