<script lang="ts" module>
	import type { HTMLFormAttributes } from 'svelte/elements';

	declare module '@sjsf/form' {
		interface FormElements {
			flowbiteForm: HTMLFormElement;
		}

		interface FormProps {
			flowbiteForm: HTMLFormAttributes;
		}

		interface UiOptions {
			flowbiteForm?: HTMLFormAttributes;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, type ComponentProps } from '@sjsf/form';

	let { config, children, ref = $bindable(), attributes }: ComponentProps['form'] = $props();

	const ctx = getFormContext();
</script>

<form
	bind:this={ref}
	class="flex flex-col gap-4"
	onsubmit={ctx.submitHandler}
	onreset={ctx.resetHandler}
	{...config.uiOptions?.flowbiteForm}
	{...attributes}
>
	{@render children?.()}
</form>
