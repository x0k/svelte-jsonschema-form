<script lang="ts" module>
	import type { HTMLFormAttributes } from 'svelte/elements';

	declare module '@sjsf/form' {
		interface FormElements {
			skeletonForm: HTMLFormElement;
		}

		interface FormProps {
			skeletonForm: HTMLFormAttributes;
		}

		interface UiOptions {
			skeletonForm?: HTMLFormAttributes;
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
	onsubmit={ctx.submitHandler}
	onreset={ctx.resetHandler}
	class="flex flex-col gap-4"
	{...config.uiOptions?.skeletonForm}
	{...attributes}
>
	{@render children?.()}
</form>
